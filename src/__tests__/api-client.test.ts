import { Base64 } from 'js-base64';

import WazoApiClient from '../api-client';
import ServerError from '../domain/ServerError';
import BadResponse from '../domain/BadResponse';
import Session from '../domain/Session';

const mockedResponse = {
  data: {
    token: 1,
  },
};

const mockedNotFoundResponse = {
  message: 'No such user voicemail',
};

const mockedTextErrorPayload = {
  message: 'No such user voicemail',
};

const mockedJsonErrorPayload = {
  timestamp: 1537529588.789515,
  message: 'No such user voicemail',
  error_id: 'no-such-user-voicemail',
  details: {
    user_uuid: 'xxx-xxx-xxx-xxx-xxxx',
  },
};

const mockedTextError = {
  ok: false,
  text: () => Promise.resolve(mockedTextErrorPayload),
  status: 500,
  headers: {
    get: () => 'text/plain',
  },
};

const mockedJsonError = {
  ok: false,
  json: () => Promise.resolve(mockedJsonErrorPayload),
  status: 500,
  headers: {
    get: () => 'application/json',
  },
};

const mockedJson = {
  ok: true,
  json: () => Promise.resolve(mockedResponse),
  headers: {
    get: () => 'application/json',
  },
};

const mockedUnAuthorized = {
  text: () => Promise.resolve(mockedResponse),
  ok: false,
  status: 401,
  headers: {
    get: () => 'text/plain',
  },
};

const mockedNotFound = {
  json: () => Promise.resolve(mockedNotFoundResponse),
  ok: false,
  status: 404,
  headers: {
    get: () => 'application/json',
  },
};

const server = 'localhost';
const authVersion = '0.1';
const username = 'wazo';
const password = 'zowa';
const token = '1234';

const client = new WazoApiClient({
  server,
});

client.setToken(token);

describe('With correct API results', () => {
  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => Promise.resolve(mockedJson) as any),
    });
  });

  describe('logIn test', () => {
    it('should retrieve user token', async () => {
      const data = {
        backend: 'wazo_user',
        expiration: 3600,
      };
      const headers = {
        Authorization: `Basic ${Base64.encode(`${username}:${password}`)}`,
        'Content-Type': 'application/json',
      };

      const result = await client.auth.logIn({
        username,
        password,
      } as any) as any;
      expect(result).toBeInstanceOf(Session);
      expect(result.token).toBe(1);
      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token`, {
        method: 'post',
        body: JSON.stringify(data),
        signal: expect.any(Object),
        headers,
        agent: null,
      });
    });
  });

  describe('samlLogIn test', () => {
    it('should retrieve user token', async () => {
      const samlSessionId = 'a1b2C3d4';
      const result = await client.auth.samlLogIn(samlSessionId);

      expect(result).toBeInstanceOf(Session);
      expect(result?.token).toBe(1);
      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token`, {
        method: 'post',
        body: JSON.stringify({ saml_session_id: samlSessionId }),
        signal: expect.any(Object),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: null,
      });
    });
  });

  describe('samlLogIn mobile test', () => {
    it('should retrieve user token', async () => {
      Wazo.Auth.mobile = true;
      const samlSessionId = 'a1b2C3d4';
      const result = await client.auth.samlLogIn(samlSessionId);

      expect(result).toBeInstanceOf(Session);
      expect(result?.token).toBe(1);
      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token`, {
        method: 'post',
        body: JSON.stringify({ saml_session_id: samlSessionId }),
        signal: expect.any(Object),
        headers: {
          'Content-Type': 'application/json',
          'Wazo-Session-Type': 'mobile',
          Accept: 'application/json',
        },
        agent: null,
      });
    });
  });

  describe('logOut test', () => {
    it('should delete the specified token', async () => {
      const oldToken = 123;
      await client.auth.logOut(oldToken as any);
      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token/${oldToken}`, {
        method: 'delete',
        body: null,
        signal: expect.any(Object),
        headers: {},
        agent: null,
      });
    });
  });
});

