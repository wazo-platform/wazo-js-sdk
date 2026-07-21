import { SessionState } from 'sip.js/lib/api/session-state';

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

const createCreatableMockClient = (sessions: Record<string, any> = {}) => ({
  ...createMockClient(sessions),
  isCallHeld: () => false,
  hasVideo: () => false,
  isAudioMuted: () => false,
});

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

  it('propagates diversion from the sipSession', () => {
    const sipSession = { id: 'session-1', diversion: SAMPLE } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.diversion).toEqual(SAMPLE);
  });

  it('is undefined when the sipSession has no diversion', () => {
    const sipSession = { id: 'session-1' } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.diversion).toBeUndefined();
  });
});

describe('WebRTCPhone._createCallSession callId', () => {
  const requestWithHeader = (value?: string) => ({ getHeader: (name: string) => (name === 'X-Wazo-Call-ID' ? value : undefined) });

  it('maps the X-Wazo-Call-ID header of the INVITE to callId', () => {
    const sipSession = { id: 'session-1', request: requestWithHeader('1719843012.42') } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.callId).toBe('1719843012.42');
  });

  it('keeps the callId of the previous call session over the header', () => {
    const sipSession = { id: 'session-1', request: requestWithHeader('1719843012.42') } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));
    const fromSession = new CallSession({ callId: 'existing-id', sipCallId: 'session-1' } as any);

    const cs = phone._createCallSession(sipSession, fromSession);

    expect(cs.callId).toBe('existing-id');
  });

  it('is empty without header nor previous call session', () => {
    const sipSession = { id: 'session-1', request: requestWithHeader(undefined) } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.callId).toBe('');
  });

  it('supports sip sessions without a request object', () => {
    const sipSession = { id: 'session-1' } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.callId).toBe('');
  });

  it('maps the wazoCallId stashed from INVITE responses (outgoing call) to callId', () => {
    const sipSession = { id: 'session-1', wazoCallId: '1719843012.43' } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.callId).toBe('1719843012.43');
  });

  it('prefers the stashed wazoCallId over the request header', () => {
    const sipSession = { id: 'session-1', wazoCallId: '1719843012.43', request: requestWithHeader('1719843012.42') } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.callId).toBe('1719843012.43');
  });

  it('keeps the callId of the previous call session over the stashed wazoCallId', () => {
    const sipSession = { id: 'session-1', wazoCallId: '1719843012.43' } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));
    const fromSession = new CallSession({ callId: 'existing-id', sipCallId: 'session-1' } as any);

    const cs = phone._createCallSession(sipSession, fromSession);

    expect(cs.callId).toBe('existing-id');
  });
});

describe('WebRTCPhone.setCallSessionCallId', () => {
  it('sets the callId on the call session matching the sip call id', () => {
    const phone = createPhone(createCreatableMockClient());
    const callSession = new CallSession({ sipCallId: 'abcdef' } as any);
    phone.callSessions.abcdef = callSession;

    phone.setCallSessionCallId('abcdef', '1719843012.42');

    expect(callSession.callId).toBe('1719843012.42');
  });

  it('does not overwrite an already known callId', () => {
    const phone = createPhone(createCreatableMockClient());
    const callSession = new CallSession({ callId: 'existing-id', sipCallId: 'abcdef' } as any);
    phone.callSessions.abcdef = callSession;

    phone.setCallSessionCallId('abcdef', '1719843012.42');

    expect(callSession.callId).toBe('existing-id');
  });

  it('ignores unknown sip call ids', () => {
    const phone = createPhone(createCreatableMockClient());

    expect(() => phone.setCallSessionCallId('unknown', '1719843012.42')).not.toThrow();
  });
});

