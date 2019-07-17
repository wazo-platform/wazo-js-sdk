/* @flow */
import ApiRequester from '../utils/api-requester';
import type { Token } from '../domain/types';
import type { ConferenceParticipants } from '../domain/Conference';

export default (client: ApiRequester, baseUrl: string) => ({
  getConferenceParticipantsAsUser: async (token: Token, conferenceId: string): Promise<ConferenceParticipants> =>
    client.get(`${baseUrl}/users/me/conferences/${conferenceId}/participants`, null, token),
});
