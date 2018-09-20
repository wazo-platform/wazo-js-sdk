/* @flow */
import { callApi, getHeaders } from '../utils';
import type { ListNodesResponse, ListCallNodesResponse } from '../types';

export default (baseUrl: string) => ({
  answerCall(
    token: string,
    applicationUuid: string,
    callId: number,
    context: string,
    exten: string,
    autoanswer: string
  ) {
    const url = `${baseUrl}/${applicationUuid}/nodes`;
    const body = { calls: [{ id: callId }] };
    const headers = getHeaders(token);

    return callApi(url, 'post', body, headers, res => res.data.uuid).then(nodeUuid =>
      callApi(`${url}/${nodeUuid}/calls`, 'post', { context, exten, autoanswer }, headers).then(data => ({
        nodeUuid,
        data
      }))
    );
  },

  calls(token: string, applicationUuid: string) {
    return callApi(`${baseUrl}/${applicationUuid}/calls`, 'get', null, getHeaders(token));
  },

  hangupCall(token: string, applicationUuid: string, callId: number) {
    return callApi(`${baseUrl}/${applicationUuid}/calls/${callId}`, 'delete', null, getHeaders(token));
  },

  playCall(token: string, applicationUuid: string, callId: number, language: string, uri: string) {
    return callApi(`${baseUrl}/${applicationUuid}/calls/${callId}/play`, 'post', { language, uri }, getHeaders(token));
  },

  addCallNodes(token: string, applicationUuid: string, nodeUuid: string, callId: string): Promise<Object> {
    return callApi(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, 'put', null, getHeaders(token));
  },

  addNewCallNodes(
    token: string,
    applicationUuid: string,
    nodeUuid: string,
    context: string,
    exten: string,
    autoanswer: string
  ) {
    const data = { context, exten, autoanswer };

    return callApi(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`, 'post', data, getHeaders(token));
  },

  listCallsNodes(token: string, applicationUuid: string, nodeUuid: string): Promise<ListCallNodesResponse> {
    return callApi(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`, 'get', null, getHeaders(token));
  },

  listNodes(token: string, applicationUuid: string): Promise<ListNodesResponse> {
    return callApi(`${baseUrl}/${applicationUuid}/nodes`, 'get', null, getHeaders(token));
  },

  removeNode(token: string, applicationUuid: string, nodeUuid: string) {
    return callApi(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`, 'delete', null, getHeaders(token));
  },

  removeCallNodes(token: string, applicationUuid: string, nodeUuid: string, callId: string) {
    const url = `${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`;

    return callApi(url, 'delete', null, getHeaders(token));
  }
});
