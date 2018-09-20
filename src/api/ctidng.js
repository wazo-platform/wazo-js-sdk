/* @flow */
import { callApi, getHeaders } from '../utils';
import type { UUID } from '../types';

export default (baseUrl: string) => ({
  updatePresence(token: UUID, presence: string) {
    return callApi(`${baseUrl}/users/me/presences`, 'put', { presence }, getHeaders(token));
  }
});
