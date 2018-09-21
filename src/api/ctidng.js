/* @flow */
import { callApi, getHeaders } from '../utils';
import type { UUID, Token } from '../types';

export default (baseUrl: string) => ({
  updatePresence(token: Token, presence: string) {
    return callApi(`${baseUrl}/users/me/presences`, 'put', { presence }, getHeaders(token));
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

  cancelCall(token: Token, callId: number) {
     return callApi(`${baseUrl}/users/me/calls/${callId}`, 'delete', null, getHeaders(token));
  },

  listActiveCalls(token: Token) {
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

  listVoiceMails(token: Token) {
    return callApi(`${baseUrl}/users/me/voicemails`, 'get', null, getHeaders(token));
  },

  deleteVoice(token: Token, voiceMailId: number) {
    return callApi(`${baseUrl}/users/me/voicemails/messages/${voiceMailId}`, 'delete', null, getHeaders(token));
  }
});
