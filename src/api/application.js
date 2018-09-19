export default (ApiClient, client) => ({
  answerCall(token, applicationUuid, callId, context, exten, autoanswer) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes`;
    const body = { calls: [{ id: callId }] };
    const headers = ApiClient.getHeaders(token);

    return ApiClient.callApi(url, 'post', body, headers, res => res.data.uuid).then(nodeUuid =>
      ApiClient.callApi(`${url}/${nodeUuid}/calls`, 'post', { context, exten, autoanswer }, headers).then(data => ({
        nodeUuid,
        data
      }))
    );
  },

  calls(token, applicationUuid) {
    return ApiClient.callApi(
      `${client.applicationUrl}/${applicationUuid}/calls`,
      'get',
      null,
      ApiClient.getHeaders(token)
    );
  },

  hangupCall(token, applicationUuid, callId) {
    const url = `${client.applicationUrl}/${applicationUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  },

  nodes(token, applicationUuid) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getTokenHeaders(token));
  },

  playCall(token, applicationUuid, callId, language, uri) {
    const url = `${client.applicationUrl}/${applicationUuid}/calls/${callId}/play`;

    return ApiClient.callApi(url, 'post', { language, uri }, ApiClient.getHeaders(token));
  },

  addCallNodes(token, applicationUuid, nodeUuid, callId) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'put', null, ApiClient.getHeaders(token));
  },

  addNewCallNodes(token, applicationUuid, nodeUuid, context, exten, autoanswer) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`;
    const data = { context, exten, autoanswer };

    return ApiClient.callApi(url, 'post', data, ApiClient.getHeaders(token));
  },

  listCallsNodes(token, applicationUuid, nodeUuid) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },

  listNodes(token, applicationUuid) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },

  removeNode(token, applicationUuid, nodeUuid) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  },

  removeCallNodes(token, applicationUuid, nodeUuid, callId) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  }
});
