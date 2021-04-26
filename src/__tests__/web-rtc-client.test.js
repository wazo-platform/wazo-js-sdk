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