describe('initiateIdpAuthentication', () => {
  it('should make a request to obtain an identity provider URL to redirect to', async () => {
    const domain = 'example.com';
    const redirectUrl = 'https://myapp.xyz';

    await client.auth.initiateIdpAuthentication(domain, redirectUrl);
    expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/saml/sso`, {
      method: 'post',
      body: JSON.stringify({
        domain,
        redirect_url: redirectUrl,
      }),
      signal: expect.any(Object),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      agent: null,
    });
  });
});

describe('With unAuthorized API results', () => {
  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => Promise.resolve(mockedUnAuthorized) as any),
    });
  });

  describe('checkLogin test', () => {
    it('should return false on 401 status', async () => {
      const tokenToCheck = '123';
      const result = await client.auth.checkToken(tokenToCheck);
      expect(result).toBeFalsy();
      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token/${tokenToCheck}`, {
        method: 'head',
        body: null,
        signal: expect.any(Object),
        headers: {},
        agent: null,
      });
    });
  });
});

describe('With not found API results', () => {
  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => Promise.resolve(mockedNotFound) as any),
    });
  });

  describe('fetchVoicemail test', () => {
    it('should throw a BadResponse instance on 404 status', async () => {
      let error = null;

      try {
        await client.calld.listVoicemails();
      } catch (e: any) {
        error = e;
      }

      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(BadResponse);
      expect(error.message).toBe(mockedNotFoundResponse.message);
      expect(error.status).toBe(404);
      expect(global.fetch).toBeCalledWith(`https://${server}/api/calld/1.0/users/me/voicemails`, {
        method: 'get',
        body: null,
        signal: expect.any(Object),
        headers: {
          'X-Auth-Token': token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: null,
      });
    });
  });
});

describe('With erroneous text API results', () => {
  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => Promise.resolve(mockedTextError) as any),
    });
  });

  it('throw an exception when the response is >= 500', async () => {
    let error = null;

    try {
      await client.auth.logIn({
        username,
        password,
      } as any);
    } catch (e: any) {
      error = e;
    }

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(ServerError);
    expect(error.message).toBe(mockedTextErrorPayload.message);
    expect(error.status).toBe(500);
  });
});

describe('With erroneous json API results', () => {
  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => Promise.resolve(mockedJsonError) as any),
    });
  });

  it('throw an exception when the response is >= 500', async () => {
    let error = null;

    try {
      await client.auth.logIn({
        username,
        password,
      } as any);
    } catch (e: any) {
      error = e;
    }

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(ServerError);
    expect(error.message).toBe(mockedJsonErrorPayload.message);
    expect(error.timestamp).toBe(mockedJsonErrorPayload.timestamp);
    expect(error.status).toBe(500);
  });
});

