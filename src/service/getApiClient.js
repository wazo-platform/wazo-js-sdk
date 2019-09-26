/* @flow */

import WazoApiClient from '../api-client';

const clients = {};
let token = null;
let refreshToken = null;

export const setToken = (newToken: string) => {
  token = newToken;

  Object.keys(clients).forEach(server => {
    clients[server].setToken(token);
  });
};

export const setRefreshToken = (newRefreshToken: string) => {
  refreshToken = newRefreshToken;

  Object.keys(clients).forEach(server => {
    clients[server].setRefreshToken(refreshToken);
  });
};

export default (server: string): WazoApiClient => {
  if (server in clients) {
    return clients[server];
  }

  clients[server] = new WazoApiClient({ server, refreshToken });

  return clients[server];
};
