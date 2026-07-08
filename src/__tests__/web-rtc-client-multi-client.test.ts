import { RegistererState } from 'sip.js/lib/api/registerer-state';

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

    transport = { disconnect: jest.fn(() => Promise.resolve()) };

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

  it('does not leak a UserAgent when register() runs before _buildConfig resolves', async () => {
    let resolveBuildConfig: (config: any) => void = () => {};
    jest.spyOn(WebRTCClient.prototype as any, '_buildConfig').mockReturnValue(new Promise(resolve => {
      resolveBuildConfig = resolve;
    }));
    // Keep register() pending after it created its UserAgent
    jest.spyOn(WebRTCClient.prototype as any, '_connectIfNeeded').mockReturnValue(new Promise(() => {}));

    const client = new WebRTCClient({} as any, { token: 'token', refreshToken: 'refresh', uuid: 'uuid' } as any, undefined);

    client.register();

    expect(mockUaInstances.length).toBe(1);

    // Constructor's _buildConfig resolves after register() already created a UserAgent
    resolveBuildConfig({});
    await Promise.resolve();
    await Promise.resolve();

    expect(liveUas().length).toBe(1);
    expect(client.userAgent).toBe(liveUas()[0]);
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
    expect(connectSpy).toHaveBeenCalled();
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
