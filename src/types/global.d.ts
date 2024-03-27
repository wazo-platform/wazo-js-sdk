/* eslint-disable vars-on-top */
/* eslint-disable no-var */

import { WebsocketType } from '../domain/types';
import { Auth } from '../simple/Auth';
import { Configuration } from '../simple/Configuration';
import { Directory } from '../simple/Directory';
import { Phone } from '../simple/Phone';

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
  var wazoFetchOptions;
  var wazoCurrentServer;
  var wazoAuthInstance: Auth;
  var wazoConfigurationInstance: Configuration;
  var wazoDirectoryInstance: Directory;
  var wazoTelephonyInstance: Phone;
  var wazoWebsocketInstance: WebsocketType;
}

export {};
