/* @flow */
/* eslint-disable camelcase */
import ApiRequester from '../utils/api-requester';
import type { ListNodesResponse, ListCallNodesResponse } from '../domain/types';

export default (client: ApiRequester, baseUrl: string) => ({
  bridgeCall(
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

  answerCall: (applicationUuid: string, callId: number) =>
    client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/answer`, {}, null, ApiRequester.successResponseParser),

  calls: (applicationUuid: string) => client.get(`${baseUrl}/${applicationUuid}/calls`),

  hangupCall: (applicationUuid: string, callId: number) =>
    client.delete(`${baseUrl}/${applicationUuid}/calls/${callId}`),

  startPlaybackCall: (applicationUuid: string, callId: number, language: string, uri: string) =>
    client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/playbacks`, { language, uri }),

  stopPlaybackCall: (applicationUuid: string, playbackUuid: string) =>
    client.delete(`${baseUrl}/${applicationUuid}/playbacks/${playbackUuid}`),

  startProgressCall: (applicationUuid: string, callId: number) =>
    client.put(
      `${baseUrl}/${applicationUuid}/calls/${callId}/progress/start`,
      {},
      null,
      ApiRequester.successResponseParser,
    ),

  stopProgressCall: (applicationUuid: string, callId: number) =>
    client.put(
      `${baseUrl}/${applicationUuid}/calls/${callId}/progress/stop`,
      {},
      null,
      ApiRequester.successResponseParser,
    ),

  startMohCall: (applicationUuid: string, callId: number, mohUuid: string) =>
    client.put(
      `${baseUrl}/${applicationUuid}/calls/${callId}/moh/${mohUuid}/start`,
      {},
      null,
      ApiRequester.successResponseParser,
    ),

  stopMohCall: (applicationUuid: string, callId: number) =>
    client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/moh/stop`, {}, null, ApiRequester.successResponseParser),

  startHoldCall: (applicationUuid: string, callId: number) =>
    client.put(
      `${baseUrl}/${applicationUuid}/calls/${callId}/hold/start`,
      {},
      null,
      ApiRequester.successResponseParser,
    ),

  stopHoldCall: (applicationUuid: string, callId: number) =>
    client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/hold/stop`, {}, null, ApiRequester.successResponseParser),

  startMuteCall: (applicationUuid: string, callId: number) =>
    client.put(
      `${baseUrl}/${applicationUuid}/calls/${callId}/mute/start`,
      {},
      null,
      ApiRequester.successResponseParser,
    ),

  stopMuteCall: (applicationUuid: string, callId: number) =>
    client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/mute/stop`, {}, null, ApiRequester.successResponseParser),

  addCallNodes: (applicationUuid: string, nodeUuid: string, callId: string): Promise<Boolean> =>
    client.put(
      `${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`,
      {},
      null,
      ApiRequester.successResponseParser,
    ),

  createNewNodeWithCall: (applicationUuid: string, calls: Array<Object>) =>
    client.post(`${baseUrl}/${applicationUuid}/nodes`, { calls }),

  addNewCallNodes: (applicationUuid: string, nodeUuid: string, context: string, exten: string, autoanswer: string) =>
    client.post(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`, { context, exten, autoanswer }),

  listCallsNodes: (applicationUuid: string, nodeUuid: string): Promise<ListCallNodesResponse> =>
    client.get(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),

  listNodes: (applicationUuid: string): Promise<ListNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/nodes`),

  removeNode: (applicationUuid: string, nodeUuid: string) =>
    client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),

  removeCallNodes: (applicationUuid: string, nodeUuid: string, callId: string) =>
    client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`),

  listSnoop: (applicationUuid: string): Promise<ListNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/snoops`),

  removeSnoop: (applicationUuid: string, snoopUuid: string) =>
    client.delete(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`),

  viewSnoop: (applicationUuid: string, snoopUuid: string): Promise<ListNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`),

  createSnoop: (applicationUuid: string, callId: number, snoopingCallId: number, whisperMode: string) =>
    client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/snoops`, { snoopingCallId, whisperMode }),

  updateSnoop: (applicationUuid: string, snoopUuid: string, whisperMode: string) =>
    client.put(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`, { whisperMode }, null, ApiRequester.successResponseParser),
});
