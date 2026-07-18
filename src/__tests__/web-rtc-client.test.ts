import { Invitation, SessionState } from 'sip.js/lib/api';

import WebRTCClient, { toAssertedIdentity } from '../web-rtc-client';

jest.mock('sip.js/lib/platform/web/transport');
jest.mock('sip.js/lib/api/user-agent', () => ({
  start: () => {},
  UserAgent: class UserAgent {
    static makeURI: () => null = () => null;

    start = () => {};

    transport = {};
  },
}));

const client = new WebRTCClient({} as any, undefined, undefined);

describe('ON_MEDIA_CONNECTED event', () => {
  const spies: jest.SpyInstance[] = [];

  afterEach(() => {
    spies.forEach(s => s.mockRestore());
    spies.length = 0;
    (client as any).mediaConnectedSessions = {};
  });

  const stubOnAccepted = (sessionId: string) => {
    spies.push(
      jest.spyOn(client as any, '_setupMedias').mockResolvedValue(undefined),
      jest.spyOn(client, 'updateRemoteStream').mockImplementation(() => {}),
      jest.spyOn(client, 'getSipSessionId').mockReturnValue(sessionId),
      jest.spyOn(client, 'storeSipSession').mockImplementation(() => {}),
      jest.spyOn(client as any, '_startSendingStats').mockImplementation(() => {}),
    );
  };

  const makeMockSession = () => {
    const pc = {
      connectionState: 'new',
      onconnectionstatechange: null as (() => void) | null,
      iceConnectionState: 'new',
      oniceconnectionstatechange: null as (() => void) | null,
      addEventListener: jest.fn(),
    };
    const remoteStream = {
      getTracks: jest.fn(() => []),
      getAudioTracks: jest.fn(() => []),
      getVideoTracks: jest.fn(() => []),
      onaddtrack: null,
    };
    const session = {
      sessionDescriptionHandler: { peerConnection: pc, remoteMediaStream: remoteStream },
      sessionDescriptionHandlerModifiersReInvite: [],
    } as any;
    return { session, pc };
  };

  it('should emit onMediaConnected when pc.connectionState reaches connected', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc } = makeMockSession();
    stubOnAccepted('session-1');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    expect(pc.onconnectionstatechange).toBeDefined();

    (pc as any).connectionState = 'connected';
    pc.onconnectionstatechange!();

    expect(emitSpy).toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, session);
  });

  it('should NOT emit onMediaConnected for non-connected states', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc } = makeMockSession();
    (pc as any).connectionState = 'connecting';
    stubOnAccepted('session-2');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    pc.onconnectionstatechange!();

    expect(emitSpy).not.toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, expect.anything());
  });

  it('should emit onMediaConnected immediately if connectionState is already connected when handler is registered', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc } = makeMockSession();
    // Simulate connection completing before handler registration
    (pc as any).connectionState = 'connected';
    stubOnAccepted('session-3');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    expect(emitSpy).toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, session);
  });

  it('should not emit onMediaConnected twice if already connected and handler fires', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc } = makeMockSession();
    (pc as any).connectionState = 'connected';
    stubOnAccepted('session-4');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    // Simulate the handler also firing (browser queued event)
    pc.onconnectionstatechange!();

    const mediaConnectedCalls = emitSpy.mock.calls.filter(
      ([event]) => event === client.ON_MEDIA_CONNECTED,
    );
    expect(mediaConnectedCalls).toHaveLength(1);
  });

  it('should NOT emit onMediaConnected again on re-INVITE for the same session', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc } = makeMockSession();
    stubOnAccepted('session-5');

    // First _onAccepted: connection reaches 'connected'
    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);
    (pc as any).connectionState = 'connected';
    pc.onconnectionstatechange!();

    // Simulate a re-INVITE (e.g. hold/unhold) calling _onAccepted again
    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    // The handler fires again but should NOT emit a second time
    pc.onconnectionstatechange!();

    const mediaConnectedCalls = emitSpy.mock.calls.filter(
      ([event]) => event === client.ON_MEDIA_CONNECTED,
    );
    expect(mediaConnectedCalls).toHaveLength(1);
  });
});

