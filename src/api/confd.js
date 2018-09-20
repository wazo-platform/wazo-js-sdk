/* @flow */
import type ApiClient from '../api-client'; // eslint-disable-line

// eslint-disable-next-line
export default (ApiClient: Class<ApiClient>, client: ApiClient) => ({
  listUsers(token: string) {
    return ApiClient.callApi(`${client.confdUrl}/users`, 'get', null, ApiClient.getHeaders(token));
  },

  getUser(token: string, userUuid: string) {
    return ApiClient.callApi(`${client.confdUrl}/users/${userUuid}`, 'get', null, ApiClient.getHeaders(token));
  },

  getUserLineSip(token: string, userUuid: string, lineId: string) {
    const url = `${client.confdUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },

  listApplications(token: string) {
    const url = `${client.confdUrl}/applications?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  }
});
