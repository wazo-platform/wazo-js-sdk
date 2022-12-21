import WebRTCClient from "../web-rtc-client";
const client = new WebRTCClient({});
describe('WebRTC client', () => {
  it('should compute muted/unmuted state', async () => {
    const mutedSession = {
      sessionDescriptionHandler: {
        peerConnection: {
          getSenders: () => [{
            track: {
              kind: 'audio',
              enabled: false
            }
          }]
        }
      }
    };
    const unMutedSession = {
      sessionDescriptionHandler: {
        peerConnection: {
          getSenders: () => [{
            track: {
              kind: 'audio',
              enabled: true
            }
          }]
        }
      }
    };
    const oldKindMuted = {
      sessionDescriptionHandler: {
        peerConnection: {
          getLocalStreams: () => [{
            getAudioTracks: () => [{
              enabled: false
            }]
          }]
        }
      }
    };
    const oldKindUnmuted = {
      sessionDescriptionHandler: {
        peerConnection: {
          getLocalStreams: () => [{
            getAudioTracks: () => [{
              enabled: true
            }]
          }]
        }
      }
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
  const constraints = {
    audio: {
      deviceId: {
        exact: defaultId
      }
    },
    video: null
  };
  const session = {
    sessionDescriptionHandler: {
      peerConnection: {
        getSenders: () => [{
          track: {
            kind: 'audio',
            enabled: true
          }
        }]
      }
    }
  };
  const stream = {};
  const getAudioTracksMock = jest.fn(() => []);
  Object.defineProperty(stream, 'getAudioTracks', {
    value: getAudioTracksMock
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
    groupId: 'fak3Gr0up3'
  }, {
    deviceId: 'fak3d3v1c3',
    kind: 'audioinput',
    label: 'Fake Microphone',
    groupId: 'fak3Gr0up3'
  }];
  const enumerateDevicesMock = jest.fn(async () => {
    return new Promise(resolve => {
      resolve(devices);
    });
  });
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: getUserMediaMock,
      enumerateDevices: enumerateDevicesMock
    }
  });
  it('should change the audio input track if the provided id is different', async () => {
    client.setMediaConstraints(constraints);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    const result = await client.changeAudioInputDevice(deviceId, session);
    expect(result).toBeTruthy();
  });
  it('should NOT change the audio input track if the provided id is the same', async () => {
    client.setMediaConstraints(constraints);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    const result = await client.changeAudioInputDevice(defaultId, session);
    expect(result).toBeFalsy();
  });
  it('should change the audio input track if the provided id is the same and force param is TRUE', async () => {
    client.setMediaConstraints(constraints);
    expect(client.getAudioDeviceId()).toBe(defaultId);
    const result = await client.changeAudioInputDevice(defaultId, session, true);
    expect(result).toBeTruthy();
  });
  describe('setVideoInputDevice', () => {
    it('should retain its original video values', () => {
      const video = {
        height: {
          min: 480,
          max: 720
        },
        width: {
          min: 640,
          max: 1280
        }
      };
      client.video = video;
      client.setVideoInputDevice(deviceId);
      expect(client.video).toEqual({ ...video,
        deviceId: {
          exact: deviceId
        }
      });
    });
    it('should set deviceId when video\'s original value is true', () => {
      client.video = true;
      client.setVideoInputDevice(deviceId);
      expect(client.video).toEqual({
        deviceId: {
          exact: deviceId
        }
      });
    });
    it('should set deviceId when video\'s original value is not set', () => {
      client.video = undefined;
      client.setVideoInputDevice(deviceId);
      expect(client.video).toEqual({
        deviceId: {
          exact: deviceId
        }
      });
    });
    it('should NOT set deviceId when its value does not change', () => {
      client.video = {
        deviceId: {
          exact: deviceId
        }
      };
      const result = client.setVideoInputDevice(deviceId);
      expect(result).toEqual(null);
      expect(client.video).toEqual({
        deviceId: {
          exact: deviceId
        }
      });
    });
  });
});