/* @flow */
import { Base64 } from 'js-base64';
import type ApiClient from '../api-client'; // eslint-disable-line
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

// eslint-disable-next-line
export default (ApiClient: Class<ApiClient>, client: ApiClient) => ({
  checkToken(token: Token): Promise<Boolean> {
    const url = `${client.authUrl}/token/${token}`;

    return ApiClient.callApi(url, 'head', null, {}, response => response.status === 204);
  },

  logIn(params: Object = {}): Promise<?LoginResponse> {
    const body = {
      backend: params.backend || client.backendUser,
      expiration: params.expiration || client.expiration
    };
    const headers = {
      Authorization: `Basic ${Base64.encode(`${params.username}:${params.password}`)}`,
      'Content-Type': 'application/json'
    };

    return ApiClient.callApi(`${client.authUrl}/token`, 'post', body, headers, res =>
      res.json().then(data => data.data)
    );
  },

  logOut(token: Token): Promise<LogoutResponse> {
    return ApiClient.callApi(`${client.authUrl}/token/${token}`, 'delete');
  },

  listTenants(token: Token): Promise<ListTenantsResponse> {
    return ApiClient.callApi(`${client.authUrl}/tenants`, 'get', null, ApiClient.getHeaders(token));
  },

  createTenant(token: Token, name: string): Promise<Tenant | RequestError> {
    return ApiClient.callApi(`${client.authUrl}/tenants`, 'post', { name }, ApiClient.getHeaders(token));
  },

  deleteTenant(token: Token, uuid: UUID): Promise<Boolean | RequestError> {
    const url = `${client.authUrl}/tenants/${uuid}`;
    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token), response => response.status === 204);
  },

  listUsers(token: Token): Promise<ListUsersResponse> {
    return ApiClient.callApi(`${client.authUrl}/users`, 'get', null, ApiClient.getHeaders(token));
  },

  listGroups(token: Token): Promise<ListGroupsResponse> {
    return ApiClient.callApi(`${client.authUrl}/groups`, 'get', null, ApiClient.getHeaders(token));
  },

  listPolicies(token: Token): Promise<ListPoliciesResponse> {
    return ApiClient.callApi(`${client.authUrl}/policies`, 'get', null, ApiClient.getHeaders(token));
  }
});
