import { Base64 } from 'js-base64';

export default (ApiClient, client) => ({
  checkToken(token) {
    const url = `${client.authUrl}/token/${token}`;

    return ApiClient.callApi(url, 'head', null, null, response => response.status === 204);
  },

  logIn(params = {}) {
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

  logOut(token) {
    return ApiClient.callApi(`${client.authUrl}/token/${token}`, 'delete');
  },

  listTenants(token) {
    return ApiClient.callApi(`${client.authUrl}/tenants`, 'get', null, ApiClient.getHeaders(token));
  },

  createTenant(token, name) {
    return ApiClient.callApi(`${client.authUrl}/tenants`, 'post', { name }, ApiClient.getHeaders(token));
  },

  deleteTenant(token, uuid) {
    return ApiClient.callApi(`${client.authUrl}/tenants/${uuid}`, 'delete', null, ApiClient.getHeaders(token));
  },

  listUsers(token) {
    return ApiClient.callApi(`${client.authUrl}/users`, 'get', null, ApiClient.getHeaders(token));
  },

  listGroups(token) {
    return ApiClient.callApi(`${client.authUrl}/groups`, 'get', null, ApiClient.getHeaders(token));
  },

  listPolicies(token) {
    return ApiClient.callApi(`${client.authUrl}/policies`, 'get', null, ApiClient.getHeaders(token));
  }
});
