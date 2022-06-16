/* eslint-disable dot-notation */
/* @flow */

import WazoApiClient from '../api-client';

// Can't use node cache mechanism here because when requiring lib/CallApi.js
// this file will be merge with CallApi.js and the cache will be lost.
// So we have to store values in global scope.
global.wazoClients = global.wazoClients || {};
global.wazoClientId = global.wazoClientId || {};
global.wazoClientToken = global.wazoClientToken || {};
global.wazoRefreshToken = global.wazoRefreshToken || {};
global.wazoRefreshTenantId = global.wazoRefreshTenantId || {};
global.wazoRefreshDomainName = global.wazoRefreshDomainName || {};
global.wazoOnRefreshToken = global.wazoOnRefreshToken || {};
global.wazoOnRefreshTokenError = global.wazoOnRefreshTokenError || {};
global.wazoRefreshExpiration = global.wazoRefreshExpiration || {};
global.wazoRefreshBackend = global.wazoRefreshBackend || {};
global.wazoIsMobile = global.wazoIsMobile || {};
global.wazoFetchOptions = global.wazoFetchOptions || {};

export const setApiClientId = (clientId: string, forServer: ?string = null) => {
  global.wazoClientId[forServer] = clientId;
};

export const setCurrentServer = (newServer: string) => {
  global.wazoCurrentServer = newServer;
};

export const setApiToken = (newToken: ?string, forServer: ?string = null) => {
  global.wazoClientToken[forServer] = newToken;
};

export const setRefreshToken = (newRefreshToken: ?string, forServer: ?string = null) => {
  global.wazoRefreshToken[forServer] = newRefreshToken;
};

export const setRefreshTenantId = (refreshTenantId: ?string, forServer: ?string = null) => {
  console.warn('Use of `setRefreshTenantId` is deprecated, please use `setRefreshDomainName` instead');
  global.wazoRefreshTenantId[forServer] = refreshTenantId;
};

export const setRefreshDomainName = (refreshDomainName: ?string, forServer: ?string = null) => {
  global.wazoRefreshDomainName[forServer] = refreshDomainName;
};

export const setOnRefreshToken = (onRefreshToken: Function, forServer: ?string = null) => {
  global.wazoOnRefreshToken[forServer] = onRefreshToken;
};

export const setOnRefreshTokenError = (callback: Function, forServer: ?string = null) => {
  global.wazoOnRefreshTokenError[forServer] = callback;
};

export const setRefreshExpiration = (refreshExpiration: number, forServer: ?string = null) => {
  global.wazoRefreshExpiration[forServer] = refreshExpiration;
};

export const setRefreshBackend = (refreshBackend: number, forServer: ?string = null) => {
  global.wazoRefreshBackend[forServer] = refreshBackend;
};

export const setIsMobile = (isMobile: boolean, forServer: ?string = null) => {
  global.wazoIsMobile[forServer] = isMobile;
};

export const setFetchOptions = (fetchOptions: Object, forServer: ?string = null) => {
  global.wazoFetchOptions[forServer] = fetchOptions;
};

const fillClient = (apiClient: WazoApiClient) => {
  const { server, token, clientId } = apiClient.client;
  const tenantId = global.wazoRefreshTenantId[server] || global.wazoRefreshTenantId[null] || apiClient.refreshTenantId;

  //  try with null server when dealing with non-related server info
  apiClient.setToken(global.wazoClientToken[server] || global.wazoClientToken[null] || token);

  apiClient.setClientId(global.wazoClientId[server] || global.wazoClientId[null] || clientId);

  apiClient.setRefreshToken(global.wazoRefreshToken[server] || global.wazoRefreshToken[null] || apiClient.refreshToken);

  if (tenantId) {
    apiClient.setRefreshTenantId(tenantId);
  }

  apiClient.setRefreshDomainName(
    global.wazoRefreshDomainName[server] || global.wazoRefreshDomainName[null] || apiClient.refreshDomainName,
  );

  apiClient.setFetchOptions(global.wazoFetchOptions[server] || global.wazoFetchOptions[null] || apiClient.fetchOptions);

  apiClient.setOnRefreshToken(
    global.wazoOnRefreshToken[server] || global.wazoOnRefreshToken[null] || apiClient.onRefreshToken,
  );

  apiClient.setOnRefreshTokenError(
    global.wazoOnRefreshTokenError[server] || global.wazoOnRefreshTokenError[null] || apiClient.onRefreshTokenError,
  );

  apiClient.setRefreshExpiration(
    global.wazoRefreshExpiration[server] || global.wazoRefreshExpiration[null] || apiClient.refreshExpiration,
  );

  apiClient.setRefreshBackend(
    global.wazoRefreshBackend[server] || global.wazoRefreshBackend[null] || apiClient.refreshBackend,
  );

  apiClient.setIsMobile(global.wazoIsMobile[server] || global.wazoIsMobile[null] || apiClient.isMobile);

  return apiClient;
};

export default (forServer: ?string = null): WazoApiClient => {
  const server: string = forServer || global.wazoCurrentServer || '';
  if (server in global.wazoClients) {
    return fillClient(global.wazoClients[server]);
  }

  global.wazoClients[server] = new WazoApiClient({ server });

  return fillClient(global.wazoClients[server]);
};
