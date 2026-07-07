import WebRTCClient from '../web-rtc-client';

const mockUaInstances: any[] = [];

jest.mock('sip.js/lib/platform/web/transport');
jest.mock('sip.js/lib/api/user-agent', () => ({
  UserAgent: class UserAgent {
    static makeURI: () => null = () => null;

    start = jest.fn(() => Promise.resolve());

    stop = jest.fn(() => Promise.resolve());

    transport = {};

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
