/* @flow */
import type ApiClient from '../api-client'; // eslint-disable-line

// eslint-disable-next-line
export default (ApiClient: Class<ApiClient>, client: ApiClient) => ({
  answerCall(
    token: string,
    applicationUuid: string,
    callId: number,
    context: string,
    exten: string,
    autoanswer: string
  ) {
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

  calls(token: string, applicationUuid: string) {
    return ApiClient.callApi(
      `${client.applicationUrl}/${applicationUuid}/calls`,
      'get',
      null,
      ApiClient.getHeaders(token)
    );
  },

  hangupCall(token: string, applicationUuid: string, callId: number) {
    const url = `${client.applicationUrl}/${applicationUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  },

  nodes(token: string, applicationUuid: string) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },

  playCall(token: string, applicationUuid: string, callId: number, language: string, uri: string) {
    const url = `${client.applicationUrl}/${applicationUuid}/calls/${callId}/play`;

    return ApiClient.callApi(url, 'post', { language, uri }, ApiClient.getHeaders(token));
  },

  addCallNodes(token: string, applicationUuid: string, nodeUuid: string, callId: string): Promise<Object> {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'put', null, ApiClient.getHeaders(token));
  },

  addNewCallNodes(
    token: string,
    applicationUuid: string,
    nodeUuid: string,
    context: string,
    exten: string,
    autoanswer: string
  ) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`;
    const data = { context, exten, autoanswer };

    return ApiClient.callApi(url, 'post', data, ApiClient.getHeaders(token));
  },

  listCallsNodes(token: string, applicationUuid: string, nodeUuid: string) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },

  listNodes(token: string, applicationUuid: string) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },

  removeNode(token: string, applicationUuid: string, nodeUuid: string) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  },

  removeCallNodes(token: string, applicationUuid: string, nodeUuid: string, callId: string) {
    const url = `${client.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  }
});
