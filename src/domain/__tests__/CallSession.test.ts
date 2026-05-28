import Call, { RECORDING_STATE } from '../Call';
import CallSession from '../CallSession';

const stringify = (cs: any) => JSON.parse(JSON.stringify(cs));

describe('CallSession domain', () => {
  it('should update from another CallSession without data loss', () => {
    const callSession = new CallSession({
      callId: null,
      sipCallId: 123,
      paused: false,
      number: '8001',
      isCaller: true,
      dialedExtension: null,
    } as any);
    const anotherCallSession = new CallSession({
      callId: 345,
      callerNumber: '8008',
      number: '8008',
      isCaller: false,
      dialedExtension: undefined,
    } as any);
    callSession.updateFrom(anotherCallSession);
    expect(callSession.callId).toBe(345);
    expect(callSession.sipCallId).toBe(123);
    expect(callSession.paused).toBe(false);
    expect(callSession.ringing).toBe(undefined);
    expect(callSession.callerNumber).toBe('8008');
    expect(callSession.number).toBe('8008');
    expect(callSession.isCaller).toBe(false);
    expect(callSession.dialedExtension).toBe('');
  });
  it('should compare 2 callSession', () => {
    const cs1 = new CallSession({
      callId: 123,
      sipCallId: 456,
    } as any);
    const cs2 = new CallSession({
      callId: 123,
      sipCallId: null,
    } as any);
    expect(cs1.is(cs2)).toBeTruthy();
    expect(cs2.is(cs1)).toBeTruthy();
  });
  it('should set answerTime when setting answered to true', () => {
    const cs1 = new CallSession({} as any);
    cs1.answered = true;
    const cs2 = new CallSession({} as any);
    cs2.answer();
    const cs3 = new CallSession({
      answered: true,
    } as any);
    expect(cs1.answered).toEqual(true);
    expect(cs1.answerTime).not.toBeNull();
    expect(cs2.answered).toEqual(true);
    expect(cs2.answerTime).not.toBeNull();
    expect(cs3.answered).toEqual(true);
    expect(cs3.answerTime).not.toBeNull();
    const cs4 = stringify(cs1);
    const cs5 = stringify(cs2);
    const cs6 = stringify(cs3);
    expect(cs4.answered).toEqual(true);
    expect(cs5.answered).toEqual(true);
    expect(cs6.answered).toEqual(true);
  });
  it('should reset answerTime when setting answered to false', () => {
    const cs1 = new CallSession({} as any);
    cs1.answered = false;
    const cs2 = new CallSession({
      answered: false,
    } as any);
    expect(cs1.answered).toEqual(false);
    expect(cs1.answerTime).toBeNull();
    expect(cs2.answered).toEqual(false);
    expect(cs2.answerTime).toBeNull();
    const cs4 = stringify(cs1);
    const cs5 = stringify(cs2);
    expect(cs4.answered).toEqual(false);
    expect(cs5.answered).toEqual(false);
  });

  describe('recording state', () => {
    it('should handle ACTIVE recording state', () => {
      const call = Call.parse({
        record_state: RECORDING_STATE.ACTIVE,
      } as any);

      const cs = CallSession.parseCall(call);
      expect(cs.recording).toEqual(true);
      expect(cs.recordingPaused).toEqual(false);
      expect(cs.recordingState).toEqual(RECORDING_STATE.ACTIVE);
    });

    it('should handle INACTIVE recording state', () => {
      const call = Call.parse({
        record_state: RECORDING_STATE.INACTIVE,
      } as any);

      const cs = CallSession.parseCall(call);
      expect(cs.recording).toEqual(false);
      expect(cs.recordingPaused).toEqual(false);
      expect(cs.recordingState).toEqual(RECORDING_STATE.INACTIVE);
    });

    it('should handle INACTIVE recording state', () => {
      const call = Call.parse({
        record_state: RECORDING_STATE.PAUSED,
      } as any);

      const cs = CallSession.parseCall(call);
      expect(cs.recording).toEqual(false);
      expect(cs.recordingPaused).toEqual(true);
      expect(cs.recordingState).toEqual(RECORDING_STATE.PAUSED);
    });
  });

  describe('sipSession handling (BUG-320 / ITEM-350)', () => {
    // Builds a fake sipSession with a cycle back to its owning CallSession,
    // mimicking what SIP.js does via event emitters / dialog references.
    const buildCyclicSipSession = (owner: CallSession) => {
      const fakeSipSession: any = { id: 'sip-1', state: 'Established' };
      fakeSipSession.owner = owner; // cycle: sipSession.owner -> CallSession
      return fakeSipSession;
    };

    it('toJSON omits sipSession entirely', () => {
      const cs = new CallSession({ callId: 'a', sipCallId: 'b' } as any);
      cs.sipSession = buildCyclicSipSession(cs);
      const json = cs.toJSON();
      expect(json.sipSession).toBeUndefined();
    });

    it('toJSON does not throw on a CallSession with a circular sipSession', () => {
      const cs = new CallSession({ callId: 'a', sipCallId: 'b' } as any);
      cs.sipSession = buildCyclicSipSession(cs);
      expect(() => JSON.stringify(cs)).not.toThrow();
      const serialized = JSON.stringify(cs);
      expect(serialized).not.toContain('sipSession');
    });

    it('toJSON still includes the answered getter value', () => {
      const cs = new CallSession({ callId: 'a' } as any);
      cs.answered = true;
      cs.sipSession = { id: 'sip-1' } as any;
      const json = cs.toJSON();
      expect(json.answered).toBe(true);
      expect(json.sipSession).toBeUndefined();
    });

    it('updateFrom does not propagate sipSession from the source', () => {
      const ownSipSession = { id: 'own' } as any;
      const cs = new CallSession({ callId: 'a' } as any);
      cs.sipSession = ownSipSession;

      const other = new CallSession({ callId: 'a' } as any);
      other.sipSession = buildCyclicSipSession(other);

      cs.updateFrom(other);
      // Current instance must keep its own sipSession reference.
      expect(cs.sipSession).toBe(ownSipSession);
    });

    it('updateFrom does not loop when the source carries a circular sipSession', () => {
      const cs = new CallSession({ callId: 'a' } as any);
      const other = new CallSession({ callId: 'a', number: '8001' } as any);
      other.sipSession = buildCyclicSipSession(other);
      expect(() => cs.updateFrom(other)).not.toThrow();
      // Non-sipSession fields are still copied across.
      expect(cs.number).toBe('8001');
    });

    it('newFrom carries the source sipSession reference verbatim (no copy)', () => {
      const src = new CallSession({ callId: 'a', number: '8001' } as any);
      const sipSession = { id: 'sip-1' } as any;
      src.sipSession = sipSession;
      const copy = CallSession.newFrom(src);
      expect(copy.sipSession).toBe(sipSession);
      expect(copy.number).toBe('8001');
    });

    it('newFrom does not loop when the source carries a circular sipSession', () => {
      const src = new CallSession({ callId: 'a' } as any);
      src.sipSession = buildCyclicSipSession(src);
      expect(() => CallSession.newFrom(src)).not.toThrow();
    });
  });

  describe('diversion field', () => {
    const SAMPLE = ['"Alice" <sip:1001@wazo.example>;reason=unconditional'];

    it('is undefined when not provided', () => {
      const cs = new CallSession({} as any);
      expect(cs.diversion).toBeUndefined();
    });

    it('copies diversion via updateFrom', () => {
      const cs = new CallSession({ callId: 'a', diversion: SAMPLE } as any);
      const next = new CallSession({ callId: 'a' } as any);
      next.updateFrom(cs);
      expect(next.diversion).toEqual(SAMPLE);
    });

    it('does not clobber diversion when source lacks one', () => {
      const cs = new CallSession({ callId: 'a', diversion: SAMPLE } as any);
      const next = new CallSession({ callId: 'a' } as any);
      cs.updateFrom(next);
      expect(cs.diversion).toEqual(SAMPLE);
    });

    it('clears diversion when source explicitly sets an empty array', () => {
      const cs = new CallSession({ callId: 'a', diversion: SAMPLE } as any);
      const next = new CallSession({ callId: 'a', diversion: [] } as any);
      cs.updateFrom(next);
      expect(cs.diversion).toEqual([]);
    });

    it('preserves diversion through JSON serialization', () => {
      const cs = new CallSession({ callId: 'a', diversion: SAMPLE } as any);
      expect(stringify(cs).diversion).toEqual(SAMPLE);
    });
  });
});