describe('WebRTCPhone._createCallSession assertedIdentity', () => {
  // Shaped like sip.js's `Session.assertedIdentity` (a parsed NameAddrHeader).
  // The URI exposes the user via the public `user` getter and the private
  // `_normal` one, both of which `_createCallSession` reads.
  const NAME_ADDR_HEADER = { uri: { user: '30123', _normal: { user: '30123' } }, displayName: 'Loris MADRID' };

  it('maps the asserted identity from the sip.js Session.assertedIdentity getter', () => {
    const sipSession = { id: 'session-1', assertedIdentity: NAME_ADDR_HEADER } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.assertedIdentity).toEqual({ displayName: 'Loris MADRID', number: '30123' });
  });

  it('is undefined when the sipSession has no asserted identity', () => {
    const sipSession = { id: 'session-1' } as any;
    const phone = createPhone(createCreatableMockClient({ 'session-1': sipSession }));

    const cs = phone._createCallSession(sipSession);

    expect(cs.assertedIdentity).toBeUndefined();
  });
});
/* eslint-enable no-underscore-dangle */

/* eslint-disable no-underscore-dangle */
describe('WebRTCPhone._sendReinviteMessage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createMessageMockClient = (sessions: Record<string, any> = {}) => ({
    ...createMockClient(sessions),
    sendMessage: jest.fn(),
  });

  it('sends the track-update message when the session is Established when the timer fires', () => {
    const sipSession = { id: 'session-1', state: SessionState.Established } as any;
    const client = createMessageMockClient({ 'session-1': sipSession });
    const phone = createPhone(client);
    const callSession = new CallSession({ callId: 'session-1', sipCallId: 'session-1' } as any);

    phone._sendReinviteMessage(callSession, true);
    jest.runAllTimers();

    expect(client.sendMessage).toHaveBeenCalledTimes(1);
    const [calledSession, body] = client.sendMessage.mock.calls[0];
    expect(calledSession).toBe(sipSession);
    expect(JSON.parse(body).content.update).toBe('upgrade');
  });

  it('skips the message when the session is not yet Established when the timer fires', () => {
    const sipSession = { id: 'session-1', state: SessionState.Establishing } as any;
    const client = createMessageMockClient({ 'session-1': sipSession });
    const phone = createPhone(client);
    const callSession = new CallSession({ callId: 'session-1', sipCallId: 'session-1' } as any);

    phone._sendReinviteMessage(callSession, true);
    jest.runAllTimers();

    expect(client.sendMessage).not.toHaveBeenCalled();
  });

  it('skips the message when the session is already Terminated when the timer fires', () => {
    const sipSession = { id: 'session-1', state: SessionState.Terminated } as any;
    const client = createMessageMockClient({ 'session-1': sipSession });
    const phone = createPhone(client);
    const callSession = new CallSession({ callId: 'session-1', sipCallId: 'session-1' } as any);

    phone._sendReinviteMessage(callSession, false);
    jest.runAllTimers();

    expect(client.sendMessage).not.toHaveBeenCalled();
  });

  it('skips the message when no sip session can be resolved', () => {
    const client = createMessageMockClient({});
    const phone = createPhone(client);
    phone.fallbackToFirstSipSession = false;
    const callSession = new CallSession({ callId: 'unknown', sipCallId: 'unknown' } as any);

    phone._sendReinviteMessage(callSession, false);
    jest.runAllTimers();

    expect(client.sendMessage).not.toHaveBeenCalled();
  });

  it('skips the message when the session moves to Terminated after scheduling', () => {
    const sipSession = { id: 'session-1', state: SessionState.Established } as any;
    const client = createMessageMockClient({ 'session-1': sipSession });
    const phone = createPhone(client);
    const callSession = new CallSession({ callId: 'session-1', sipCallId: 'session-1' } as any);

    phone._sendReinviteMessage(callSession, true);
    sipSession.state = SessionState.Terminated;
    jest.runAllTimers();

    expect(client.sendMessage).not.toHaveBeenCalled();
  });
});
/* eslint-enable no-underscore-dangle */
