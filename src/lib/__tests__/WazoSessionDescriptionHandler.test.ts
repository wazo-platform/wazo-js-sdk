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
