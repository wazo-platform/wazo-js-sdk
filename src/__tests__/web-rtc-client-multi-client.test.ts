import { RegistererState } from 'sip.js/lib/api/registerer-state';
import { TransportState } from 'sip.js/lib/api/transport-state';

import WebRTCClient, { getLiveClientCount } from '../web-rtc-client';

const mockUaInstances: any[] = [];

jest.mock('sip.js/lib/platform/web/transport');
jest.mock('sip.js/lib/api/user-agent', () => ({
  UserAgent: class UserAgent {
    static makeURI: () => null = () => null;

    start = jest.fn(() => Promise.resolve());

    stop = jest.fn(() => Promise.resolve());

    isConnected = jest.fn(() => true);

    onTransportMessage = jest.fn();

    transport = { disconnect: jest.fn(() => Promise.resolve()), state: 'Connected', transitionState: jest.fn() };

    stateChange = { removeAllListeners: jest.fn() };

    delegate: any;

    constructor() {
      mockUaInstances.push(this);
    }
  },
}));

const liveUas = () => mockUaInstances.filter(ua => ua.stop.mock.calls.length === 0);

describe('single UserAgent per WebRTCClient', () => {
  beforeEach(() => {
    mockUaInstances.length = 0;
    jest.restoreAllMocks();
  });

  it('recreates the UA with the fetched session config when register() raced _buildConfig', async () => {
    let resolveBuildConfig: (config: any) => void = () => {};
    jest.spyOn(WebRTCClient.prototype as any, '_buildConfig').mockReturnValue(new Promise(resolve => {
      resolveBuildConfig = resolve;
    }));
    // Keep register() pending after it created its UserAgent
    jest.spyOn(WebRTCClient.prototype as any, '_connectIfNeeded').mockReturnValue(new Promise(() => {}));

    const client = new WebRTCClient({} as any, { token: 'token', refreshToken: 'refresh', uuid: 'uuid' } as any, undefined);

    client.register();

    expect(mockUaInstances).toHaveLength(1);

    // Constructor's _buildConfig resolves after register() already created a UserAgent:
    // the racing UA was built without the fetched credentials, so it must be replaced
    // (stopping the old one) — never left as a leaked second UA.
    resolveBuildConfig({ authorizationUser: 'user', password: 'secret' });
    await Promise.resolve();
    await Promise.resolve();

    expect(mockUaInstances).toHaveLength(2);
    expect(liveUas()).toHaveLength(1);
    expect(client.userAgent).toBe(mockUaInstances[1]);
    expect((client.config as any).authorizationUser).toBe('user');
  });

  it('keeps the UA created by register() when there is no session (config unchanged)', async () => {
    let resolveBuildConfig: (config: any) => void = () => {};
    jest.spyOn(WebRTCClient.prototype as any, '_buildConfig').mockReturnValue(new Promise(resolve => {
      resolveBuildConfig = resolve;
    }));
    jest.spyOn(WebRTCClient.prototype as any, '_connectIfNeeded').mockReturnValue(new Promise(() => {}));

    const client = new WebRTCClient({} as any, undefined, undefined);

    client.register();

    expect(mockUaInstances).toHaveLength(1);

    resolveBuildConfig({});
    await Promise.resolve();
    await Promise.resolve();

    expect(mockUaInstances).toHaveLength(1);
    expect(client.userAgent).toBe(mockUaInstances[0]);
  });

  it('does not create a UA when close() ran before _buildConfig resolved', async () => {
    let resolveBuildConfig: (config: any) => void = () => {};
    jest.spyOn(WebRTCClient.prototype as any, '_buildConfig').mockReturnValue(new Promise(resolve => {
      resolveBuildConfig = resolve;
    }));

    const client = new WebRTCClient({ media: {} } as any, { token: 'token', refreshToken: 'refresh', uuid: 'uuid' } as any, undefined);
    await client.close();

    resolveBuildConfig({});
    await Promise.resolve();
    await Promise.resolve();

    expect(mockUaInstances).toHaveLength(0);
    expect(client.userAgent).toBeFalsy();
  });

  it('stops an existing UserAgent before creating a new one', () => {
    const client = new WebRTCClient({} as any, undefined, undefined);
    const oldUa: any = {
      stop: jest.fn(() => Promise.resolve()),
      start: jest.fn(() => Promise.resolve()),
      transport: {},
    };
    client.userAgent = oldUa;

    const newUa = client.createUserAgent();

    expect(oldUa.stop).toHaveBeenCalled();
    expect(newUa).not.toBe(oldUa);
  });
});

describe('live client counter', () => {
  it('tracks alive clients and decrements once on close', async () => {
    const before = getLiveClientCount();
    const clientA = new WebRTCClient({ media: {} } as any, undefined, undefined);
    const clientB = new WebRTCClient({ media: {} } as any, undefined, undefined);

    expect(getLiveClientCount()).toBe(before + 2);

    await clientA.close();
    await clientA.close();

    expect(getLiveClientCount()).toBe(before + 1);

    await clientB.close();

    expect(getLiveClientCount()).toBe(before);
  });
});

