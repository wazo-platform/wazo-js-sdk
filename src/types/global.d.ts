/* eslint-disable vars-on-top */
/* eslint-disable no-var */

import Auth from '../simple/Auth';
import Configuration from '../simple/Configuration';
import Directory from '../simple/Directory';
import Phone from '../simple/Phone';
import Websocket from '../simple/Websocket';
import * as WebSocketClient from '../websocket-client';

const {
  SOCKET_EVENTS,
  ...OTHER_EVENTS
} = WebSocketClient;

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
  var wazoAuthInstance: typeof Auth;
  var wazoConfigurationInstance: typeof Configuration;
  var wazoDirectoryInstance: typeof Directory;
  var wazoTelephonyInstance: typeof Phone;
  var wazoWebsocketInstance: typeof Websocket & typeof SOCKET_EVENTS & typeof OTHER_EVENTS;
}

export {};
