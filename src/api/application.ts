/* eslint-disable camelcase */
import ApiRequester from '../utils/api-requester';
import type { ListNodesResponse, ListCallNodesResponse } from '../domain/types';

export interface ApplicationD {
  bridgeCall: (applicationUuid: string, callId: number, context: string, exten: string, autoanswer: string, displayed_caller_id_number: string | null | undefined) => Promise<boolean>;
  answerCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  calls: (applicationUuid: string) => Promise<boolean>;
  hangupCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  startPlaybackCall: (applicationUuid: string, callId: number, language: string, uri: string) => Promise<boolean>;
  stopPlaybackCall: (applicationUuid: string, playbackUuid: string) => Promise<boolean>;
  startProgressCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  stopProgressCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  startMohCall: (applicationUuid: string, callId: number, mohUuid: string) => Promise<boolean>;
  stopMohCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  startHoldCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  stopHoldCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  startMuteCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  stopMuteCall: (applicationUuid: string, callId: number) => Promise<boolean>;
  sendDTMFCall: (applicationUuid: string, callId: number, digits: number) => Promise<boolean>;
  addCallNodes: (applicationUuid: string, nodeUuid: string, callId: string) => Promise<boolean>;
  createNewNodeWithCall: (applicationUuid: string, calls: Array<Record<string, any>>) => Promise<boolean>;
  addNewCallNodes: (applicationUuid: string, nodeUuid: string, context: string, exten: string, autoanswer: string) => Promise<boolean>;
  listCallsNodes: (applicationUuid: string, nodeUuid: string) => Promise<ListCallNodesResponse>;
  listNodes: (applicationUuid: string) => Promise<ListNodesResponse>;
  removeNode: (applicationUuid: string, nodeUuid: string) => Promise<boolean>;
  removeCallNodes: (applicationUuid: string, nodeUuid: string, callId: string) => Promise<boolean>;
  listSnoop: (applicationUuid: string) => Promise<ListNodesResponse>;
  removeSnoop: (applicationUuid: string, snoopUuid: string) => Promise<boolean>;
  viewSnoop: (applicationUuid: string, snoopUuid: string) => Promise<ListNodesResponse>;
  createSnoop: (applicationUuid: string, callId: number, snoopingCallId: number, whisperMode: string) => Promise<boolean>;
  updateSnoop: (applicationUuid: string, snoopUuid: string, whisperMode: string) => Promise<boolean>;
}

export default ((client: ApiRequester, baseUrl: string): ApplicationD => ({
  bridgeCall(applicationUuid: string, callId: number, context: string, exten: string, autoanswer: string, displayed_caller_id_number: string | null | undefined) {
    const url = `${baseUrl}/${applicationUuid}/nodes`;
    const body = {
      calls: [{
        id: callId,
      }],
    };
    return client.post(url, body, null, (res: Record<string, any>) => res.json().then((response: Record<string, any>) => response.uuid)).then((nodeUuid: string) => client.post(`${url}/${nodeUuid}/calls`, {
      context,
      exten,
      autoanswer,
      displayed_caller_id_number,
    }).then((data: any) => ({
      nodeUuid,
      data,
    })));
  },

  answerCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/answer`, {}, null, ApiRequester.successResponseParser),
  calls: (applicationUuid: string) => client.get(`${baseUrl}/${applicationUuid}/calls`),
  hangupCall: (applicationUuid: string, callId: number) => client.delete(`${baseUrl}/${applicationUuid}/calls/${callId}`),
  startPlaybackCall: (applicationUuid: string, callId: number, language: string, uri: string) => client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/playbacks`, {
    language,
    uri,
  }),
  stopPlaybackCall: (applicationUuid: string, playbackUuid: string) => client.delete(`${baseUrl}/${applicationUuid}/playbacks/${playbackUuid}`),
  startProgressCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/progress/start`, {}, null, ApiRequester.successResponseParser),
  stopProgressCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/progress/stop`, {}, null, ApiRequester.successResponseParser),
  startMohCall: (applicationUuid: string, callId: number, mohUuid: string) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/moh/${mohUuid}/start`, {}, null, ApiRequester.successResponseParser),
  stopMohCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/moh/stop`, {}, null, ApiRequester.successResponseParser),
  startHoldCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/hold/start`, {}, null, ApiRequester.successResponseParser),
  stopHoldCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/hold/stop`, {}, null, ApiRequester.successResponseParser),
  startMuteCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/mute/start`, {}, null, ApiRequester.successResponseParser),
  stopMuteCall: (applicationUuid: string, callId: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/mute/stop`, {}, null, ApiRequester.successResponseParser),
  sendDTMFCall: (applicationUuid: string, callId: number, digits: number) => client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/dtmf`, {
    digits,
  }, null, ApiRequester.successResponseParser),
  addCallNodes: (applicationUuid: string, nodeUuid: string, callId: string): Promise<boolean> => client.put(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, {}, null, ApiRequester.successResponseParser),
  createNewNodeWithCall: (applicationUuid: string, calls: Array<Record<string, any>>) => client.post(`${baseUrl}/${applicationUuid}/nodes`, {
    calls,
  }),
  addNewCallNodes: (applicationUuid: string, nodeUuid: string, context: string, exten: string, autoanswer: string) => client.post(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`, {
    context,
    exten,
    autoanswer,
  }),
  listCallsNodes: (applicationUuid: string, nodeUuid: string): Promise<ListCallNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),
  listNodes: (applicationUuid: string): Promise<ListNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/nodes`),
  removeNode: (applicationUuid: string, nodeUuid: string) => client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),
  removeCallNodes: (applicationUuid: string, nodeUuid: string, callId: string) => client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`),
  listSnoop: (applicationUuid: string): Promise<ListNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/snoops`),
  removeSnoop: (applicationUuid: string, snoopUuid: string) => client.delete(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`),
  viewSnoop: (applicationUuid: string, snoopUuid: string): Promise<ListNodesResponse> => client.get(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`),
  createSnoop: (applicationUuid: string, callId: number, snoopingCallId: number, whisperMode: string) => client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/snoops`, {
    snooping_call_id: snoopingCallId,
    whisper_mode: whisperMode,
  }),
  updateSnoop: (applicationUuid: string, snoopUuid: string, whisperMode: string) => client.put(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`, {
    whisper_mode: whisperMode,
  }, null, ApiRequester.successResponseParser),
}));
