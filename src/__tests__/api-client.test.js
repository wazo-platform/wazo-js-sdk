import { Base64 } from 'js-base64';
import WazoApiClient from '../api-client';
import BadResponse from '../domain/BadResponse';

const mockedResponse = { data: { token: 1 } };
const mockedNotFoundResponse = {
  timestamp: 1537529588.789515,
  message: 'No such user voicemail',
  error_id: 'no-such-user-voicemail',
  'details': {
    user_uuid: 'xxx-xxx-xxx-xxx-xxxx'
  }
};
const mockedJson = {
  ok: true,
  json: () => Promise.resolve(mockedResponse),
  headers: { get: () => 'application/json' }
};
const mockedError = {
  ok: false,
  text: () => Promise.resolve(mockedResponse),
  status: 500,
  headers: { get: () => 'text/plain' }
};
const mockedUnAuthorized = {
  text: () => Promise.resolve(mockedResponse),
  ok: false,
  status: 401,
  headers: { get: () => 'text/plain' }
};
const mockedNotFound = {
  json: () => Promise.resolve(mockedNotFoundResponse),
  ok: false,
  status: 404,
  headers: { get: () => 'application/json' }
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

describe('With unAuthorizes API results', () => {
  beforeEach(() => {
    jest.resetModules();

    global.fetch = jest.fn(() => Promise.resolve(mockedUnAuthorized));
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

describe('With not found API results', () => {
  beforeEach(() => {
    jest.resetModules();

    global.fetch = jest.fn(() => Promise.resolve(mockedNotFound));
  });

  describe('fetchVoiceMail test', () => {
    it('should return a BadResponse instance on 404 status', async () => {
      const token = 123;
      const result = await client.ctidng.listVoiceMails(token);

      expect(result).toBeInstanceOf(BadResponse);
      expect(result.message).toBe(mockedNotFoundResponse.message);

      expect(global.fetch).toBeCalledWith(`https://${server}/api/ctid-ng/1.0/users/me/voicemails`, {
        method: 'get',
        body: null,
        headers: { 'X-Auth-Token' : token, 'Content-Type': 'application/json' }
      });
    });
  });
});

describe('With erroneous API results', () => {
  beforeEach(() => {
    jest.resetModules();

    global.fetch = jest.fn(() => Promise.resolve(mockedError));
  });

  it('throw an exception when the response is >= 500', async () => {
    let error = null;
    try {
      await client.auth.logIn({ username, password });
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
  });
});
