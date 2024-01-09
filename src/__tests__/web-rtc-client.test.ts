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

const client = new WebRTCClient({} as any, null, undefined);

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
