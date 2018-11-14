/* @flow */
import ApiRequester from '../utils/api-requester';
import type { Token, ListNodesResponse, ListCallNodesResponse } from '../domain/types';

export default (client: ApiRequester, baseUrl: string) => ({
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

    return client.post(url, body, token).then(nodeUuid =>
      client.post(`${url}/${nodeUuid}/calls`, { context, exten, autoanswer }, token).then(data => ({
        nodeUuid,
        data
      }))
    );
  },

  calls(token: Token, applicationUuid: string) {
    return client.get(`${baseUrl}/${applicationUuid}/calls`, null, token);
  },

  hangupCall(token: Token, applicationUuid: string, callId: number) {
    const url = `${baseUrl}/${applicationUuid}/calls/${callId}`;

    return client.delete(url, null, token);
  },

  playCall(token: Token, applicationUuid: string, callId: number, language: string, uri: string) {
    return client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/play`, { language, uri }, token);
  },

  addCallNodes(token: Token, applicationUuid: string, nodeUuid: string, callId: string): Promise<Boolean> {
    return client.put(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, null, token);
  },

  addNewCallNodes(
    token: Token,
    applicationUuid: string,
    nodeUuid: string,
    context: string,
    exten: string,
    autoanswer: string
  ) {
    const data = { context, exten, autoanswer };

    return client.post(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`, data, token);
  },

  listCallsNodes(token: Token, applicationUuid: string, nodeUuid: string): Promise<ListCallNodesResponse> {
    return client.get(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`, null, token);
  },

  listNodes(token: Token, applicationUuid: string): Promise<ListNodesResponse> {
    return client.get(`${baseUrl}/${applicationUuid}/nodes`, null, token);
  },

  removeNode(token: Token, applicationUuid: string, nodeUuid: string) {
    return client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`, null, token);
  },

  removeCallNodes(token: Token, applicationUuid: string, nodeUuid: string, callId: string) {
    return client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, null, token);
  }
});
