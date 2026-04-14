import WazoSessionDescriptionHandler from '../WazoSessionDescriptionHandler';

// Mock the parent class to avoid pulling in the full WebRTC stack
jest.mock('sip.js/lib/platform/web/session-description-handler/session-description-handler', () => ({
  // eslint-disable-next-line @typescript-eslint/lines-between-class-members
  SessionDescriptionHandler: class {
    logger: any;

    _peerConnection: any;

    constructor(logger: any) {
      this.logger = logger;
    }
  },
}));

jest.mock('../../service/IssueReporter', () => null);

const makeTrack = (kind = 'audio', enabled = true) => ({ kind, enabled });

const makeTransceiver = (direction: string, trackKind = 'audio', stopped = false) => ({
  direction,
  stopped,
  receiver: { track: makeTrack(trackKind) },
});

const makePeerConnection = (signalingState: string, transceivers: any[], sdp?: string) => ({
  signalingState,
  getTransceivers: jest.fn(() => transceivers),
  remoteDescription: sdp ? { sdp } : undefined,
});

const createHandler = (pc?: any) => {
  const logger = { debug: jest.fn(), error: jest.fn() };
  const handler = new WazoSessionDescriptionHandler(
    logger as any,
    jest.fn() as any,
    {} as any,
    true,
    {} as any,
  );
  // eslint-disable-next-line no-underscore-dangle
  (handler as any)._peerConnection = pc;
  return handler;
};