describe('zombie registration (registered but transport dead)', () => {
  const flushMicrotasks = async () => {
    await Promise.resolve();
    await Promise.resolve();
  };

  const makeClient = async () => {
    const client = new WebRTCClient({} as any, undefined, undefined);
    await flushMicrotasks(); // let the constructor create its UserAgent
    return client;
  };

  it('re-registers when isRegistered() is true but the transport is not connected', async () => {
    const client = await makeClient();
    (client.userAgent as any).isConnected.mockReturnValue(false);
    client.registerer = { state: RegistererState.Registered, stateChange: { removeAllListeners: jest.fn() } } as any;
    const connectSpy = jest.spyOn(client as any, '_connectIfNeeded').mockReturnValue(new Promise(() => {}));

    client.register();

    expect(client.registerer).toBeNull(); // stale registerer dropped
    expect(connectSpy).toHaveBeenCalled(); // re-registration flow engaged
  });

  it('does not re-register when registered and the transport is connected', async () => {
    const client = await makeClient();
    (client.userAgent as any).isConnected.mockReturnValue(true);
    client.registerer = { state: RegistererState.Registered, stateChange: { removeAllListeners: jest.fn() } } as any;
    const connectSpy = jest.spyOn(client as any, '_connectIfNeeded').mockReturnValue(new Promise(() => {}));

    await client.register();

    expect(connectSpy).not.toHaveBeenCalled();
  });

  it('re-registers when the socket is half-open (connected but silent too long)', async () => {
    const client = new WebRTCClient({ transportSilenceThresholdMs: 65000 } as any, undefined, undefined);
    await flushMicrotasks();
    (client.userAgent as any).isConnected.mockReturnValue(true);
    client.lastTransportMessageAt = Date.now() - 120000;
    client.registerer = { state: RegistererState.Registered, stateChange: { removeAllListeners: jest.fn() } } as any;
    const disconnectSpy = jest.spyOn(client as any, '_disconnectTransport');
    const connectSpy = jest.spyOn(client as any, '_connectIfNeeded').mockReturnValue(new Promise(() => {}));

    client.register();
    await flushMicrotasks();

    expect(client.registerer).toBeNull();
    expect(disconnectSpy).toHaveBeenCalledWith(true); // force-close the dead socket
    // sip.js reports Connected until the WS close event fires — the state must be forced
    // so _connectIfNeeded() reconnects instead of REGISTERing into the dying socket.
    expect((client.userAgent as any).transport.transitionState).toHaveBeenCalledWith(TransportState.Disconnected);
    expect(connectSpy).toHaveBeenCalled();
  });

  it('dedupes concurrent register() calls during the heal', async () => {
    const client = new WebRTCClient({ transportSilenceThresholdMs: 65000 } as any, undefined, undefined);
    await flushMicrotasks();
    (client.userAgent as any).isConnected.mockReturnValue(true);
    client.lastTransportMessageAt = Date.now() - 120000;
    client.registerer = { state: RegistererState.Registered, stateChange: { removeAllListeners: jest.fn() } } as any;
    const connectSpy = jest.spyOn(client as any, '_connectIfNeeded').mockReturnValue(new Promise(() => {}));

    client.register();
    client.register(); // enters while the first is awaiting the forced disconnect
    await flushMicrotasks();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  it('is not suspect without a threshold configured, even when silent', async () => {
    const client = await makeClient();
    (client.userAgent as any).isConnected.mockReturnValue(true);
    client.lastTransportMessageAt = Date.now() - 600000;

    expect(client.isTransportSuspect()).toBe(false);
  });

  it('is not suspect when no message was ever received (fresh connection)', async () => {
    const client = new WebRTCClient({ transportSilenceThresholdMs: 65000 } as any, undefined, undefined);
    await flushMicrotasks();
    (client.userAgent as any).isConnected.mockReturnValue(true);

    expect(client.getLastTransportMessageAt()).toBeNull();
    expect(client.isTransportSuspect()).toBe(false);
  });

  it('is suspect when the transport is disconnected', async () => {
    const client = await makeClient();
    (client.userAgent as any).isConnected.mockReturnValue(false);

    expect(client.isTransportSuspect()).toBe(true);
  });

  it('is not suspect while sip sessions are active, even with silent transport', async () => {
    const client = new WebRTCClient({ transportSilenceThresholdMs: 65000 } as any, undefined, undefined);
    await flushMicrotasks();
    (client.userAgent as any).isConnected.mockReturnValue(true);
    client.lastTransportMessageAt = Date.now() - 120000;
    client.sipSessions = { 'session-1': {} as any };

    expect(client.isTransportSuspect()).toBe(false);
  });

  it('tracks the last inbound transport message timestamp', async () => {
    const client = await makeClient();

    expect(client.getLastTransportMessageAt()).toBeNull();

    (client.userAgent as any).transport.onMessage('SIP/2.0 200 OK\r\n\r\n');

    expect(client.getLastTransportMessageAt()).toBeGreaterThan(0);
  });
});

describe('unregister', () => {
  it('removes its stateChange listener once unregistered', async () => {
    const client = new WebRTCClient({} as any, undefined, undefined);
    const listeners: Array<(state: string) => void> = [];
    const registerer: any = {
      stateChange: {
        addListener: jest.fn((fn: (state: string) => void) => listeners.push(fn)),
        removeListener: jest.fn(),
        removeAllListeners: jest.fn(),
      },
      unregister: jest.fn(() => Promise.resolve()),
    };
    client.registerer = registerer;

    const promise = client.unregister();
    listeners[0](RegistererState.Unregistered);
    await promise;

    expect(registerer.stateChange.addListener).toHaveBeenCalledTimes(1);
    expect(registerer.stateChange.removeListener).toHaveBeenCalledWith(listeners[0]);
  });
});
