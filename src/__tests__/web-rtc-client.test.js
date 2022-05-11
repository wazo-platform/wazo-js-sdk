import WebRTCClient from '../web-rtc-client';

const client = new WebRTCClient({});

describe('WebRTC client', () => {
  it('should compute muted/unmuted state', async () => {
    const mutedSession = {
      sessionDescriptionHandler: {
        peerConnection: {
          getSenders: () => [{ track: { kind: 'audio', enabled: false } }],
        },
      },
    };

    const unMutedSession = {
      sessionDescriptionHandler: {
        peerConnection: {
          getSenders: () => [{ track: { kind: 'audio', enabled: true } }],
        },
      },
    };

    const oldKindMuted = {
      sessionDescriptionHandler: {
        peerConnection: {
          getLocalStreams: () => [{ getAudioTracks: () => [{ enabled: false }] }],
        },
      },
    };

    const oldKindUnmuted = {
      sessionDescriptionHandler: {
        peerConnection: {
          getLocalStreams: () => [{ getAudioTracks: () => [{ enabled: true }] }],
        },
      },
    };

    expect(client.isAudioMuted(mutedSession)).toBeTruthy();
    expect(client.isAudioMuted(oldKindMuted)).toBeTruthy();

    expect(client.isAudioMuted(unMutedSession)).toBeFalsy();
    expect(client.isAudioMuted(oldKindUnmuted)).toBeFalsy();
  });
});

describe('changeAudioInputDevice', () => {
  const defaultId = 'default';
  const deviceId = 'device1';
  const constraints = { audio: { deviceId: { exact: defaultId } }, video: null };

  const session = {
    sessionDescriptionHandler: {
      peerConnection: {
        getSenders: () => [{ track: { kind: 'audio', enabled: true } }],
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

  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: getUserMediaMock,
    },
  });

  it('should change the audio input track if the provided id is different', async () => {
    client.setMediaConstraints(constraints);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    expect(client.changeAudioInputDevice(deviceId, session)).toBeTruthy();
  });

  it('should NOT change the audio input track if the provided id is the same', async () => {
    client.setMediaConstraints(constraints);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    expect(client.changeAudioInputDevice(defaultId, session)).toBeFalsy();
  });

  it('should change the audio input track if the provided id is the same and force param is TRUE', async () => {
    client.setMediaConstraints(constraints);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    expect(client.changeAudioInputDevice(defaultId, session, true)).toBeTruthy();
  });
});
