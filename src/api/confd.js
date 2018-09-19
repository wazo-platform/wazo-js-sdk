export default (ApiClient, client) => ({
  listUsers(token) {
    return ApiClient.callApi(`${client.confdUrl}/users`, 'get', null, ApiClient.getHeaders(token));
  },

  getUser(token, userUuid) {
    return ApiClient.callApi(`${client.confdUrl}/users/${userUuid}`, 'get', null, ApiClient.getHeaders(token));
  },

  getUserLineSip(token, userUuid, lineId) {
    const url = `${client.confdUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },

  listApplications(token) {
    const url = `${client.confdUrl}/applications?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  }
});