describe('WebRTC client', () => {
  it('should compute muted/unmuted state', async () => {
    const mutedSession = {
      sessionDescriptionHandler: {
        peerConnection: {
          getSenders: () => [{
            track: {
              kind: 'audio',
              enabled: false,
            },
          }],
        },
      },
    };
    const unMutedSession = {
      sessionDescriptionHandler: {
        peerConnection: {
          getSenders: () => [{
            track: {
              kind: 'audio',
              enabled: true,
            },
          }],
        },
      },
    };
    const oldKindMuted = {
      sessionDescriptionHandler: {
        peerConnection: {
          getLocalStreams: () => [{
            getAudioTracks: () => [{
              enabled: false,
            }],
          }],
        },
      },
    };
    const oldKindUnmuted = {
      sessionDescriptionHandler: {
        peerConnection: {
          getLocalStreams: () => [{
            getAudioTracks: () => [{
              enabled: true,
            }],
          }],
        },
      },
    };

    expect(client.isAudioMuted(mutedSession as any)).toBeTruthy();
    expect(client.isAudioMuted(oldKindMuted as any)).toBeTruthy();
    expect(client.isAudioMuted(unMutedSession as any)).toBeFalsy();
    expect(client.isAudioMuted(oldKindUnmuted as any)).toBeFalsy();
  });

  describe('reject', () => {
    it('should call _reject with 603 Decline when session is an Invitation', async () => {
      const rejectMock = jest.fn().mockResolvedValue(undefined);
      const session = Object.create(Invitation.prototype, {
        state: { value: SessionState.Initial },
        incomingInviteRequest: { value: { rejectable: true } },
        reject: { value: rejectMock },
      });

      await client.reject(session);

      expect(rejectMock).toHaveBeenCalledWith({
        statusCode: 603,
        reasonPhrase: 'Decline',
      });
    });

    it('should not reject an Invitation in wrong state', async () => {
      const rejectMock = jest.fn();
      const session = Object.create(Invitation.prototype, {
        state: { value: SessionState.Terminated },
        incomingInviteRequest: { value: { rejectable: true, message: { callId: 'test' } } },
        reject: { value: rejectMock },
      });

      await client.reject(session);

      expect(rejectMock).not.toHaveBeenCalled();
    });

    it('should not reject an Invitation when not rejectable', async () => {
      const rejectMock = jest.fn();
      const session = Object.create(Invitation.prototype, {
        state: { value: SessionState.Initial },
        incomingInviteRequest: { value: { rejectable: false, message: { callId: 'test' } } },
        reject: { value: rejectMock },
      });

      await client.reject(session);

      expect(rejectMock).not.toHaveBeenCalled();
    });
  });
});
describe('ICE reconnect reinvite guard', () => {
  let reinviteSpy: jest.SpyInstance;
  const spies: jest.SpyInstance[] = [];

  beforeEach(() => {
    jest.useFakeTimers();
    reinviteSpy = jest.spyOn(client, 'reinvite').mockResolvedValue(undefined as any);
    spies.push(
      jest.spyOn(client as any, '_setupMedias').mockResolvedValue(undefined),
      jest.spyOn(client, 'updateRemoteStream').mockImplementation(() => {}),
      jest.spyOn(client, 'storeSipSession').mockImplementation(() => {}),
      jest.spyOn(client as any, '_startSendingStats').mockImplementation(() => {}),
      jest.spyOn(client, 'isConference').mockReturnValue(false),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    spies.forEach(s => s.mockRestore());
    spies.length = 0;
    reinviteSpy.mockRestore();
    (client as any).mediaConnectedSessions = {};
    (client as any).iceReconnectAttempts = {};
  });

  const buildSession = (sessionId: string, state: SessionState) => {
    const pc = {
      connectionState: 'new',
      onconnectionstatechange: null as (() => void) | null,
      iceConnectionState: 'new',
      oniceconnectionstatechange: null as (() => void) | null,
      addEventListener: jest.fn(),
    };
    const remoteStream = {
      getTracks: jest.fn(() => []),
      getAudioTracks: jest.fn(() => []),
      getVideoTracks: jest.fn(() => []),
      onaddtrack: null,
    };
    const session = {
      state,
      sessionDescriptionHandler: { peerConnection: pc, remoteMediaStream: remoteStream },
      sessionDescriptionHandlerModifiersReInvite: [],
    } as any;
    spies.push(jest.spyOn(client, 'getSipSessionId').mockReturnValue(sessionId));
    return { session, pc };
  };

  it('reinvites when the session is still Established when the timer fires', async () => {
    const { session, pc } = buildSession('ice-1', SessionState.Established);

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    (pc as any).iceConnectionState = 'disconnected';
    pc.oniceconnectionstatechange!();
    jest.runAllTimers();

    expect(reinviteSpy).toHaveBeenCalledWith(session, null, false, false, true);
  });

  it('skips the reinvite when the session has Terminated before the timer fires', async () => {
    const { session, pc } = buildSession('ice-2', SessionState.Established);

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    (pc as any).iceConnectionState = 'disconnected';
    pc.oniceconnectionstatechange!();
    session.state = SessionState.Terminated;
    jest.runAllTimers();

    expect(reinviteSpy).not.toHaveBeenCalled();
  });

  it('skips the reinvite when the session is Terminating when the timer fires', async () => {
    const { session, pc } = buildSession('ice-3', SessionState.Established);

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    (pc as any).iceConnectionState = 'disconnected';
    pc.oniceconnectionstatechange!();
    session.state = SessionState.Terminating;
    jest.runAllTimers();

    expect(reinviteSpy).not.toHaveBeenCalled();
  });
});

describe('changeAudioInputDevice', () => {
  const defaultId = 'default';
  const deviceId = 'device1';
  const constraints = {
    audio: {
      deviceId: {
        exact: defaultId,
      },
    },
    video: null,
  };
  const session = {
    sessionDescriptionHandler: {
      peerConnection: {
        getSenders: () => [{
          track: {
            kind: 'audio',
            enabled: true,
          },
        }],
      },
    },
  };
  const stream = {};
  const getAudioTracksMock = jest.fn(() => []);
  Object.defineProperty(stream, 'getAudioTracks', {
    value: getAudioTracksMock,
  });
  const getUserMediaMock = jest.fn(async () => {
    return new Promise(resolve => {
      resolve(stream);
    });
  });
  const devices = [{
    deviceId: 'default',
    kind: 'audioinput',
    label: 'Default - Fake Microphone',
    groupId: 'fak3Gr0up3',
  }, {
    deviceId: 'fak3d3v1c3',
    kind: 'audioinput',
    label: 'Fake Microphone',
    groupId: 'fak3Gr0up3',
  }];
  const enumerateDevicesMock = jest.fn(async () => {
    return new Promise(resolve => {
      resolve(devices);
    });
  });
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: getUserMediaMock,
      enumerateDevices: enumerateDevicesMock,
    },
  });
  it('should preserve audio processing constraints when switching device', async () => {
    const audioConstraints = {
      audio: {
        deviceId: { exact: 'old-device' },
        echoCancellation: true,
        noiseSuppression: false,
        autoGainControl: true,
      },
      video: null,
    };
    client.setMediaConstraints(audioConstraints as any);

    await client.changeAudioInputDevice('new-device', session as any);

    expect((client as any).audio).toEqual({
      deviceId: { exact: 'new-device' },
      echoCancellation: true,
      noiseSuppression: false,
      autoGainControl: true,
    });
  });

  it('should pass preserved audio processing constraints to getUserMedia', async () => {
    getUserMediaMock.mockClear();
    const audioConstraints = {
      audio: {
        deviceId: { exact: 'old-device' },
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
      },
      video: null,
    };
    client.setMediaConstraints(audioConstraints as any);

    await client.changeAudioInputDevice('new-device', session as any);

    expect(getUserMediaMock).toHaveBeenCalledWith({
      audio: {
        deviceId: { exact: 'new-device' },
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
      },
    });
  });

  it('should not preserve non-processing audio constraints (only echoCancellation, noiseSuppression, autoGainControl)', async () => {
    const audioConstraints = {
      audio: {
        deviceId: { exact: 'old-device' },
        echoCancellation: true,
        sampleRate: 48000,
        channelCount: 2,
      },
      video: null,
    };
    client.setMediaConstraints(audioConstraints as any);

    await client.changeAudioInputDevice('new-device', session as any);

    // sampleRate and channelCount should NOT be preserved
    expect((client as any).audio).toEqual({
      deviceId: { exact: 'new-device' },
      echoCancellation: true,
    });
  });

  it('should handle audio=true (boolean) without errors during device switch', async () => {
    client.setMediaConstraints({ audio: true, video: null } as any);

    await client.changeAudioInputDevice('new-device', session as any);

    expect((client as any).audio).toEqual({
      deviceId: { exact: 'new-device' },
    });
  });

  it('should change the audio input track if the provided id is different', async () => {
    client.setMediaConstraints(constraints as any);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    const result = await client.changeAudioInputDevice(deviceId, session as any);
    expect(result).toBeTruthy();
  });
  it('should NOT change the audio input track if the provided id is the same', async () => {
    client.setMediaConstraints(constraints as any);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    const result = await client.changeAudioInputDevice(defaultId, session as any);
    expect(result).toBeFalsy();
  });
  it('should change the audio input track if the provided id is the same and force param is TRUE', async () => {
    client.setMediaConstraints(constraints as any);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    const result = await client.changeAudioInputDevice(defaultId, session as any, true);
    expect(result).toBeTruthy();
  });
  describe('setVideoInputDevice', () => {
    it('should retain its original video values', () => {
      const video = {
        height: {
          min: 480,
          max: 720,
        },
        width: {
          min: 640,
          max: 1280,
        },
      };
      client.video = video;
      client.setVideoInputDevice(deviceId);
      expect(client.video).toEqual({ ...video,
        deviceId: {
          exact: deviceId,
        },
      });
    });
    it('should set deviceId when video\'s original value is true', () => {
      client.video = true;
      client.setVideoInputDevice(deviceId);
      expect(client.video).toEqual({
        deviceId: {
          exact: deviceId,
        },
      });
    });
    it('should set deviceId when video\'s original value is not set', () => {
      client.video = undefined;
      client.setVideoInputDevice(deviceId);
      expect(client.video).toEqual({
        deviceId: {
          exact: deviceId,
        },
      });
    });
    it('should NOT set deviceId when its value does not change', () => {
      client.video = {
        deviceId: {
          exact: deviceId,
        },
      };
      const result = client.setVideoInputDevice(deviceId);
      expect(result).toEqual(null);
      expect(client.video).toEqual({
        deviceId: {
          exact: deviceId,
        },
      });
    });
  });
});

