import CallSession from '../CallSession';

describe('CallSession domain', () => {
  it('should update from another CallSession without data loss', () => {
    const callSession = new CallSession({
      callId: null,
      sipCallId: 123,
      paused: false,
      number: '8001',
      isCaller: true,
      dialedExtension: null,
    });
    const anotherCallSession = new CallSession({
      callId: 345,
      callerNumber: '8008',
      number: '8008',
      isCaller: false,
      dialedExtension: undefined,
    });

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
    const cs1 = new CallSession({ callId: 123, sipCallId: 456 });
    const cs2 = new CallSession({ callId: 123, sipCallId: null });

    expect(cs1.is(cs2)).toBeTruthy();
    expect(cs2.is(cs1)).toBeTruthy();
  });

  it('should set answerTime when setting answered', () => {
    const cs1 = new CallSession({});
    cs1.answered = true;

    const cs2 = new CallSession({});
    cs2.answer();

    const cs3 = new CallSession({ answered: true });

    expect(cs1.answered).toBeTruthy();
    expect(cs1.answerTime).not.toBeNull();
    expect(cs2.answered).toBeTruthy();
    expect(cs2.answerTime).not.toBeNull();
    expect(cs3.answered).toBeTruthy();
    expect(cs3.answerTime).not.toBeNull();
  });
});
