import { Base64 } from 'js-base64';

const mockedResponse = { data: { token: 1 } };
const mockedJson = { json: () => Promise.resolve(mockedResponse) };
const mockedError = { text: () => Promise.resolve(mockedResponse), status: 401, headers: { get: () => 'text/plain' } };
const server = 'localhost';
const authVersion = '0.1';
const username = 'wazo';
const password = 'zowa';

// Required by jest because we have to require modules after a mock
// @see https://github.com/facebook/jest/issues/2582
const getMockedObjects = () => {
  const fetch = require('cross-fetch'); // eslint-disable-line
  const WazoApiClient = require('../../src/api-client').default; // eslint-disable-line

  return { WazoApiClient, fetch };
};

describe('With correct API results', () => {
  let client;
  let fetch;

  beforeEach(() => {
    jest.resetModules();

    jest.mock('cross-fetch', () => jest.fn(() => Promise.resolve(mockedJson)));
    const objects = getMockedObjects();

    client = new objects.WazoApiClient({ server });
    fetch = objects.fetch;
  });

  describe('logIn test', () => {
    it('should retrieve user token', async () => {
      const data = { backend: 'wazo_user', expiration: 3600 };
      const headers = {
        Authorization: `Basic ${Base64.encode(`${username}:${password}`)}`,
        'Content-Type': 'application/json'
      };

      const result = await client.logIn({ username, password });
      expect(result.token).toBe(1);

      expect(fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token`, {
        method: 'post',
        body: JSON.stringify(data),
        headers
      });
    });
  });

  describe('logOut test', () => {
    it('should delete the specified token', async () => {
      const token = 123;
      await client.logOut(token);

      expect(fetch).toBeCalledWith(`https://${server}/api/auth/${authVersion}/token/${token}`, {
        method: 'delete',
        body: null,
        headers: {}
      });
    });
  });
});

describe('With erroneous API results', () => {
  let client;
  let fetch;

  beforeEach(() => {
    jest.resetModules();

    jest.mock('cross-fetch', () => jest.fn(() => Promise.resolve(mockedError)));
    const objects = getMockedObjects();

    client = new objects.WazoApiClient({ server });
    fetch = objects.fetch;
  });

  it('throw an exception when the response is >= 401', async () => {
    let error = null;
    try {
      await client.logIn({ username, password });
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
  });
});
