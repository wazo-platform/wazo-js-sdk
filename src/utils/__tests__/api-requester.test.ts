import ApiRequester from '../api-requester';

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
    await requester.call(path, method, body);

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
    await requester.call(path, method, body, { 'Wazo-Tenant': false });

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
    await requester.call(path, method, body, null);
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
