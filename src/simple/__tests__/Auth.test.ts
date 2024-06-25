import getApiClient, { setRefreshToken } from '../../service/getApiClient';
import { Auth as AuthClass } from '../Auth';

const Auth = new AuthClass();
const TOKEN = 'some-token';
const REFRESH_TOKEN = 'some-refresh-token';
const USER_UUID = 'some-user-uuid';

jest.mock('../../service/getApiClient');

describe('simple/Auth', () => {
  beforeEach(() => {
    const authenticate = jest.fn();
    (getApiClient as any).mockImplementation(() => ({
      auth: {
        authenticate,
      },
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateToken', () => {
    it('should return undefined if nullish', async () => {
      // @ts-expect-error
      const result = await Auth.validateToken(null);
      expect(result).toEqual(undefined);
    });

    it('should set refresh token if provided', async () => {
      await Auth.validateToken(TOKEN, REFRESH_TOKEN);
      expect(setRefreshToken).toHaveBeenCalledWith(REFRESH_TOKEN);
    });

    it('should set user uuid header when using edge server', async () => {
      Auth.usingEdgeServer = true;
      const setHttpUserUuidHeader = jest.spyOn(Auth, 'setHttpUserUuidHeader');
      await Auth.validateToken(TOKEN, undefined, USER_UUID);
      expect(setHttpUserUuidHeader).toHaveBeenCalledWith(USER_UUID);
    });

    it('should NOT set user uuid header when NOT using edge server', async () => {
      Auth.usingEdgeServer = false;
      const setHttpUserUuidHeader = jest.spyOn(Auth, 'setHttpUserUuidHeader');
      await Auth.validateToken(TOKEN, undefined, USER_UUID);
      expect(setHttpUserUuidHeader).not.toHaveBeenCalled();
    });
  });
  describe('checkHttpUserUuidHeader', () => {
    it('should return undefined if UUID is null', async () => {
      const result = await Auth.checkHttpUserUuidHeader(null);
      expect(result).toEqual(undefined);
    });

    it('should set user UUID header on successful HEAD call', async () => {
      const head = jest.fn(() => Promise.resolve({ headers: { get: () => null } }));
      const setHttpUserUuidHeader = jest.spyOn(Auth, 'setHttpUserUuidHeader');
      Auth.onSetUsingEdgeServer = jest.fn();
      (getApiClient as any).mockImplementation(() => ({
        client: {
          head,
        },
      }));
      await Auth.checkHttpUserUuidHeader(USER_UUID);
      expect(head).toHaveBeenCalled();
      expect(setHttpUserUuidHeader).toHaveBeenCalledWith(USER_UUID);
      expect(Auth.usingEdgeServer).toEqual(true);
      expect(Auth.onSetUsingEdgeServer).toHaveBeenCalledWith(true);
    });

    it('should NOT set user UUID header on failed HEAD call', async () => {
      const head = jest.fn(() => Promise.reject());
      const setHttpUserUuidHeader = jest.spyOn(Auth, 'setHttpUserUuidHeader');
      Auth.onSetUsingEdgeServer = jest.fn();
      (getApiClient as any).mockImplementation(() => ({
        client: {
          head,
        },
      }));
      await Auth.checkHttpUserUuidHeader(USER_UUID);
      expect(head).toHaveBeenCalled();
      expect(setHttpUserUuidHeader).not.toHaveBeenCalled();
      expect(Auth.usingEdgeServer).toEqual(false);
      expect(Auth.onSetUsingEdgeServer).toHaveBeenCalledWith(false);
    });

    it('should set user UUID header on mobile when header is present', async () => {
      Auth.mobile = true;
      const head = jest.fn(() => Promise.resolve({ headers: { get: () => 'X-User-UUID: something' } }));
      const setHttpUserUuidHeader = jest.spyOn(Auth, 'setHttpUserUuidHeader');
      Auth.onSetUsingEdgeServer = jest.fn();
      (getApiClient as any).mockImplementation(() => ({
        client: {
          head,
        },
      }));
      await Auth.checkHttpUserUuidHeader(USER_UUID);
      expect(head).toHaveBeenCalled();
      expect(setHttpUserUuidHeader).toHaveBeenCalledWith(USER_UUID);
      expect(Auth.usingEdgeServer).toEqual(true);
      expect(Auth.onSetUsingEdgeServer).toHaveBeenCalledWith(true);
    });

    it('should NOT set user UUID header on mobile when header is NOT present', async () => {
      Auth.mobile = true;
      const head = jest.fn(() => Promise.resolve({ headers: { get: () => 'something' } }));
      const setHttpUserUuidHeader = jest.spyOn(Auth, 'setHttpUserUuidHeader');
      Auth.onSetUsingEdgeServer = jest.fn();
      (getApiClient as any).mockImplementation(() => ({
        client: {
          head,
        },
      }));
      await Auth.checkHttpUserUuidHeader(USER_UUID);
      expect(head).toHaveBeenCalled();
      expect(setHttpUserUuidHeader).not.toHaveBeenCalled();
      expect(Auth.usingEdgeServer).toEqual(false);
      expect(Auth.onSetUsingEdgeServer).toHaveBeenCalledWith(false);
    });
  });

  describe('initiateIdpAuthentication', () => {
    const validResponse = { location: 'idp.com/auth', saml_session_id: 'a1b2C3d4' };

    it('should return a `location` and `saml_session_id` if the response is ok', async () => {
      const initiateIdpAuthentication = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 303,
          json: () => Promise.resolve(validResponse),
        }));

      (getApiClient as any).mockImplementation(() => ({
        auth: {
          initiateIdpAuthentication,
        },
      }));

      const response = await Auth.initiateIdpAuthentication('example.com', 'https://myapp.xyz');
      expect(response).toBe(validResponse);
    });
    it('should return a `NoSamlRouteError` if the response is a 404', async () => {
      const initiateIdpAuthentication = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        }));

      (getApiClient as any).mockImplementation(() => ({
        auth: {
          initiateIdpAuthentication,
        },
      }));

      await expect(Auth.initiateIdpAuthentication('example.com', 'https://myapp.xyz')).rejects.toThrow(
        'No route found for SAML SSO',
      );
    });

    it('should return an error `message` if the response is NOT ok', async () => {
      const initiateIdpAuthentication = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'an error message', reason: 'an error reason' }),
        }));

      (getApiClient as any).mockImplementation(() => ({
        auth: {
          initiateIdpAuthentication,
        },
      }));

      await expect(Auth.initiateIdpAuthentication('example.com', 'https://myapp.xyz')).rejects.toThrow(
        'an error message',
      );
    });

    it('should return an error `reason` if there is no `message` and the response is NOT ok', async () => {
      const initiateIdpAuthentication = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ reason: 'an error reason' }),
        }));

      (getApiClient as any).mockImplementation(() => ({
        auth: {
          initiateIdpAuthentication,
        },
      }));

      await expect(Auth.initiateIdpAuthentication('example.com', 'https://myapp.xyz')).rejects.toThrow(
        'an error reason',
      );
    });

    it('should return an error with a null message if there is no `message` and `reason`', async () => {
      const initiateIdpAuthentication = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        }));

      (getApiClient as any).mockImplementation(() => ({
        auth: {
          initiateIdpAuthentication,
        },
      }));

      await expect(Auth.initiateIdpAuthentication('example.com', 'https://myapp.xyz')).rejects.toThrow('');
    });

    it('should return a NoSAMLRouteError if the response is a 404', async () => {
      const initiateIdpAuthentication = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        }));

      (getApiClient as any).mockImplementation(() => ({
        auth: {
          initiateIdpAuthentication,
        },
      }));

      await expect(Auth.initiateIdpAuthentication('example.com', 'https://myapp.xyz')).rejects.toThrow('No route found for SAML SSO');
    });

    it('should return a SamlConfigError if the response is a 500', async () => {
      const initiateIdpAuthentication = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        }));

      (getApiClient as any).mockImplementation(() => ({
        auth: {
          initiateIdpAuthentication,
        },
      }));

      await expect(Auth.initiateIdpAuthentication('example.com', 'https://myapp.xyz')).rejects.toThrow('SAML/server configuration error');
    });
  });
});
