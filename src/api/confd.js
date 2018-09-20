/* @flow */
import { callApi, getHeaders } from '../utils';
import type { ListConfdUsersResponse, ConfdUser, ListApplicationsResponse } from '../types';

export default (baseUrl: string) => ({
  listUsers(token: string): Promise<ListConfdUsersResponse> {
    return callApi(`${baseUrl}/users`, 'get', null, getHeaders(token));
  },

  getUser(token: string, userUuid: string): Promise<ConfdUser> {
    return callApi(`${baseUrl}/users/${userUuid}`, 'get', null, getHeaders(token));
  },

  // @TODO: type response
  getUserLineSip(token: string, userUuid: string, lineId: string) {
    const url = `${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`;

    return callApi(url, 'get', null, getHeaders(token));
  },

  listApplications(token: string): Promise<ListApplicationsResponse> {
    const url = `${baseUrl}/applications?recurse=true`;

    return callApi(url, 'get', null, getHeaders(token));
  }
});
