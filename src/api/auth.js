/* @flow */
import { Base64 } from 'js-base64';
import { callApi, getHeaders, successResponseParser } from '../utils';
import type {
  Tenant,
  Token,
  UUID,
  LoginResponse,
  LogoutResponse,
  ListTenantsResponse,
  RequestError,
  ListUsersResponse,
  ListGroupsResponse,
  ListPoliciesResponse
} from '../types';

const DEFAULT_BACKEND_USER = 'wazo_user';
const DETAULT_EXPIRATION = 3600;

export default (baseUrl: string) => ({
  checkToken(token: Token): Promise<Boolean> {
    return callApi(`${baseUrl}/token/${token}`, 'head', null, {});
  },

  authenticate(token: Token): Promise<?LoginResponse> {
    return callApi(`${baseUrl}/token/${token}`, 'get', null, {});
  },

  logIn(params: Object = {}): Promise<?LoginResponse> {
    const body = {
      backend: params.backend || DEFAULT_BACKEND_USER,
      expiration: params.expiration || DETAULT_EXPIRATION
    };
    const headers = {
      Authorization: `Basic ${Base64.encode(`${params.username}:${params.password}`)}`,
      'Content-Type': 'application/json'
    };

    return callApi(`${baseUrl}/token`, 'post', body, headers);
  },

  logOut(token: Token): Promise<LogoutResponse> {
    return callApi(`${baseUrl}/token/${token}`, 'delete', null, {}, successResponseParser);
  },

  updatePassword(token: Token, userUuid: UUID, oldPassword: string, newPassword: string) {
    const body = {
      new_password: newPassword,
      old_password: oldPassword
    };

    return callApi(`${baseUrl}/users/${userUuid}/password`, 'put', body, getHeaders(token), successResponseParser);
  },

  sendDeviceToken(token: Token, userUuid: UUID, deviceToken: string) {
    const body = {
      token: deviceToken
    };

    return callApi(`${baseUrl}/users/${userUuid}/external/mobile`, 'post', body, getHeaders(token));
  },

  removeDeviceToken(token: Token, userUuid: UUID) {
    return callApi(`${baseUrl}/users/${userUuid}/external/mobile`, 'delete', null, getHeaders(token));
  },

  listTenants(token: Token): Promise<ListTenantsResponse> {
    return callApi(`${baseUrl}/tenants`, 'get', null, getHeaders(token));
  },

  createTenant(token: Token, name: string): Promise<Tenant | RequestError> {
    return callApi(`${baseUrl}/tenants`, 'post', { name }, getHeaders(token));
  },

  deleteTenant(token: Token, uuid: UUID): Promise<Boolean | RequestError> {
    return callApi(`${baseUrl}/tenants/${uuid}`, 'delete', null, getHeaders(token));
  },

  listUsers(token: Token): Promise<ListUsersResponse> {
    return callApi(`${baseUrl}/users`, 'get', null, getHeaders(token));
  },

  listGroups(token: Token): Promise<ListGroupsResponse> {
    return callApi(`${baseUrl}/groups`, 'get', null, getHeaders(token));
  },

  listPolicies(token: Token): Promise<ListPoliciesResponse> {
    return callApi(`${baseUrl}/policies`, 'get', null, getHeaders(token));
  }
});
