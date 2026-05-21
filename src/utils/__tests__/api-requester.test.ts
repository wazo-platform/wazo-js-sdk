import ApiRequester from '../api-requester';
import IssueReporter from '../../service/IssueReporter';

const server = 'localhost';
const path = 'auth';
const method = 'get';
const body = {
  a: 1,
};
const url = `https://${server}/api/${path}?a=1`;
const token = 'abc';
const newToken = 'newToken';
const tenant = 'abc234';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Auth-Token': token,
};

describe('Generating query string', () => {
  it('should generate a simple query string from an object', () => {
    expect(ApiRequester.getQueryString({
      a: 1,
      b: 'someString',
    })).toBe('a=1&b=someString');
    expect(ApiRequester.getQueryString({
      bool: true,
      b: 'booléen',
    })).toBe('bool=true&b=bool%C3%A9en');
    expect(ApiRequester.getQueryString({
      nope: undefined,
      b: 'yep',
    })).toBe('b=yep');
  });
});

describe('Computing fetch URL', () => {
  it('should add query string to URL in get method with body', () => {
    const client = new ApiRequester({
      server: 'localhost',
      agent: null,
      clientId: null,
      refreshTokenCallback: () => null,
      fetchOptions: null,
    });
    expect(client.computeUrl('get', 'auth', {
      a: 1,
    })).toBe('https://localhost/api/auth?a=1');
    expect(client.computeUrl('post', 'auth', {
      a: 1,
    })).toBe('https://localhost/api/auth');
    expect(client.computeUrl('get', 'auth', null)).toBe('https://localhost/api/auth');
    expect(client.computeUrl('get', 'auth', {})).toBe('https://localhost/api/auth');
  });
});

describe('Retrieving headers', () => {
  let requester: ApiRequester;

  beforeEach(() => {
    requester = new ApiRequester({
      server,
      agent: null,
      token,
      clientId: null,
      refreshTokenCallback: () => null,
      fetchOptions: null,
    });

    requester.setTenant(null);
  });

  it('should send a tenant if defined from helper', () => {
    requester.setTenant(tenant);
    expect(requester.getHeaders(null)['Wazo-Tenant']).toBe(tenant);
  });

  it('should not send a tenant if not present', () => {
    expect(requester.getHeaders(null)).not.toHaveProperty('Wazo-Tenant');
  });

  it('should remove tenant header based on arguments if falsy', () => {
    requester.setTenant(tenant);
    const forcedHeaders = { 'Wazo-Tenant': false };
    const generatedHeaders = requester.getHeaders(forcedHeaders);
    expect(generatedHeaders).not.toHaveProperty('Wazo-Tenant');
    expect(generatedHeaders['X-Auth-Token']).toBe(token);
    expect(generatedHeaders['Content-Type']).toBe('application/json');

    const forcedHeadersNull = { 'Wazo-Tenant': null };
    const generatedHeadersNull = requester.getHeaders(forcedHeadersNull);
    expect(generatedHeadersNull).not.toHaveProperty('Wazo-Tenant');
    expect(generatedHeadersNull['X-Auth-Token']).toBe(token);
    expect(generatedHeadersNull['Content-Type']).toBe('application/json');
  });

  it('should override tenant header based on arguments if not false', () => {
    requester.setTenant(tenant);
    const forcedHeaders = {
      'Wazo-Tenant': '1111-1111-1111-111',
    };

    const generatedHeaders = requester.getHeaders(forcedHeaders);
    expect(generatedHeaders['Wazo-Tenant']).toBe('1111-1111-1111-111');
    expect(generatedHeaders['X-Auth-Token']).toBe(token);
    expect(generatedHeaders['Content-Type']).toBe('application/json');
  });

  it('should be able to override all headers', () => {
    const forcedHeaders = { foo: 'bar' };

    expect(requester.getHeaders(forcedHeaders)).toStrictEqual(forcedHeaders);
  });
});

describe('Calling fetch', () => {
  let requester: ApiRequester;

  beforeEach(() => {
    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({}),
        headers: {
          get: () => 'application/json',
        },
      }) as any),
    });

    requester = new ApiRequester({
      server,
      agent: null,
      clientId: null,
      token,
      refreshTokenCallback: () => null,
      fetchOptions: null,
    });

    requester.setTenant(tenant);
  });

  it('should call fetch without body but query string in get method', async () => {
    await requester.call({ path, method, body });

    expect(global.fetch).toBeCalledWith(url, {
      method: 'get',
      body: null,
      signal: expect.any(Object),
      headers: {
        ...headers,
        'Wazo-Tenant': tenant,
      },
      agent: null,
    });
  });

  it('should use allow to call a path witout wazo-tenant', async () => {
    await requester.call({ path, method, body, headers: { 'Wazo-Tenant': false } });

    expect(global.fetch).toBeCalledWith(url, {
      method: 'get',
      body: null,
      signal: expect.any(Object),
      headers, // without Wazo-Tenant
      agent: null,
    });
  });
});

