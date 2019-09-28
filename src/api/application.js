/* @flow */
/* eslint-disable camelcase */
import ApiRequester from '../utils/api-requester';
import type { ListNodesResponse, ListCallNodesResponse } from '../domain/types';

export default (client: ApiRequester, baseUrl: string) => ({
  answerCall(
    applicationUuid: string,
    callId: number,
    context: string,
    exten: string,
    autoanswer: string,
    displayed_caller_id_number: ?string,
  ) {
    const url = `${baseUrl}/${applicationUuid}/nodes`;
    const body = { calls: [{ id: callId }] };

    return client
      .post(url, body, null, res => res.json().then(response => response.uuid))
      .then(nodeUuid =>
        client
          .post(`${url}/${nodeUuid}/calls`, { context, exten, autoanswer, displayed_caller_id_number })
          .then(data => ({
            nodeUuid,
            data,
          })));
  },

  calls: (applicationUuid: string) => client.get(`${baseUrl}/${applicationUuid}/calls`),

  hangupCall: (applicationUuid: string, callId: number) =>
    client.delete(`${baseUrl}/${applicationUuid}/calls/${callId}`),

  playCall: (applicationUuid: string, callId: number, language: string, uri: string) =>
    client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/playbacks`, { language, uri }),

  addCallNodes: (applicationUuid: string, nodeUuid: string, callId: string): Promise<Boolean> =>
    client.put(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`),

  addNewCallNodes: (applicationUuid: string, nodeUuid: string, context: string, exten: string, autoanswer: string) =>
    client.post(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`, { context, exten, autoanswer }),

  listCallsNodes: (applicationUuid: string, nodeUuid: string): Promise<ListCallNodesResponse> =>
    client.get(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),

  listNodes: (applicationUuid: string): Promise<ListNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/nodes`),

  removeNode: (applicationUuid: string, nodeUuid: string) =>
    client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),

  removeCallNodes: (applicationUuid: string, nodeUuid: string, callId: string) =>
    client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`),
});
