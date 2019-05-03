/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, Token, RequestError } from '../domain/types';
import ChatMessage from '../domain/ChatMessage';
import Voicemail from '../domain/Voicemail';
import Call from '../domain/Call';

type CallQuery = {
  from_mobile: boolean,
  extension: string,
  line_id?: number,
};

export default (client: ApiRequester, baseUrl: string) => ({
  updatePresence(token: Token, presence: string): Promise<Boolean> {
    return client.put(`${baseUrl}/users/me/presences`, { presence }, token, ApiRequester.successResponseParser);
  },

  listMessages(token: Token, participantUuid: ?UUID, limit?: number): Promise<Array<ChatMessage>> {
    const query: Object = {};

    if (participantUuid) {
      query.participant_user_uuid = participantUuid;
    }

    if (limit) {
      query.limit = limit;
    }

    return client.get(`${baseUrl}/users/me/chats`, query, token).then(response => ChatMessage.parseMany(response));
  },

  sendMessage(token: Token, alias: string, msg: string, toUserId: string) {
    const body = { alias, msg, to: toUserId };

    return client.post(`${baseUrl}/users/me/chats`, body, token, ApiRequester.successResponseParser);
  },

  makeCall(token: Token, extension: string, fromMobile: boolean, lineId: ?number) {
    const query: CallQuery = {
      from_mobile: fromMobile,
      extension,
    };

    if (lineId) {
      query.line_id = lineId;
    }
    return client.post(`${baseUrl}/users/me/calls`, query, token);
  },

  cancelCall(token: Token, callId: number): Promise<Boolean> {
    return client.delete(`${baseUrl}/users/me/calls/${callId}`, null, token);
  },

  listCalls(token: Token): Promise<Array<Call>> {
    return client.get(`${baseUrl}/users/me/calls`, null, token).then(response => Call.parseMany(response.items));
  },

  relocateCall(token: Token, callId: number, destination: string, lineId: ?number, contact?: ?string) {
    const body: Object = {
      completions: ['answer'],
      destination,
      initiator_call: callId,
    };

    if (lineId || contact) {
      body.location = {};
    }

    if (lineId) {
      body.location.line_id = lineId;
    }

    if (contact) {
      body.location.contact = contact;
    }

    return client.post(`${baseUrl}/users/me/relocates`, body, token);
  },

  listVoicemails(token: Token): Promise<RequestError | Array<Voicemail>> {
    return client.get(`${baseUrl}/users/me/voicemails`, null, token).then(response => Voicemail.parseMany(response));
  },

  deleteVoicemail(token: Token, voicemailId: number): Promise<Boolean> {
    return client.delete(`${baseUrl}/users/me/voicemails/messages/${voicemailId}`, null, token);
  },

  getPresence(token: Token, contactUuid: UUID): Promise<{ presence: string, user_uuid: string, xivo_uuid: string }> {
    return client.get(`${baseUrl}/users/${contactUuid}/presences`, null, token);
  },

  getStatus(token: Token, lineUuid: UUID) {
    return client.get(`${baseUrl}/lines/${lineUuid}/presences`, null, token);
  },

  fetchSwitchboardHeldCalls(token: Token, switchboardUuid: UUID) {
    return client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/held`, null, token);
  },

  holdSwitchboardCall(token: Token, switchboardUuid: UUID, callId: string) {
    return client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}`, null, token);
  },

  answerSwitchboardHeldCall(token: Token, switchboardUuid: UUID, callId: string) {
    return client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}/answer`, null, token);
  },

  fetchSwitchboardQueuedCalls(token: Token, switchboardUuid: UUID) {
    return client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued`, null, token);
  },

  answerSwitchboardQueuedCall(token: Token, switchboardUuid: UUID, callId: string) {
    return client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued/${callId}/answer`, null, token);
  },

  sendFax(token: Token, extension: string, fax: string, callerId: ?string = null) {
    const headers = {
      'Content-type': 'application/pdf',
      'X-Auth-Token': token
    };
    const params = ApiRequester.getQueryString({ extension, caller_id: callerId });

    return client.post(`${baseUrl}/users/me/faxes?${params}`, fax, headers);
  }
});
