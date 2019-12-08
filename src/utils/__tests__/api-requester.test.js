import ApiRequester from '../api-requester';

const server = 'localhost';
const path = 'auth';
const method = 'get';
const body = { a: 1 };
const url = `https://${server}/api/${path}?a=1`;
const token = 'abc';
const newToken = 'newToken';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Auth-Token': token,
};

describe('Generating query string', () => {
  it('should generate a simple query string from an object', () => {
    expect(ApiRequester.getQueryString({ a: 1, b: 'someString' })).toBe('a=1&b=someString');
    expect(ApiRequester.getQueryString({ bool: true, b: 'booléen' })).toBe('bool=true&b=bool%C3%A9en');
    expect(ApiRequester.getQueryString({ nope: undefined, b: 'yep' })).toBe('b=yep');
  });
});

describe('Computing fetch URL', () => {
  it('should add query string to URL in get method with body', () => {
    const client = new ApiRequester({ server: 'localhost' });

    expect(client.computeUrl('get', 'auth', { a: 1 })).toBe('https://localhost/api/auth?a=1');
    expect(client.computeUrl('post', 'auth', { a: 1 })).toBe('https://localhost/api/auth');
    expect(client.computeUrl('get', 'auth', null)).toBe('https://localhost/api/auth');
    expect(client.computeUrl('get', 'auth', {})).toBe('https://localhost/api/auth');
  });
});

describe('Retrieving headers', () => {
  it('should send a tenant if exists', () => {
    const tenant = 'abc234';

    const requester = new ApiRequester({ server });
    requester.setTenant(tenant);

    expect(requester.getHeaders()['Wazo-Tenant']).toBe(tenant);
  });

  it('should not send a tenant if not present', () => {
    const requester = new ApiRequester({ server });

    expect(requester.getHeaders()).not.toHaveProperty('Wazo-Tenant');
  });
});

describe('Calling fetch', () => {
  it('should call fetch without body but query string in get method', () => {
    jest.mock('node-fetch/lib/index', () => {});
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

    new ApiRequester({ server }).call(path, method, body, {});
    expect(global.fetch).toBeCalledWith(url, { method: 'get', body: null, headers: {}, agent: null });
  });
});

describe('With a refresh token', () => {
  it('should retry the call with a new token', async () => {
    jest.mock('node-fetch/lib/index', () => {});
    let calls = 0;
    global.fetch = jest.fn(() => {
      calls++;
      return Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        status: calls === 1 ? 401 : 200,
        json: () => Promise.resolve({}),
      });
    });

    const requester = new ApiRequester({ server });
    requester.token = token;

    requester.refreshTokenCallback = () => {
      requester.token = newToken;
      return new Promise(resolve => resolve());
    };

    const updatedHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Auth-Token': newToken,
    };

    await requester.call(path, method, body, null);

    expect(global.fetch).toHaveBeenNthCalledWith(1, url, { method: 'get', body: null, headers, agent: null });
    expect(global.fetch).toHaveBeenNthCalledWith(2, url, {
      method: 'get',
      body: null,
      headers: updatedHeaders,
      agent: null,
    });
  });
});
