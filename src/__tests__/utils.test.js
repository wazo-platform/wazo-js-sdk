import { getQueryString, computeUrl, callApi } from '../utils';

describe('Generating query string', () => {
  it('should generate a simple query string from an object', () => {
    expect(getQueryString({ a: 1, b: 'someString' })).toBe('a=1&b=someString');
    expect(getQueryString({ bool: true, b: 'booléen' })).toBe('bool=true&b=bool%C3%A9en');
    expect(getQueryString({ nope: undefined, b: 'yep' })).toBe('b=yep');
  });
});

describe('Computing fetch URL', () => {
  it('should add query string to URL in get method with body', () => {
    expect(computeUrl('get', 'www.google.ca', { a: 1 })).toBe('www.google.ca?a=1');
    expect(computeUrl('post', 'www.google.ca', { a: 1 })).toBe('www.google.ca');
    expect(computeUrl('get', 'www.google.ca', null)).toBe('www.google.ca');
    expect(computeUrl('get', 'www.google.ca', {})).toBe('www.google.ca');
  });
});

describe('Calling fetch', () => {
  it('should call fetch without body but query string in get method', () => {
    jest.mock('cross-fetch/polyfill', () => {});
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

    const host = 'localhost';
    const method = 'get';
    const body = { a: 1 };

    callApi(host, method, body);
    expect(global.fetch).toBeCalledWith(`${host}?a=1`, { method: 'get', body: null, headers: {} });
  });
});
