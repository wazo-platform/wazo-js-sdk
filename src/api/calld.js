/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, RequestError } from '../domain/types';
import type { ConferenceParticipants } from '../domain/Conference';
import Relocation from '../domain/Relocation';
import ChatMessage from '../domain/ChatMessage';
import Voicemail from '../domain/Voicemail';
import Call from '../domain/Call';

type CallQuery = {
  from_mobile: boolean,
  extension: string,
  line_id?: number,
};

export default (client: ApiRequester, baseUrl: string) => ({
  updatePresence: (presence: string): Promise<Boolean> =>
    client.put(`${baseUrl}/users/me/presences`, { presence }, null, ApiRequester.successResponseParser),

  listMessages: (participantUuid: ?UUID, limit?: number): Promise<Array<ChatMessage>> => {
    const query: Object = {};

    if (participantUuid) {
      query.participant_user_uuid = participantUuid;
    }

    if (limit) {
      query.limit = limit;
    }

    return client.get(`${baseUrl}/users/me/chats`, query).then(response => ChatMessage.parseMany(response));
  },

  sendMessage: (alias: string, msg: string, toUserId: string) => {
    const body = { alias, msg, to: toUserId };

    return client.post(`${baseUrl}/users/me/chats`, body, null, ApiRequester.successResponseParser);
  },

  makeCall: (extension: string, fromMobile: boolean, lineId: ?number) => {
    const query: CallQuery = {
      from_mobile: fromMobile,
      extension,
    };

    if (lineId) {
      query.line_id = lineId;
    }

    return client.post(`${baseUrl}/users/me/calls`, query);
  },

  cancelCall: (callId: number): Promise<Boolean> => client.delete(`${baseUrl}/users/me/calls/${callId}`, null),

  listCalls: (): Promise<Array<Call>> =>
    client.get(`${baseUrl}/users/me/calls`, null).then(response => Call.parseMany(response.items)),

  relocateCall(callId: number, destination: string, lineId: ?number, contact?: ?string): Promise<Relocation> {
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

    return client.post(`${baseUrl}/users/me/relocates`, body).then(response => Relocation.parse(response));
  },

  listVoicemails: (): Promise<RequestError | Array<Voicemail>> =>
    client.get(`${baseUrl}/users/me/voicemails`).then(response => Voicemail.parseMany(response)),

  deleteVoicemail: (voicemailId: number): Promise<Boolean> =>
    client.delete(`${baseUrl}/users/me/voicemails/messages/${voicemailId}`),

  fetchSwitchboardHeldCalls: (switchboardUuid: UUID) =>
    client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/held`),

  holdSwitchboardCall: (switchboardUuid: UUID, callId: string) =>
    client.put(
      `${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}`,
      null,
      null,
      ApiRequester.successResponseParser,
    ),

  answerSwitchboardHeldCall: (switchboardUuid: UUID, callId: string) =>
    client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}/answer`),

  fetchSwitchboardQueuedCalls: (switchboardUuid: UUID) =>
    client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued`),

  answerSwitchboardQueuedCall: (switchboardUuid: UUID, callId: string) =>
    client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued/${callId}/answer`),

  sendFax: (extension: string, fax: string, callerId: ?string = null) => {
    const headers = {
      'Content-type': 'application/pdf',
      'X-Auth-Token': client.token,
    };
    const params = ApiRequester.getQueryString({ extension, caller_id: callerId });

    return client.post(`${baseUrl}/users/me/faxes?${params}`, fax, headers);
  },

  getConferenceParticipantsAsUser: async (conferenceId: string): Promise<ConferenceParticipants> =>
    client.get(`${baseUrl}/users/me/conferences/${conferenceId}/participants`),
});
