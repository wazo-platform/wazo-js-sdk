/* @flow */
import { callApi, getHeaders } from '../utils';
import type { Token, Contact, DateString } from '../types';

export default (baseUrl: string) => ({
  search(token: Token, search: string, limit: number = 5): Promise<Array<Contact>> {
    return callApi(`${baseUrl}/users/me/cdr`, 'get', { search, limit }, getHeaders(token));
  },

  listCallLogs(token: Token, offset: number, limit: number = 5) {
    return callApi(`${baseUrl}/users/me/cdr`, 'get', { offset, limit }, getHeaders(token));
  },

  listCallLogsFromDate(token: Token, from: DateString, number: number) {
    return callApi(`${baseUrl}/users/me/cdr`, 'get', { from, number }, getHeaders(token));
  }
});
