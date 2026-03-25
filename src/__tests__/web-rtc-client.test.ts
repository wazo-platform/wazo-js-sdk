import { Invitation, SessionState } from 'sip.js/lib/api';

import WebRTCClient from '../web-rtc-client';

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

  const makeMockAudioTrack = (muted = true) => {
    const listeners: Record<string, ((...args: any[]) => void)[]> = {};
    return {
      kind: 'audio' as const,
      muted,
      addEventListener: jest.fn((event: string, cb: (...args: any[]) => void) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(cb);
      }),
      // Helper to simulate the browser firing 'unmute'
      fireUnmute() {
        this.muted = false;
        (listeners.unmute || []).forEach(cb => cb());
      },
    };
  };

  const makeMockSession = (audioTrackMuted = true) => {
    const audioTrack = makeMockAudioTrack(audioTrackMuted);
    const trackListeners: Record<string, ((...args: any[]) => void)[]> = {};
    const pc = {
      connectionState: 'new',
      onconnectionstatechange: null as (() => void) | null,
      iceConnectionState: 'new',
      oniceconnectionstatechange: null as (() => void) | null,
      addEventListener: jest.fn((event: string, cb: (...args: any[]) => void) => {
        trackListeners[event] = trackListeners[event] || [];
        trackListeners[event].push(cb);
      }),
      getReceivers: jest.fn(() => [{ track: audioTrack }]),
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
    return { session, pc, audioTrack };
  };

  it('should emit onMediaConnected when both pc connected AND audio track unmuted', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc, audioTrack } = makeMockSession();
    stubOnAccepted('session-1');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    // Connection becomes connected — but audio track is still muted
    (pc as any).connectionState = 'connected';
    pc.onconnectionstatechange!();
    expect(emitSpy).not.toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, expect.anything());

    // Audio track unmutes — NOW it should emit
    audioTrack.fireUnmute();
    expect(emitSpy).toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, session);
  });

  it('should emit onMediaConnected when audio unmutes first, then pc connects', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc, audioTrack } = makeMockSession();
    stubOnAccepted('session-1b');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    // Audio unmutes first — pc not yet connected
    audioTrack.fireUnmute();
    expect(emitSpy).not.toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, expect.anything());

    // Now pc connects
    (pc as any).connectionState = 'connected';
    pc.onconnectionstatechange!();
    expect(emitSpy).toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, session);
  });

  it('should NOT emit onMediaConnected when only pc connected but audio still muted', async () => {
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

  it('should emit immediately if both conditions already met when handler is registered', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    // Audio track already unmuted, connection already connected
    const { session, pc } = makeMockSession(false);
    (pc as any).connectionState = 'connected';
    stubOnAccepted('session-3');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    expect(emitSpy).toHaveBeenCalledWith(client.ON_MEDIA_CONNECTED, session);
  });

  it('should not emit onMediaConnected twice', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc, audioTrack } = makeMockSession(false);
    (pc as any).connectionState = 'connected';
    stubOnAccepted('session-4');

    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);

    // Both conditions met at registration — emits once
    // Simulate handler also firing (browser queued event)
    pc.onconnectionstatechange!();
    audioTrack.fireUnmute();

    const mediaConnectedCalls = emitSpy.mock.calls.filter(
      ([event]) => event === client.ON_MEDIA_CONNECTED,
    );
    expect(mediaConnectedCalls).toHaveLength(1);
  });

  it('should NOT emit onMediaConnected again on re-INVITE for the same session', async () => {
    const emitSpy = jest.spyOn(client.eventEmitter, 'emit');
    spies.push(emitSpy);
    const { session, pc, audioTrack } = makeMockSession();
    stubOnAccepted('session-5');

    // First _onAccepted: connection reaches 'connected', audio unmutes
    // eslint-disable-next-line no-underscore-dangle
    await (client as any)._onAccepted(session, undefined, false, true);
    (pc as any).connectionState = 'connected';
    pc.onconnectionstatechange!();
    audioTrack.fireUnmute();

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
