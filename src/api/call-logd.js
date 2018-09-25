/* @flow */
import ApiRequester from '../utils/api-requester';
import type { Token, DateString } from '../domain/types';
import CallLog from '../domain/CallLog';
import BadResponse from '../domain/BadResponse';

export default (client: ApiRequester, baseUrl: string) => ({
  search(token: Token, search: string, limit: number = 5): Promise<Array<CallLog> | BadResponse> {
    return client.get(`${baseUrl}/users/me/cdr`, { search, limit }, token)
      .then(ApiRequester.parseBadResponse(response => CallLog.parseMany(response)));
  },

  listCallLogs(token: Token, offset: number, limit: number = 5): Promise<Array<CallLog> | BadResponse> {
    return client.get(`${baseUrl}/users/me/cdr`, { offset, limit }, token)
      .then(ApiRequester.parseBadResponse(response => CallLog.parseMany(response)));
  },

  listCallLogsFromDate(token: Token, from: DateString, number: number): Promise<Array<CallLog> | BadResponse> {
    return client.get(`${baseUrl}/users/me/cdr`, { from, number }, token)
      .then(ApiRequester.parseBadResponse(response => CallLog.parseMany(response)));
  }
});
