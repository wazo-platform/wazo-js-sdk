/* eslint-disable vars-on-top */
/* eslint-disable no-var */

import { type FetchOptions } from '../domain/types';

declare global {
  var Wazo;
  var wazoClients;
  var wazoClientId;
  var wazoClientToken;
  var wazoRefreshToken;
  var wazoRefreshTenantId;
  var wazoRefreshDomainName;
  var wazoOnRefreshToken;
  var wazoOnRefreshTokenError;
  var wazoRefreshExpiration;
  var wazoRefreshBackend;
  var wazoIsMobile;
  var wazoRequestApiTimeout;
  var wazoFetchOptions: Record<string, FetchOptions>;
  var wazoCurrentServer;
  var wazoAuthInstance;
  var wazoConfigurationInstance;
  var wazoDirectoryInstance;
  var wazoTelephonyInstance;
  var wazoWebsocketInstance;
}

export {};
