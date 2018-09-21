/* @flow */
import { callApi, getHeaders, successResponseParser } from '../utils';
import type { UUID, Token, ListConfdUsersResponse, ConfdUser, ListApplicationsResponse } from '../types';

export default (baseUrl: string) => ({
  listUsers(token: Token): Promise<ListConfdUsersResponse> {
    return callApi(`${baseUrl}/users`, 'get', null, getHeaders(token));
  },

  getUser(token: Token, userUuid: string): Promise<ConfdUser> {
    return callApi(`${baseUrl}/users/${userUuid}`, 'get', null, getHeaders(token));
  },

  updateUser(token: Token, userUuid: string, { firstName, lastName, email, mobileNumber }: Object): Promise<Boolean> {
    const body = {
      firstname: firstName,
      lastname: lastName,
      email,
      mobile_phone_number: mobileNumber
    };

    return callApi(`${baseUrl}/users/${userUuid}`, 'put', body, getHeaders(token), successResponseParser);
  },

  updateForwardOption(
    token: Token,
    userUuid: string,
    key: string,
    destination: string,
    enabled: Boolean
  ): Promise<Boolean> {
    const url = `${baseUrl}/users/${userUuid}/forwards/${key}`;
    return callApi(url, 'put', { destination, enabled }, getHeaders(token), successResponseParser);
  },

  updateDoNotDisturb(token: Token, userUuid: UUID, enabled: Boolean): Promise<Boolean> {
    const url = `${baseUrl}/users/${userUuid}/services/dnd`;
    return callApi(url, 'put', { enabled }, getHeaders(token), successResponseParser);
  },

  // @TODO: type response
  getUserLineSip(token: Token, userUuid: string, lineId: string) {
    const url = `${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`;

    return callApi(url, 'get', null, getHeaders(token));
  },

  listApplications(token: Token): Promise<ListApplicationsResponse> {
    const url = `${baseUrl}/applications?recurse=true`;

    return callApi(url, 'get', null, getHeaders(token));
  },

  getSIP(token: Token, userUuid: UUID, lineId: number) {
    const url = `${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`;

    return callApi(url, 'get', null, getHeaders(token));
  }
});
