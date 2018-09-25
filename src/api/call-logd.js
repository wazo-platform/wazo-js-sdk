/* @flow */
import ApiRequester from '../utils/api-requester';
import type { Token, Contact, DateString } from '../types';

export default (client: ApiRequester, baseUrl: string) => ({
  search(token: Token, search: string, limit: number = 5): Promise<Array<Contact>> {
    return client.get(`${baseUrl}/users/me/cdr`, { search, limit }, token);
  },

  listCallLogs(token: Token, offset: number, limit: number = 5) {
    return client.get(`${baseUrl}/users/me/cdr`, { offset, limit }, token);
  },

  listCallLogsFromDate(token: Token, from: DateString, number: number) {
    return client.get(`${baseUrl}/users/me/cdr`, { from, number }, token);
  }
});
