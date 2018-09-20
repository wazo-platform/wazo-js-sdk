/* @flow */
import { Base64 } from 'js-base64';
import type ApiClient from '../api-client'; // eslint-disable-line
import type LoginResponse from '../types';

// eslint-disable-next-line
export default (ApiClient: Class<ApiClient>, client: ApiClient) => ({
  checkToken(token: string): Promise<Boolean> {
    const url = `${client.authUrl}/token/${token}`;

    return ApiClient.callApi(url, 'head', null, {}, response => response.status === 204);
  },

  logIn(params: Object = {}): Promise<LoginResponse> {
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

  logOut(token: string) {
    return ApiClient.callApi(`${client.authUrl}/token/${token}`, 'delete');
  },

  listTenants(token: string) {
    return ApiClient.callApi(`${client.authUrl}/tenants`, 'get', null, ApiClient.getHeaders(token));
  },

  createTenant(token: string, name: string) {
    return ApiClient.callApi(`${client.authUrl}/tenants`, 'post', { name }, ApiClient.getHeaders(token));
  },

  deleteTenant(token: string, uuid: string) {
    return ApiClient.callApi(`${client.authUrl}/tenants/${uuid}`, 'delete', null, ApiClient.getHeaders(token));
  },

  listUsers(token: string) {
    return ApiClient.callApi(`${client.authUrl}/users`, 'get', null, ApiClient.getHeaders(token));
  },

  listGroups(token: string) {
    return ApiClient.callApi(`${client.authUrl}/groups`, 'get', null, ApiClient.getHeaders(token));
  },

  listPolicies(token: string) {
    return ApiClient.callApi(`${client.authUrl}/policies`, 'get', null, ApiClient.getHeaders(token));
  }
});