describe('WazoSessionDescriptionHandler._constraintsEqual', () => {
  const handler = createHandler();

  // Access private method for testing
  const constraintsEqual = (a: any, b: any) => (handler as any)._constraintsEqual(a, b);

  describe('primitive values', () => {
    it('returns true for identical primitives', () => {
      expect(constraintsEqual(true, true)).toBe(true);
      expect(constraintsEqual(false, false)).toBe(true);
      expect(constraintsEqual(42, 42)).toBe(true);
      expect(constraintsEqual('ideal', 'ideal')).toBe(true);
    });

    it('returns true for reference-equal values', () => {
      const obj = { deviceId: 'abc' };
      expect(constraintsEqual(obj, obj)).toBe(true);
    });

    it('returns false for different primitives', () => {
      expect(constraintsEqual(true, false)).toBe(false);
      expect(constraintsEqual(42, 99)).toBe(false);
      expect(constraintsEqual('a', 'b')).toBe(false);
    });

    it('returns false for type mismatches', () => {
      expect(constraintsEqual(true, { exact: true })).toBe(false);
      expect(constraintsEqual(42, '42')).toBe(false);
      expect(constraintsEqual(null, undefined)).toBe(false);
    });
  });

  describe('null handling', () => {
    it('returns true for null === null', () => {
      expect(constraintsEqual(null, null)).toBe(true);
    });

    it('returns false for null vs object', () => {
      expect(constraintsEqual(null, {})).toBe(false);
      expect(constraintsEqual({}, null)).toBe(false);
    });
  });

  describe('order-independent object comparison', () => {
    it('returns true when keys are in the same order', () => {
      expect(constraintsEqual(
        { deviceId: { exact: 'mic1' }, echoCancellation: true },
        { deviceId: { exact: 'mic1' }, echoCancellation: true },
      )).toBe(true);
    });

    it('returns true when keys are in different order', () => {
      expect(constraintsEqual(
        { echoCancellation: true, deviceId: { exact: 'mic1' } },
        { deviceId: { exact: 'mic1' }, echoCancellation: true },
      )).toBe(true);
    });

    it('returns false when key counts differ', () => {
      expect(constraintsEqual(
        { deviceId: 'mic1' },
        { deviceId: 'mic1', echoCancellation: true },
      )).toBe(false);
    });

    it('returns false when values differ for same keys', () => {
      expect(constraintsEqual(
        { echoCancellation: true, noiseSuppression: false },
        { echoCancellation: true, noiseSuppression: true },
      )).toBe(false);
    });
  });

  describe('nested objects', () => {
    it('compares deeply nested structures with different key order', () => {
      const a = {
        deviceId: { exact: 'mic1' },
        echoCancellation: true,
        autoGainControl: false,
      };
      const b = {
        autoGainControl: false,
        deviceId: { exact: 'mic1' },
        echoCancellation: true,
      };
      expect(constraintsEqual(a, b)).toBe(true);
    });

    it('detects differences in deeply nested values', () => {
      expect(constraintsEqual(
        { deviceId: { exact: 'mic1' } },
        { deviceId: { exact: 'mic2' } },
      )).toBe(false);
    });
  });

  describe('array comparison', () => {
    it('returns true for identical arrays', () => {
      expect(constraintsEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('returns false for different length arrays', () => {
      expect(constraintsEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it('returns false for same elements in different order', () => {
      expect(constraintsEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    it('returns false for array vs non-array', () => {
      expect(constraintsEqual([1], { 0: 1 })).toBe(false);
      expect(constraintsEqual({ 0: 1 }, [1])).toBe(false);
    });
  });

  describe('real-world media constraint scenarios', () => {
    it('matches typical audio constraints regardless of key order', () => {
      const fromSdk = {
        deviceId: { exact: 'abc-123' },
        autoGainControl: true,
        noiseSuppression: true,
        echoCancellation: true,
      };
      const fromBrowser = {
        echoCancellation: true,
        autoGainControl: true,
        deviceId: { exact: 'abc-123' },
        noiseSuppression: true,
      };
      expect(constraintsEqual(fromSdk, fromBrowser)).toBe(true);
    });

    it('detects device change in constraints with same processing flags', () => {
      const before = {
        deviceId: { exact: 'mic-old' },
        echoCancellation: true,
        noiseSuppression: true,
      };
      const after = {
        deviceId: { exact: 'mic-new' },
        echoCancellation: true,
        noiseSuppression: true,
      };
      expect(constraintsEqual(before, after)).toBe(false);
    });

    it('handles boolean true vs constraint object (actual device switch scenario)', () => {
      // Before device switch: audio = true
      // After device switch: audio = { deviceId: { exact: 'mic1' } }
      expect(constraintsEqual(true, { deviceId: { exact: 'mic1' } })).toBe(false);
    });

    it('handles undefined vs undefined', () => {
      expect(constraintsEqual(undefined, undefined)).toBe(true);
    });
  });
});

describe('WazoSessionDescriptionHandler.getLocalMediaStream', () => {
  const mediaStreamFactory = jest.fn();

  const createHandlerWithStream = (opts: {
    storedConstraints?: any;
    audioTracks?: Array<{ readyState: string; enabled: boolean }>;
    videoTracks?: Array<{ readyState: string; enabled: boolean }>;
  } = {}) => {
    const logger = { debug: jest.fn(), error: jest.fn() };
    const h = new WazoSessionDescriptionHandler(
      logger as any,
      mediaStreamFactory as any,
      {} as any,
      true,
      {} as any,
    );
    // eslint-disable-next-line no-underscore-dangle
    (h as any)._peerConnection = {}; // must be defined
    (h as any).mediaStreamFactory = mediaStreamFactory;
    if (opts.storedConstraints) {
      (h as any).localMediaStreamConstraints = opts.storedConstraints;
    }
    // eslint-disable-next-line no-underscore-dangle
    (h as any)._localMediaStream = {
      getAudioTracks: () => opts.audioTracks || [],
      getVideoTracks: () => opts.videoTracks || [],
    };
    h.setLocalMediaStream = jest.fn();
    return h;
  };

  const fakeStream = { getTracks: () => [] };

  beforeEach(() => {
    mediaStreamFactory.mockReset();
    mediaStreamFactory.mockResolvedValue(fakeStream);
  });

  it('skips getUserMedia when constraints match and tracks are active', async () => {
    const constraints = {
      audio: { deviceId: { exact: 'mic1' }, echoCancellation: true },
      video: false,
    };
    const h = createHandlerWithStream({
      storedConstraints: constraints,
      audioTracks: [{ readyState: 'live', enabled: true }],
    });

    await h.getLocalMediaStream({ constraints });

    expect(mediaStreamFactory).not.toHaveBeenCalled();
  });

  it('fetches new stream when constraints match but audio track has ended', async () => {
    const constraints = {
      audio: { deviceId: { exact: 'mic1' } },
    };
    const h = createHandlerWithStream({
      storedConstraints: constraints,
      audioTracks: [{ readyState: 'ended', enabled: true }],
    });

    await h.getLocalMediaStream({ constraints });

    expect(mediaStreamFactory).toHaveBeenCalledWith(constraints, h);
  });

  it('fetches new stream when constraints match but audio track is disabled', async () => {
    const constraints = {
      audio: { deviceId: { exact: 'mic1' } },
    };
    const h = createHandlerWithStream({
      storedConstraints: constraints,
      audioTracks: [{ readyState: 'live', enabled: false }],
    });

    await h.getLocalMediaStream({ constraints });

    expect(mediaStreamFactory).toHaveBeenCalledWith(constraints, h);
  });

  it('fetches new stream when constraints match but no audio tracks exist', async () => {
    const constraints = {
      audio: { deviceId: { exact: 'mic1' } },
    };
    const h = createHandlerWithStream({
      storedConstraints: constraints,
      audioTracks: [],
    });

    await h.getLocalMediaStream({ constraints });

    expect(mediaStreamFactory).toHaveBeenCalledWith(constraints, h);
  });

  it('skips when audio not requested even with no audio tracks', async () => {
    const constraints = {
      audio: false,
      video: { deviceId: { exact: 'cam1' } },
    };
    const h = createHandlerWithStream({
      storedConstraints: constraints,
      audioTracks: [],
      videoTracks: [{ readyState: 'live', enabled: true }],
    });

    await h.getLocalMediaStream({ constraints });

    expect(mediaStreamFactory).not.toHaveBeenCalled();
  });

  it('fetches new stream when constraints differ (order-independent)', async () => {
    const stored = {
      audio: { deviceId: { exact: 'mic1' } },
    };
    const incoming = {
      audio: { deviceId: { exact: 'mic2' } },
    };
    const h = createHandlerWithStream({
      storedConstraints: stored,
      audioTracks: [{ readyState: 'live', enabled: true }],
    });

    await h.getLocalMediaStream({ constraints: incoming });

    expect(mediaStreamFactory).toHaveBeenCalledWith(incoming, h);
  });

  it('skips when constraints match with keys in different order and tracks are active', async () => {
    const stored = {
      audio: { echoCancellation: true, deviceId: { exact: 'mic1' } },
    };
    const incoming = {
      audio: { deviceId: { exact: 'mic1' }, echoCancellation: true },
    };
    const h = createHandlerWithStream({
      storedConstraints: stored,
      audioTracks: [{ readyState: 'live', enabled: true }],
    });

    await h.getLocalMediaStream({ constraints: incoming });

    expect(mediaStreamFactory).not.toHaveBeenCalled();
  });
});

describe('WazoSessionDescriptionHandler.updateDirection', () => {
  describe('guard checks', () => {
    it('rejects when _peerConnection is undefined', async () => {
      const handler = createHandler();
      await expect(handler.updateDirection()).rejects.toThrow('Peer connection closed.');
    });

    it('resolves immediately when getTransceivers is not available', async () => {
      const handler = createHandler({ signalingState: 'stable' });
      await expect(handler.updateDirection()).resolves.toBeUndefined();
    });
  });

  describe('stable state (offer direction)', () => {
    it('hold: sets direction to sendonly and disables receiver track', async () => {
      const t = makeTransceiver('sendrecv');
      const pc = makePeerConnection('stable', [t]);
      const handler = createHandler(pc);

      await handler.updateDirection({ hold: true } as any);

      expect(t.direction).toBe('sendonly');
      expect(t.receiver.track.enabled).toBe(false);
    });

    it('resume from sendonly: sets direction to sendrecv and enables receiver track', async () => {
      const t = makeTransceiver('sendonly');
      const pc = makePeerConnection('stable', [t]);
      const handler = createHandler(pc);

      await handler.updateDirection({} as any);

      expect(t.direction).toBe('sendrecv');
      expect(t.receiver.track.enabled).toBe(true);
    });

    it('conference + audioOnly: video transceiver gets sendonly, audio gets correct direction', async () => {
      const audioT = makeTransceiver('sendrecv', 'audio');
      const videoT = makeTransceiver('sendrecv', 'video');
      const pc = makePeerConnection('stable', [audioT, videoT]);
      const handler = createHandler(pc);

      await handler.updateDirection({} as any, true, true);

      expect(audioT.direction).toBe('sendrecv');
      expect(audioT.receiver.track.enabled).toBe(true);
      expect(videoT.direction).toBe('sendonly');
      expect(videoT.receiver.track.enabled).toBe(false);
    });
  });

  describe('have-remote-offer state (answer direction)', () => {
    it('remote offers sendrecv, no hold: answer sendrecv, enables receiver track', async () => {
      const t = makeTransceiver('sendrecv');
      const pc = makePeerConnection('have-remote-offer', [t], 'a=sendrecv\r\n');
      const handler = createHandler(pc);

      await handler.updateDirection({} as any);

      expect(t.direction).toBe('sendrecv');
      expect(t.receiver.track.enabled).toBe(true);
    });

    it('remote offers sendrecv, hold: answer sendonly, disables receiver track', async () => {
      const t = makeTransceiver('sendrecv');
      const pc = makePeerConnection('have-remote-offer', [t], 'a=sendrecv\r\n');
      const handler = createHandler(pc);

      await handler.updateDirection({ hold: true } as any);

      expect(t.direction).toBe('sendonly');
      expect(t.receiver.track.enabled).toBe(false);
    });

    it('remote offers sendonly, no hold: answer recvonly, enables receiver track', async () => {
      const t = makeTransceiver('sendrecv');
      const pc = makePeerConnection('have-remote-offer', [t], 'a=sendonly\r\n');
      const handler = createHandler(pc);

      await handler.updateDirection({} as any);

      expect(t.direction).toBe('recvonly');
      expect(t.receiver.track.enabled).toBe(true);
    });

    it('conference + audioOnly answer: video transceiver set to inactive, receiver track disabled', async () => {
      const audioT = makeTransceiver('sendrecv', 'audio');
      const videoT = makeTransceiver('sendrecv', 'video');
      const pc = makePeerConnection('have-remote-offer', [audioT, videoT], 'a=sendrecv\r\n');
      const handler = createHandler(pc);

      await handler.updateDirection({} as any, true, true);

      expect(videoT.direction).toBe('inactive');
      expect(videoT.receiver.track.enabled).toBe(false);
      expect(audioT.direction).toBe('sendrecv');
      expect(audioT.receiver.track.enabled).toBe(true);
    });

    it('stopped transceiver is skipped', async () => {
      const stoppedT = makeTransceiver('sendrecv', 'audio', true);
      const activeT = makeTransceiver('sendrecv');
      const pc = makePeerConnection('have-remote-offer', [stoppedT, activeT], 'a=sendrecv\r\n');
      const handler = createHandler(pc);

      await handler.updateDirection({} as any);

      expect(stoppedT.direction).toBe('sendrecv');
      expect(activeT.direction).toBe('sendrecv');
      expect(activeT.receiver.track.enabled).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('rejects on invalid signaling state', async () => {
      const pc = makePeerConnection('have-local-offer', []);
      const handler = createHandler(pc);

      await expect(handler.updateDirection()).rejects.toThrow('Invalid signaling state have-local-offer');
    });
  });
});