describe('reinvite video decision', () => {
  const spies: jest.SpyInstance[] = [];
  let mediaConfigSpy: jest.SpyInstance;
  let sessionWantsToDoVideoSpy: jest.SpyInstance;

  const buildSession = () => ({
    pendingReinvite: false,
    sessionDescriptionHandlerModifiersReInvite: [],
    sessionDescriptionHandlerOptionsReInvite: {},
    invite: jest.fn().mockResolvedValue(undefined),
  } as any);

  beforeEach(() => {
    mediaConfigSpy = jest.spyOn(client, 'getMediaConfiguration');
    sessionWantsToDoVideoSpy = jest.spyOn(client, 'sessionWantsToDoVideo');
    spies.push(
      mediaConfigSpy,
      sessionWantsToDoVideoSpy,
      jest.spyOn(client, 'isAudioMuted').mockReturnValue(false),
      jest.spyOn(client, 'getSipSessionId').mockReturnValue('reinvite-1'),
    );
  });

  afterEach(() => {
    spies.forEach(s => s.mockRestore());
    spies.length = 0;
  });

  it('does not request video on a constraint-less reinvite when there is no local video', async () => {
    // The remote SDP advertises video (incoming video call answered audio-only): following it
    // would turn the camera on without consent on ICE restart / network change reinvites.
    spies.push(jest.spyOn(client, 'hasLocalVideo').mockReturnValue(false));

    await client.reinvite(buildSession(), null, false, false, true);

    expect(mediaConfigSpy).toHaveBeenCalledWith(false, false, null);
    expect(sessionWantsToDoVideoSpy).not.toHaveBeenCalled();
  });

  it('keeps video on a constraint-less reinvite when local video is active', async () => {
    spies.push(jest.spyOn(client, 'hasLocalVideo').mockReturnValue(true));

    await client.reinvite(buildSession(), null, false, false, true);

    expect(mediaConfigSpy).toHaveBeenCalledWith(true, false, null);
  });

  it('follows explicit constraints when provided', async () => {
    spies.push(jest.spyOn(client, 'hasLocalVideo').mockReturnValue(false));
    const constraints = { video: true };

    await client.reinvite(buildSession(), constraints, false, false, false);

    expect(mediaConfigSpy).toHaveBeenCalledWith(true, false, constraints);
  });
});

