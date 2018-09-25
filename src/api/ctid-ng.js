/* @flow */
import { callApi, getHeaders, successResponseParser } from '../utils';
import type { UUID, Token, RequestError, Voicemail } from '../types';

export default (baseUrl: string) => ({
  updatePresence(token: Token, presence: string): Promise<Boolean> {
    return callApi(`${baseUrl}/users/me/presences`, 'put', { presence }, getHeaders(token), successResponseParser);
  },

  listMessages(token: Token, participantUuid: ?UUID) {
    const body = participantUuid ? { participant_user_uuid: participantUuid } : null;

    return callApi(`${baseUrl}/users/me/chats`, 'get', body, getHeaders(token));
  },

  sendMessage(token: Token, alias: string, message: string, toUserId: string) {
    const body = { alias, message, to: toUserId };

    return callApi(`${baseUrl}/users/me/chats`, 'post', body, getHeaders(token));
  },

  makeCall(token: Token, extension: string) {
    return callApi(`${baseUrl}/users/me/calls`, 'post', { from_mobile: true, extension }, getHeaders(token));
  },

  cancelCall(token: Token, callId: number): Promise<Boolean> {
    return callApi(`${baseUrl}/users/me/calls/${callId}`, 'delete', null, getHeaders(token));
  },

  listCalls(token: Token) {
    return callApi(`${baseUrl}/users/me/calls`, 'get', null, getHeaders(token));
  },

  relocateCall(token: Token, callId: number, destination: string, lineId: ?number) {
    const body: Object = {
      completions: ['answer'],
      destination,
      initiator_call: callId
    };

    if (lineId) {
      body.location = { line_id: lineId };
    }

    return callApi(`${baseUrl}/users/me/relocates`, 'post', body, getHeaders(token));
  },

  listVoicemails(token: Token): Promise<RequestError | Array<Voicemail>> {
    return callApi(`${baseUrl}/users/me/voicemails`, 'get', null, getHeaders(token));
  },

  deleteVoicemail(token: Token, voicemailId: number): Promise<Boolean> {
    const url = `${baseUrl}/users/me/voicemails/messages/${voicemailId}`;

    return callApi(url, 'delete', null, getHeaders(token));
  },

  getPresence(token: Token, contactUuid: UUID) {
    return callApi(`${baseUrl}/users/${contactUuid}/presences`, 'get', null, getHeaders(token));
  },

  getStatus(token: Token, lineUuid: UUID) {
    return callApi(`${baseUrl}/lines/${lineUuid}/presences`, 'get', null, getHeaders(token));
  }
});
