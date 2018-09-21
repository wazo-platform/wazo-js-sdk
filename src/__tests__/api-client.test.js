import { Base64 } from 'js-base64';
import WazoApiClient from '../api-client';

const mockedResponse = { data: { token: 1 } };
const mockedJson = { json: () => Promise.resolve(mockedResponse) };
const mockedError = { text: () => Promise.resolve(mockedResponse), status: 500, headers: { get: () => 'text/plain' } };
const mockedFailure = {
  text: () => Promise.resolve(mockedResponse),
  status: 401,
  headers: { get: () => 'text/plain' }
};
const server = 'localhost';
const authVersion = '0.1';
const username = 'wazo';
const password = 'zowa';

jest.mock('cross-fetch/polyfill', () => {});

const client = new WazoApiClient({ server });

describe('With correct API results', () => {
  beforeEach(() => {
    jest.resetModules();

    global.fetch = jest.fn(() => Promise.resolve(mockedJson));
  });

  describe('logIn test', () => {
    it('should retrieve user token', async () => {
      const data = { backend: 'wazo_user', expiration: 3600 };
      const headers = {
        Authorization: `Basic ${Base64.encode(`${username}:${password}`)}`,
        'Content-Type': 'application/json'
      };

      const result = await client.auth.logIn({ username, password });
      expect(result.data.token).toBe(1);

      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token`, {
        method: 'post',
        body: JSON.stringify(data),
        headers
      });
    });
  });

  describe('logOut test', () => {
    it('should delete the specified token', async () => {
      const token = 123;
      await client.auth.logOut(token);

      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token/${token}`, {
        method: 'delete',
        body: null,
        headers: {}
      });
    });
  });
});

describe('With erroneous API results', () => {
  beforeEach(() => {
    jest.resetModules();

    global.fetch = jest.fn(() => Promise.resolve(mockedFailure));
  });

  describe('checkLogin test', () => {
    it('should return false on 401 status', async () => {
      const token = 123;
      const result = await client.auth.checkToken(token);

      expect(result).toBeFalsy();

      expect(global.fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token/${token}`, {
        method: 'head',
        body: null,
        headers: {}
      });
    });
  });
});

describe('With erroneous API results', () => {
  beforeEach(() => {
    jest.resetModules();

    global.fetch = jest.fn(() => Promise.resolve(mockedError));
  });

  it('throw an exception when the response is >= 401', async () => {
    let error = null;
    try {
      await client.auth.logIn({ username, password });
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
  });
});
