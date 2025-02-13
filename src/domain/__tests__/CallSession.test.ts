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

  describe.only('recording state', () => {
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
});
