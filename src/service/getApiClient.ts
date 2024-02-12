/* eslint-disable dot-notation */
import WazoApiClient from '../api-client';
import { FetchOptions } from '../domain/types';

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
global.wazoRequestApiTimeout = global.wazoRequestApiTimeout || {};
global.wazoFetchOptions = global.wazoFetchOptions || {};
export const setApiClientId = (clientId: string, forServer: string | null | undefined = null) => {
  global.wazoClientId[String(forServer)] = clientId;
};
export const setCurrentServer = (newServer: string) => {
  global.wazoCurrentServer = newServer;
};
export const setApiToken = (newToken: string | null | undefined, forServer: string | null | undefined = null) => {
  global.wazoClientToken[String(forServer)] = newToken;
};
export const setRefreshToken = (newRefreshToken: string | null | undefined, forServer: string | null | undefined = null) => {
  global.wazoRefreshToken[String(forServer)] = newRefreshToken;
};
export const setRefreshTenantId = (refreshTenantId: string | null | undefined, forServer: string | null | undefined = null) => {
  console.warn('Use of `setRefreshTenantId` is deprecated, please use `setRefreshDomainName` instead');
  global.wazoRefreshTenantId[String(forServer)] = refreshTenantId;
};
export const setRefreshDomainName = (refreshDomainName: string | null | undefined, forServer: string | null | undefined = null) => {
  global.wazoRefreshDomainName[String(forServer)] = refreshDomainName;
};
export const setOnRefreshToken = (onRefreshToken: (...args: Array<any>) => any, forServer: string | null | undefined = null) => {
  global.wazoOnRefreshToken[String(forServer)] = onRefreshToken;
};
export const setOnRefreshTokenError = (callback: (...args: Array<any>) => any, forServer: string | null | undefined = null) => {
  global.wazoOnRefreshTokenError[String(forServer)] = callback;
};
export const setRefreshExpiration = (refreshExpiration: number, forServer: string | null | undefined = null) => {
  global.wazoRefreshExpiration[String(forServer)] = refreshExpiration;
};
export const setRefreshBackend = (refreshBackend: number, forServer: string | null | undefined = null) => {
  global.wazoRefreshBackend[String(forServer)] = refreshBackend;
};
export const setIsMobile = (isMobile: boolean, forServer: string | null | undefined = null) => {
  global.wazoIsMobile[String(forServer)] = isMobile;
};
export const setRequestTimeout = (requestTimeout: number, forServer: string | null | undefined = null) => {
  global.wazoRequestApiTimeout[String(forServer)] = requestTimeout;
};
export const setFetchOptions = (fetchOptions: FetchOptions, forServer: string | null | undefined = null) => {
  global.wazoFetchOptions[String(forServer)] = fetchOptions;
};
export const getFetchOptions = (forServer: string | null | undefined = null): FetchOptions =>
  (forServer ? global.wazoFetchOptions[forServer] : global.wazoFetchOptions.null) || global.wazoFetchOptions.null;

const fillClient = (apiClient: WazoApiClient) => {
  const {
    server,
    token,
    clientId,
  } = apiClient.client;
  const tenantId = global.wazoRefreshTenantId[server] || global.wazoRefreshTenantId.null || apiClient.refreshTenantId;
  const requestTimeout = global.wazoRequestApiTimeout[server] || global.wazoRequestApiTimeout.null;
  //  try with null server when dealing with non-related server info
  apiClient.setToken(global.wazoClientToken[server] || global.wazoClientToken.null || token);
  apiClient.setClientId(global.wazoClientId[server] || global.wazoClientId.null || clientId);
  apiClient.setRefreshToken(global.wazoRefreshToken[server] || global.wazoRefreshToken.null || apiClient.refreshToken);

  if (tenantId) {
    apiClient.setRefreshTenantId(tenantId);
  }

  apiClient.setRefreshDomainName(global.wazoRefreshDomainName[server] || global.wazoRefreshDomainName.null || apiClient.refreshDomainName);
  apiClient.setFetchOptions(global.wazoFetchOptions[server] || global.wazoFetchOptions.null || apiClient.fetchOptions);
  apiClient.setOnRefreshToken(global.wazoOnRefreshToken[server] || global.wazoOnRefreshToken.null || apiClient.onRefreshToken);
  apiClient.setOnRefreshTokenError(global.wazoOnRefreshTokenError[server] || global.wazoOnRefreshTokenError.null || apiClient.onRefreshTokenError);
  apiClient.setRefreshExpiration(global.wazoRefreshExpiration[server] || global.wazoRefreshExpiration.null || apiClient.refreshExpiration);
  apiClient.setRefreshBackend(global.wazoRefreshBackend[server] || global.wazoRefreshBackend.null || apiClient.refreshBackend);
  apiClient.setIsMobile(global.wazoIsMobile[server] || global.wazoIsMobile.null || apiClient.isMobile);

  if (requestTimeout) {
    apiClient.setRequestTimeout(requestTimeout);
  }

  return apiClient;
};

export default ((forServer: string | null | undefined = null): WazoApiClient => {
  const server: string = forServer || global.wazoCurrentServer || '';

  if (server in global.wazoClients) {
    return fillClient(global.wazoClients[server]);
  }

  global.wazoClients[server] = new WazoApiClient({
    server,
  });
  return fillClient(global.wazoClients[server]);
});
