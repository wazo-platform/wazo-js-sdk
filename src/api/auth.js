/* @flow */
import { Base64 } from 'js-base64';
import { callApi, getHeaders } from '../utils';
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
    const url = `${baseUrl}/token/${token}`;

    return callApi(url, 'head', null, {}, response => response.status === 204);
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

    return callApi(`${baseUrl}/token`, 'post', body, headers, res => res.json().then(data => data.data));
  },

  logOut(token: Token): Promise<LogoutResponse> {
    return callApi(`${baseUrl}/token/${token}`, 'delete');
  },

  listTenants(token: Token): Promise<ListTenantsResponse> {
    return callApi(`${baseUrl}/tenants`, 'get', null, getHeaders(token));
  },

  createTenant(token: Token, name: string): Promise<Tenant | RequestError> {
    return callApi(`${baseUrl}/tenants`, 'post', { name }, getHeaders(token));
  },

  deleteTenant(token: Token, uuid: UUID): Promise<Boolean | RequestError> {
    const url = `${baseUrl}/tenants/${uuid}`;
    return callApi(url, 'delete', null, getHeaders(token), response => response.status === 204);
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