describe('refreshTokenCallback', () => {
  it('fires onRefreshTokenError when there is no refresh token', async () => {
    const refreshClient = new WazoApiClient({ server });
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    const result = await refreshClient.refreshTokenCallback();

    expect(result).toBeNull();
    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);
    const error = onRefreshTokenError.mock.calls[0][0];
    expect(error.name).toBe('RefreshTokenError');
    expect(error.reason).toBe('no_refresh_token');
  });

  it('fires the no_refresh_token error only once until a refresh token is set again', async () => {
    const refreshClient = new WazoApiClient({ server });
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    await refreshClient.refreshTokenCallback();
    await refreshClient.refreshTokenCallback();

    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);

    refreshClient.setRefreshToken('a-refresh-token');
    refreshClient.setRefreshToken(null);
    await refreshClient.refreshTokenCallback();

    expect(onRefreshTokenError).toHaveBeenCalledTimes(2);
  });

  it('resolves to null when the onRefreshTokenError handler throws', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setOnRefreshTokenError(() => {
      throw new Error('handler blew up');
    });

    await expect(refreshClient.refreshTokenCallback()).resolves.toBeNull();
  });

  it('fires onRefreshTokenError when the refresh yields no session', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');
    refreshClient.auth.refreshToken = jest.fn(() => Promise.resolve(null)) as any;
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    const result = await refreshClient.refreshTokenCallback();

    expect(result).toBeNull();
    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);
    const error = onRefreshTokenError.mock.calls[0][0];
    expect(error.name).toBe('RefreshTokenError');
    expect(error.reason).toBe('empty_session');
  });

  it('fires the empty_session error only once until a refresh succeeds', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');
    refreshClient.auth.refreshToken = jest.fn(() => Promise.resolve(null)) as any;
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    await refreshClient.refreshTokenCallback();
    await refreshClient.refreshTokenCallback();

    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);

    // A successful refresh re-arms the one-shot notification
    refreshClient.auth.refreshToken = jest.fn(() => Promise.resolve({ token: 'a-new-token' })) as any;
    await refreshClient.refreshTokenCallback();
    refreshClient.auth.refreshToken = jest.fn(() => Promise.resolve(null)) as any;
    await refreshClient.refreshTokenCallback();

    expect(onRefreshTokenError).toHaveBeenCalledTimes(2);
  });

  it('fires onRefreshTokenError with the raw error when the refresh throws', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');
    const thrown = new BadResponse('token expired', 401);
    refreshClient.auth.refreshToken = jest.fn(() => Promise.reject(thrown)) as any;
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    const result = await refreshClient.refreshTokenCallback();

    expect(result).toBeNull();
    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);
    expect(onRefreshTokenError).toHaveBeenCalledWith(thrown);
  });

  it('returns the new token and does not fire onRefreshTokenError on success', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');
    const session = { token: 'a-new-token' };
    refreshClient.auth.refreshToken = jest.fn(() => Promise.resolve(session)) as any;
    const onRefreshToken = jest.fn();
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshToken(onRefreshToken);
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    const result = await refreshClient.refreshTokenCallback();

    expect(result).toBe('a-new-token');
    expect(onRefreshToken).toHaveBeenCalledWith('a-new-token', session);
    expect(onRefreshTokenError).not.toHaveBeenCalled();
  });

  it('dedups concurrent refreshes onto a single auth.refreshToken call', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');

    let resolveRefresh: (session: any) => void = () => {};
    const refreshToken = jest.fn(() => new Promise(resolve => {
      resolveRefresh = resolve;
    }));
    refreshClient.auth.refreshToken = refreshToken as any;

    // A 401-replay refresh and a forced refresh race concurrently.
    const first = refreshClient.refreshTokenCallback();
    const second = refreshClient.forceRefreshToken();

    resolveRefresh({ token: 'a-new-token' });
    const [firstResult, secondResult] = await Promise.all([first, second]);

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(firstResult).toBe('a-new-token');
    expect(secondResult).toBe('a-new-token');
  });

  it('ignores a stale refresh failure once a new refresh token has been set', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('an-old-refresh-token');

    let rejectRefresh: (error: any) => void = () => {};
    refreshClient.auth.refreshToken = jest.fn(() => new Promise((resolve, reject) => {
      rejectRefresh = reject;
    })) as any;
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    // Refresh starts with the old token, then fresh credentials arrive out-of-band.
    const pending = refreshClient.refreshTokenCallback();
    refreshClient.setRefreshToken('a-new-refresh-token');

    // The in-flight (old-token) attempt fails afterwards.
    rejectRefresh(new BadResponse('token expired', 401));
    const result = await pending;

    expect(result).toBeNull();
    expect(onRefreshTokenError).not.toHaveBeenCalled();
  });

  it('still fires onRefreshTokenError for a non-superseded failure', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');
    const thrown = new BadResponse('token expired', 401);
    refreshClient.auth.refreshToken = jest.fn(() => Promise.reject(thrown)) as any;
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    const result = await refreshClient.refreshTokenCallback();

    expect(result).toBeNull();
    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);
    expect(onRefreshTokenError).toHaveBeenCalledWith(thrown);
  });

  it('does not consume the one-shot when no handler is registered yet', async () => {
    const refreshClient = new WazoApiClient({ server });

    // A 401 replay triggers a refresh before the consumer has wired its handler.
    await refreshClient.refreshTokenCallback();

    // The handler is registered afterwards and must still hear about the persistent failure.
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);
    await refreshClient.refreshTokenCallback();

    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);
    const error = onRefreshTokenError.mock.calls[0][0];
    expect(error.reason).toBe('no_refresh_token');
  });

  it('does not apply a stale successful refresh once superseded', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('an-old-refresh-token');

    let resolveRefresh: (session: any) => void = () => {};
    refreshClient.auth.refreshToken = jest.fn(() => new Promise(resolve => {
      resolveRefresh = resolve;
    })) as any;
    const onRefreshToken = jest.fn();
    refreshClient.setOnRefreshToken(onRefreshToken);
    const setToken = jest.spyOn(refreshClient, 'setToken').mockImplementation(() => {});

    // Refresh starts with the old token, then fresh credentials arrive out-of-band.
    const pending = refreshClient.refreshTokenCallback();
    refreshClient.setRefreshToken('a-new-refresh-token');

    // The in-flight (old-token) attempt succeeds afterwards, but it is now stale.
    resolveRefresh({ token: 'a-stale-token' });
    const result = await pending;

    expect(result).toBeNull();
    expect(onRefreshToken).not.toHaveBeenCalled();
    expect(setToken).not.toHaveBeenCalled();
  });

  it('fires a thrown refresh error only once until a refresh succeeds', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');
    const thrown = new BadResponse('token expired', 401);
    refreshClient.auth.refreshToken = jest.fn(() => Promise.reject(thrown)) as any;
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    await refreshClient.refreshTokenCallback();
    await refreshClient.refreshTokenCallback();

    expect(onRefreshTokenError).toHaveBeenCalledTimes(1);

    // A successful refresh re-arms the one-shot notification.
    refreshClient.auth.refreshToken = jest.fn(() => Promise.resolve({ token: 'a-new-token' })) as any;
    await refreshClient.refreshTokenCallback();
    refreshClient.auth.refreshToken = jest.fn(() => Promise.reject(thrown)) as any;
    await refreshClient.refreshTokenCallback();

    expect(onRefreshTokenError).toHaveBeenCalledTimes(2);
  });

  it('keeps a newer in-flight refresh when an older superseded attempt settles', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('an-old-refresh-token');

    const resolvers: Array<(session: any) => void> = [];
    const refreshToken = jest.fn(() => new Promise(resolve => {
      resolvers.push(resolve);
    }));
    refreshClient.auth.refreshToken = refreshToken as any;

    // Caller A starts a refresh with the old token.
    const first = refreshClient.refreshTokenCallback();
    // Fresh credentials arrive out-of-band, dropping the in-flight pointer and bumping generation.
    refreshClient.setRefreshToken('a-new-refresh-token');
    // Caller B starts a fresh refresh with the new token.
    const second = refreshClient.refreshTokenCallback();

    // The older attempt settles first; its finally must not clear caller B's live promise.
    resolvers[0]({ token: 'a-stale-token' });
    await first;

    // A third caller must dedup onto B's in-flight refresh, not start another one.
    const third = refreshClient.refreshTokenCallback();
    expect(refreshToken).toHaveBeenCalledTimes(2);

    resolvers[1]({ token: 'a-new-token' });
    await Promise.all([second, third]);
  });

  it('does not discard an in-flight refresh when the same refresh token is re-set', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('same-token');

    let resolveRefresh: (session: any) => void = () => {};
    refreshClient.auth.refreshToken = jest.fn(() => new Promise(resolve => {
      resolveRefresh = resolve;
    })) as any;
    const onRefreshToken = jest.fn();
    refreshClient.setOnRefreshToken(onRefreshToken);
    const setToken = jest.spyOn(refreshClient, 'setToken').mockImplementation(() => {});

    const pending = refreshClient.refreshTokenCallback();
    // Consumer rehydrates the identical token (e.g. on app resume) mid-flight.
    refreshClient.setRefreshToken('same-token');

    const session = { token: 'a-new-token' };
    resolveRefresh(session);
    const result = await pending;

    expect(result).toBe('a-new-token');
    expect(setToken).toHaveBeenCalledWith('a-new-token');
    expect(onRefreshToken).toHaveBeenCalledWith('a-new-token', session);
  });

  it('applies the token even when the onRefreshToken handler throws', async () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('a-refresh-token');
    refreshClient.auth.refreshToken = jest.fn(() => Promise.resolve({ token: 'a-new-token' })) as any;
    const setToken = jest.spyOn(refreshClient, 'setToken').mockImplementation(() => {});
    refreshClient.setOnRefreshToken(() => {
      throw new Error('handler blew up');
    });
    const onRefreshTokenError = jest.fn();
    refreshClient.setOnRefreshTokenError(onRefreshTokenError);

    const result = await refreshClient.refreshTokenCallback();

    expect(result).toBe('a-new-token');
    expect(setToken).toHaveBeenCalledWith('a-new-token');
    expect(onRefreshTokenError).not.toHaveBeenCalled();
  });

  it('clears the ApiRequester in-flight refresh when a new refresh token supersedes it', () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('an-old-refresh-token');
    // Simulate a 401 replay that left an in-flight refresh cached on the requester.
    refreshClient.client.refreshTokenPromise = Promise.resolve('a-stale-token');

    refreshClient.setRefreshToken('a-new-refresh-token');

    expect(refreshClient.client.refreshTokenPromise).toBeNull();
  });

  it('keeps the ApiRequester in-flight refresh when the same refresh token is re-set', () => {
    const refreshClient = new WazoApiClient({ server });
    refreshClient.setRefreshToken('same-token');
    const inFlight = Promise.resolve('a-token');
    refreshClient.client.refreshTokenPromise = inFlight;

    refreshClient.setRefreshToken('same-token');

    expect(refreshClient.client.refreshTokenPromise).toBe(inFlight);
  });
});
