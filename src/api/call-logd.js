/* @flow */
import ApiRequester from '../utils/api-requester';
import type { Token } from '../domain/types';
import CallLog from '../domain/CallLog';

export default (client: ApiRequester, baseUrl: string) => ({
  search(token: Token, search: string, limit: number = 5): Promise<Array<CallLog>> {
    return client
      .get(`${baseUrl}/users/me/cdr`, { search, limit }, token)
      .then(response => CallLog.parseMany(response));
  },

  listCallLogs(token: Token, offset: number, limit: number = 5): Promise<Array<CallLog>> {
    return client
      .get(`${baseUrl}/users/me/cdr`, { offset, limit }, token)
      .then(response => CallLog.parseMany(response));
  },

  listCallLogsFromDate(token: Token, from: Date, number: string): Promise<Array<CallLog>> {
    return client
      .get(`${baseUrl}/users/me/cdr`, { fromfrom: from.toISOString(), number }, token)
      .then(response => CallLog.parseMany(response));
  }
});
