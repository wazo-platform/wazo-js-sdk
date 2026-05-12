import WebRTCPhone from '../WebRTCPhone';
import CallSession from '../../CallSession';

jest.mock('sip.js/lib/platform/web/transport');
jest.mock('sip.js/lib/api/user-agent', () => ({
  UserAgent: class UserAgent {
    static readonly makeURI: () => null = () => null;

    start = () => {};

    transport = {};
  },
}));

const createMockClient = (sessions: Record<string, any> = {}) => ({
  getSipSessionIds: () => Object.keys(sessions),
  getSipSession: (id: string) => sessions[id] ?? null,
  getSipSessionId: (session: any) => session?.id ?? '',
  on: jest.fn(),
  unbind: jest.fn(),
} as any);

const createPhone = (client: any) => {
  const phone = new WebRTCPhone(client, undefined, false);
  return phone;
};

describe('WebRTCPhone.findSipSession', () => {
  it('should return matching sip session when callSession matches', () => {
    const sipSession = { id: 'session-1' };
    const client = createMockClient({ 'session-1': sipSession });
    const phone = createPhone(client);

    const callSession = new CallSession({ callId: 'session-1', sipCallId: 'session-1' } as any);
    const result = phone.findSipSession(callSession);

    expect(result).toBe(sipSession);
  });

  it('should fallback to currentSipSession when callSession not found', () => {
    const currentSession = { id: 'current' };
    const client = createMockClient({ current: currentSession });
    const phone = createPhone(client);
    phone.currentSipSession = currentSession as any;

    const callSession = new CallSession({ callId: 'unknown', sipCallId: 'unknown' } as any);
    const result = phone.findSipSession(callSession);

    expect(result).toBe(currentSession);
  });

  it('should fallback to first sip session by default when no currentSipSession', () => {
    const firstSession = { id: 'first' };
    const client = createMockClient({ first: firstSession, second: { id: 'second' } });
    const phone = createPhone(client);

    const callSession = new CallSession({ callId: 'unknown', sipCallId: 'unknown' } as any);
    const result = phone.findSipSession(callSession);

    expect(result).toBe(firstSession);
  });

  it('should return null when fallbackToFirstSipSession is false and no currentSipSession', () => {
    const firstSession = { id: 'first' };
    const client = createMockClient({ first: firstSession });
    const phone = createPhone(client);
    phone.fallbackToFirstSipSession = false;

    const callSession = new CallSession({ callId: 'unknown', sipCallId: 'unknown' } as any);
    const result = phone.findSipSession(callSession);

    expect(result).toBeNull();
  });

  it('should return null when no sessions exist', () => {
    const client = createMockClient({});
    const phone = createPhone(client);

    const callSession = new CallSession({ callId: 'unknown', sipCallId: 'unknown' } as any);
    const result = phone.findSipSession(callSession);

    expect(result).toBeNull();
  });
});

/* eslint-disable no-underscore-dangle */
describe('WebRTCPhone._createCallSession diversion', () => {
  const SAMPLE = ['"Alice" <sip:1001@wazo.example>;reason=unconditional'];

  const createCreatableMockClient = (sessions: Record<string, any> = {}) => ({
    ...createMockClient(sessions),
    isCallHeld: () => false,
    hasVideo: () => false,
    isAudioMuted: () => false,
  } as any);

  it('propagates diversion from the sipSession', () => {
    const sipSession = { id: 'session-1', diversion: SAMPLE } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.diversion).toEqual(SAMPLE);
  });

  it('defaults to an empty array when the sipSession has no diversion', () => {
    const sipSession = { id: 'session-1' } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.diversion).toEqual([]);
  });
});
/* eslint-enable no-underscore-dangle */
