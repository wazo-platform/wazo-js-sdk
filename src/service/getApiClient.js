/* @flow */

import WazoApiClient from '../api-client';

global.wazoClients = {};

// Can't use node cache mechanism here because when requiring lib/CallApi.js
// this file will be merge with CallApi.js and the cache will be lost.
// So we have to tore values in global scope.
global.wazoClientId = {};
global.wazoClientToken = {};
global.wazoRefreshToken = {};
global.wazoOnRefreshToken = {};
global.wazoRefreshExpiration = {};
global.wazoRefreshBackend = {};

export const setApiClientId = (clientId: string, forServer: ?string = null) => {
  global.wazoClientId[forServer] = clientId;
};

export const setCurrentServer = (newServer: string) => {
  global.wazoCurrentServer = newServer;
};

export const setApiToken = (newToken: string, forServer: ?string = null) => {
  global.wazoClientToken[forServer] = newToken;
};

export const setRefreshToken = (newRefreshToken: string, forServer: ?string = null) => {
  global.wazoRefreshToken[forServer] = newRefreshToken;
};

export const setOnRefreshToken = (onRefreshToken: Function, forServer: ?string = null) => {
  global.wazoOnRefreshToken[forServer] = onRefreshToken;
};

export const setRefreshExpiration = (refreshExpiration: number, forServer: ?string = null) => {
  global.wazoRefreshExpiration[forServer] = refreshExpiration;
};

export const setRefreshBackend = (refreshBackend: number, forServer: ?string = null) => {
  global.wazoRefreshBackend[forServer] = refreshBackend;
};

const fillClient = (apiClient: WazoApiClient) => {
  const { server, token, clientId } = apiClient.client;

  if (!token) {
    apiClient.setToken(global.wazoClientToken[server]);
  }
  if (!clientId) {
    apiClient.setClientId(global.wazoClientId[server]);
  }
  if (!apiClient.refreshToken) {
    apiClient.setRefreshToken(global.wazoRefreshToken[server]);
  }
  if (!apiClient.onRefreshToken) {
    apiClient.setOnRefreshToken(global.wazoOnRefreshToken[server]);
  }
  if (!apiClient.refreshExpiration) {
    apiClient.setRefreshExpiration(global.wazoRefreshExpiration[server]);
  }
  if (!apiClient.refreshBackend) {
    apiClient.setRefreshBackend(global.wazoRefreshBackend[server]);
  }

  return apiClient;
};

export default (forServer: ?string): WazoApiClient => {
  const server: string = forServer || global.wazoCurrentServer || '';
  if (server in global.wazoClients) {
    return fillClient(global.wazoClients[server]);
  }

  global.wazoClients[server] = new WazoApiClient({ server });

  return fillClient(global.wazoClients[server]);
};