describe('remote video detection', () => {
  const sessionId = 'remote-video-1';

  const setSession = (remoteMediaStream: any, peerConnection: any = {}) => {
    (client as any).sipSessions[sessionId] = {
      sessionDescriptionHandler: { remoteMediaStream, peerConnection },
    };
  };

  afterEach(() => {
    delete (client as any).sipSessions[sessionId];
  });

  describe('hasRemoteVideo', () => {
    const streamWithTracks = (tracks: any[]) => ({ getTracks: () => tracks });

    it('ignores a live but muted video track (negotiated m-line that never received RTP)', () => {
      setSession(streamWithTracks([{ kind: 'video', readyState: 'live', muted: true }]));

      expect(client.hasRemoteVideo(sessionId)).toBe(false);
    });

    it('detects a live unmuted video track', () => {
      setSession(streamWithTracks([{ kind: 'video', readyState: 'live', muted: false }]));

      expect(client.hasRemoteVideo(sessionId)).toBe(true);
    });

    it('ignores audio tracks', () => {
      setSession(streamWithTracks([{ kind: 'audio', readyState: 'live', muted: false }]));

      expect(client.hasRemoteVideo(sessionId)).toBe(false);
    });
  });

  describe('updateRemoteStream', () => {
    const makeRemoteStream = () => {
      const tracks: any[] = [];
      return {
        tracks,
        getTracks: () => [...tracks],
        addTrack: (track: any) => tracks.push(track),
        removeTrack: (track: any) => {
          const index = tracks.indexOf(track);
          if (index !== -1) {
            tracks.splice(index, 1);
          }
        },
      };
    };

    it('skips receiver tracks whose transceiver is not receiving', () => {
      const remoteStream = makeRemoteStream();
      const receivingReceiver = { track: { kind: 'audio' } };
      const phantomReceiver = { track: { kind: 'video' } };
      const pc = {
        getReceivers: () => [receivingReceiver, phantomReceiver],
        getTransceivers: () => [
          { receiver: receivingReceiver, currentDirection: 'sendrecv' },
          // Our video offer was answered `recvonly`: we send, we never receive.
          { receiver: phantomReceiver, currentDirection: 'sendonly' },
        ],
      };
      setSession(remoteStream, pc);

      client.updateRemoteStream(sessionId);

      expect(remoteStream.tracks).toEqual([receivingReceiver.track]);
    });

    it('adds receiver tracks for receiving transceivers, using direction before negotiation', () => {
      const remoteStream = makeRemoteStream();
      const receiver = { track: { kind: 'video' } };
      const pc = {
        getReceivers: () => [receiver],
        getTransceivers: () => [{ receiver, currentDirection: null, direction: 'recvonly' }],
      };
      setSession(remoteStream, pc);

      client.updateRemoteStream(sessionId);

      expect(remoteStream.tracks).toEqual([receiver.track]);
    });

    it('keeps all receiver tracks when transceivers are not available', () => {
      const remoteStream = makeRemoteStream();
      const audioReceiver = { track: { kind: 'audio' } };
      const videoReceiver = { track: { kind: 'video' } };
      const pc = {
        getReceivers: () => [audioReceiver, videoReceiver],
      };
      setSession(remoteStream, pc);

      client.updateRemoteStream(sessionId);

      expect(remoteStream.tracks).toEqual([audioReceiver.track, videoReceiver.track]);
    });

    it('only touches video tracks when allTracks is false', () => {
      const remoteStream = makeRemoteStream();
      const existingAudioTrack = { kind: 'audio' };
      remoteStream.addTrack(existingAudioTrack);
      const videoReceiver = { track: { kind: 'video' } };
      const pc = {
        getReceivers: () => [videoReceiver],
        getTransceivers: () => [{ receiver: videoReceiver, currentDirection: 'sendrecv' }],
      };
      setSession(remoteStream, pc);

      client.updateRemoteStream(sessionId, false);

      expect(remoteStream.tracks).toEqual([existingAudioTrack, videoReceiver.track]);
    });
  });
});

describe('toAssertedIdentity', () => {
  // Shaped like sip.js's parsed P-Asserted-Identity header (a NameAddrHeader).
  const makeIdentity = (user: string | undefined, displayName: string) => ({
    uri: { user },
    displayName,
  } as any);

  it('maps display name and number from the parsed header', () => {
    expect(toAssertedIdentity(makeIdentity('30123', 'Loris MADRID')))
      .toEqual({ displayName: 'Loris MADRID', number: '30123' });
  });

  it('falls back to the number as display name when no display name is present', () => {
    expect(toAssertedIdentity(makeIdentity('30123', '')))
      .toEqual({ displayName: '30123', number: '30123' });
  });

  it('omits the number when there is no user part', () => {
    expect(toAssertedIdentity(makeIdentity(undefined, 'Loris MADRID')))
      .toEqual({ displayName: 'Loris MADRID', number: undefined });
  });

  it('returns null when the identity carries neither number nor display name', () => {
    expect(toAssertedIdentity(makeIdentity(undefined, ''))).toBeNull();
  });

  it('returns null when there is no identity', () => {
    expect(toAssertedIdentity(null)).toBeNull();
  });
});
