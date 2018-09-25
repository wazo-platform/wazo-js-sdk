/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, Token, ListConfdUsersResponse, ConfdUser, ListApplicationsResponse } from '../types';

export default (client: ApiRequester, baseUrl: string) => ({
  listUsers(token: Token): Promise<ListConfdUsersResponse> {
    return client.get(`${baseUrl}/users`, null, token);
  },

  getUser(token: Token, userUuid: string): Promise<ConfdUser> {
    return client.get(`${baseUrl}/users/${userUuid}`, null, token);
  },

  updateUser(token: Token, userUuid: string, { firstName, lastName, email, mobileNumber }: Object): Promise<Boolean> {
    const body = {
      firstname: firstName,
      lastname: lastName,
      email,
      mobile_phone_number: mobileNumber
    };

    return client.put(`${baseUrl}/users/${userUuid}`, body, token, ApiRequester.successResponseParser);
  },

  updateForwardOption(
    token: Token,
    userUuid: string,
    key: string,
    destination: string,
    enabled: Boolean
  ): Promise<Boolean> {
    const url = `${baseUrl}/users/${userUuid}/forwards/${key}`;
    return client.put(url, { destination, enabled }, token, ApiRequester.successResponseParser);
  },

  updateDoNotDisturb(token: Token, userUuid: UUID, enabled: Boolean): Promise<Boolean> {
    const url = `${baseUrl}/users/${userUuid}/services/dnd`;

    return client.put(url, { enabled }, token, ApiRequester.successResponseParser);
  },

  // @TODO: type response
  getUserLineSip(token: Token, userUuid: string, lineId: string) {
    return client.put(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`, null, token);
  },

  listApplications(token: Token): Promise<ListApplicationsResponse> {
    const url = `${baseUrl}/applications?recurse=true`;

    return client.get(url, null, token);
  },

  getSIP(token: Token, userUuid: UUID, lineId: number) {
    return client.get(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`, null, token);
  }
});
