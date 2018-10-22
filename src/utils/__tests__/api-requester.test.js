import ApiRequester from '../api-requester';

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

describe('Calling fetch', () => {
  it('should call fetch without body but query string in get method', () => {
    jest.mock('node-fetch/lib/index', () => {});
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

    const server = 'localhost';
    const path = 'auth';
    const method = 'get';
    const body = { a: 1 };
    const url = `https://${server}/api/${path}?a=1`;

    new ApiRequester({ server }).call(path, method, body);
    expect(global.fetch).toBeCalledWith(url, { method: 'get', body: null, headers: {}, agent: null });
  });
});
