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
});
