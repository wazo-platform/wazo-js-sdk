import getApiClient, { setRefreshToken } from '../../service/getApiClient';
import Auth from '../Auth';

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
});