describe('With a refresh token', () => {
  it('should retry the call with a new token', async () => {
    let calls = 0;
    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => {
        calls++;
        return Promise.resolve({
          headers: {
            get: () => 'application/json',
          },
          status: calls === 1 ? 401 : 200,
          json: () => Promise.resolve({}),
        } as any);
      }),
    });

    const requester = new ApiRequester({
      server,
      agent: null,
      clientId: null,
      refreshTokenCallback: () => null,
      fetchOptions: null,
    });
    requester.token = token;

    requester.refreshTokenCallback = () => {
      requester.token = newToken;
      return new Promise(resolve => resolve(null));
    };

    const updatedHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Auth-Token': newToken,
    };
    await requester.call({ path, method, body, headers: null });
    expect(global.fetch).toHaveBeenNthCalledWith(1, url, {
      method: 'get',
      body: null,
      signal: expect.any(Object),
      headers,
      agent: null,
    });
    expect(global.fetch).toHaveBeenNthCalledWith(2, url, {
      method: 'get',
      body: null,
      signal: expect.any(Object),
      headers: updatedHeaders,
      agent: null,
    });
  });
});

describe('Handling 204 No Content responses', () => {
  let requester: ApiRequester;

  beforeEach(() => {
    requester = new ApiRequester({
      server,
      agent: null,
      clientId: null,
      token,
      refreshTokenCallback: () => null,
      fetchOptions: null,
    });
  });

  it('should not trigger a JSON.parse error on 204 response with content-type application/json', async () => {
    const mockedEmpty204 = {
      json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')),
      text: () => Promise.resolve(''),
      ok: true,
      status: 204,
      headers: {
        get: () => 'application/json',
      },
    };

    Object.defineProperty(global, 'fetch', {
      value: jest.fn(() => Promise.resolve(mockedEmpty204) as any),
    });

    let error = null;
    try {
      await requester.call({ path, method: 'put', body: {} });
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeNull();
  });
});

describe('ignoreStatuses option', () => {
  const makeFetchResponse = (status: number) => Promise.resolve({
    status,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve({ reason: 'oops' }),
  } as any);

  let requester: ApiRequester;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    requester = new ApiRequester({
      server,
      agent: null,
      clientId: null,
      token,
      refreshTokenCallback: () => null,
      fetchOptions: null,
    });
    logSpy = jest.spyOn(IssueReporter, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  const apiErrorCalls = () => logSpy.mock.calls.filter(call => call[2] === 'API error');

  it('does not log an API error when status is in ignoreStatuses', async () => {
    Object.defineProperty(globalThis, 'fetch', { value: jest.fn(() => makeFetchResponse(404)) });

    await expect(requester.call({ path, method, ignoreStatuses: [404] })).rejects.toBeDefined();

    expect(apiErrorCalls()).toHaveLength(0);
  });

  it('still logs when the status is not in ignoreStatuses', async () => {
    Object.defineProperty(globalThis, 'fetch', { value: jest.fn(() => makeFetchResponse(500)) });

    await expect(requester.call({ path, method, ignoreStatuses: [404] })).rejects.toBeDefined();

    expect(apiErrorCalls()).toHaveLength(1);
  });

  it('logs as usual when ignoreStatuses is not set', async () => {
    Object.defineProperty(globalThis, 'fetch', { value: jest.fn(() => makeFetchResponse(404)) });

    await expect(requester.call({ path, method })).rejects.toBeDefined();

    expect(apiErrorCalls()).toHaveLength(1);
  });

  it('does not affect a concurrent call without ignoreStatuses', async () => {
    Object.defineProperty(globalThis, 'fetch', { value: jest.fn(() => makeFetchResponse(404)) });

    await Promise.allSettled([
      requester.call({ path, method, ignoreStatuses: [404] }),
      requester.call({ path, method }),
    ]);

    expect(apiErrorCalls()).toHaveLength(1);
  });
});

describe('base64Encode', () => {
  it('should encode a string using base64', () => {
    const input = 'Hello World!';
    const expectedOutput = 'SGVsbG8gV29ybGQh';
    expect(ApiRequester.base64Encode(input)).toBe(expectedOutput);
  });

  it('should handle special characters', () => {
    const input = 'éà$@€';
    const expectedOutput = 'w6nDoCRA4oKs';
    expect(ApiRequester.base64Encode(input)).toBe(expectedOutput);
  });

  it('should handle empty string', () => {
    const input = '';
    const expectedOutput = '';
    expect(ApiRequester.base64Encode(input)).toBe(expectedOutput);
  });
});
