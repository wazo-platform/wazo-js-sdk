/* @flow */

import WazoApiClient from '../api-client';

const clients = {};
// Can't use node cache mechanism here because when requiring lib/CallApi.js
// this file will be merge with CallApi.js and the cache will be lost.
// So we have to tore values in global scope.

export const setApiClientId = (clientId: string) => {
  global.clientId = clientId;
};

export const setCurrentServer = (newServer: string) => {
  global.currentServer = newServer;
};

export const setApiToken = (newToken: string) => {
  global.token = newToken;
};

export const setRefreshToken = (newRefreshToken: string) => {
  global.refreshToken = newRefreshToken;
};

export const setOnRefreshToken = (onRefreshToken: Function) => {
  global.onRefreshToken = onRefreshToken;
};

export const setRefreshExpiration = (refreshExpiration: number) => {
  global.refreshExpiration = refreshExpiration;
};

export const setRefreshBackend = (refreshBackend: number) => {
  global.refreshBackend = refreshBackend;
};

const fillClient = client => {
  client.setToken(global.token);
  client.setRefreshToken(global.refreshToken);
  client.setClientId(global.clientId);
  client.onRefreshToken = global.onRefreshToken;
  client.setRefreshExpiration(global.refreshExpiration);
  client.setRefreshBackend(global.refreshBackend);

  return client;
};

export default (forServer: ?string): WazoApiClient => {
  const server: string = forServer || global.currentServer || '';
  if (server in clients) {
    return fillClient(clients[server]);
  }

  clients[server] = new WazoApiClient({ server });

  return fillClient(clients[server]);
};
