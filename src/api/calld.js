/* @flow */
import ApiRequester from '../utils/api-requester';
import type { Token } from '../domain/types';

export type ConferenceParticipant = {
  admin: boolean,
  call_id: string,
  caller_id_name: string,
  caller_id_number: string,
  id: string,
  join_time: number,
  language: string,
  muted: boolean,
  user_uuid: string,
};

type ConferenceParticipants = {
  items: Array<ConferenceParticipant>,
  total: number,
};
export default (client: ApiRequester, baseUrl: string) => ({
  getConferenceParticipantsAsUser: async (token: Token, conferenceId: string): Promise<ConferenceParticipants> =>
    client.get(`${baseUrl}/users/me/conferences/${conferenceId}/participants`, null, token),
});
