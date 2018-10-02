/* @flow */
import authMethods from './api/auth';
import applicationMethods from './api/application';
import confdMethods from './api/confd';
import accessdMethods from './api/accessd';
import ctidNgMethods from './api/ctid-ng';
import dirdMethods from './api/dird';
import callLogdMethods from './api/call-logd';

import ApiRequester from './utils/api-requester';

const AUTH_VERSION = '0.1';
const APPLICATION_VERSION = '1.0';
const CONFD_VERSION = '1.1';
const ACCESSD_VERSION = '1.0';
const CTIDNG_VERSION = '1.0';
const DIRD_VERSION = '0.1';
const CALL_LOGD_VERSION = '1.0';

/**
 * # Overview
 * Helps to use Wazo's rest APIs. Each API is namespaced with the name of it's service:
 * - `client.accessd`: actions related to use subscriptions: `listSubscriptions`, `listAuthorizations`, ...
 * - `client.application`: actions related to phone actions: `answerCall`, `hangupCall`, `addNewCallNodes` ...
 * - `client.auth`: actions specific to an user account, such as `login`, `checkToken`, `updatePassword`, ...
 * - `client.callLogd`: search and retrieve call logs: `search`, `listCallLogs`, ...
 * - `client.confd`: operation for managing users: `listUsers`, `updateUser`, `getSIP` ...
 * - `client.ctidNg`: allow to manage list events: `listMessages`, `listCalls`, `getPresence` ...
 * - `client.dird`:
 *
 * @name ApiClient
 * @param {Object} options
 * @param {String} options.server Wazo's server host (eg: `demo.wazo.community`).
 * @param {Object} options.agent [http(s).Agent](https://nodejs.org/api/https.html#https_class_https_agent) instance,
 * allows custom proxy, unsecured https, certificate etc.
 * @example
 * const client = new WazoApiClient({
 *   server: 'demo.wazo.community',
 *   agent: new https.Agent({ rejectUnauthorized: false }) // Allow unsecured https calls
 * });
 */
export default class ApiClient {
  client: ApiRequester;
  auth: Object;
  application: Object;
  confd: Object;
  accessd: Object;
  ctidNg: Object;
  dird: Object;
  callLogd: Object;

  _server: string;
  _agent: ?Object;

  // @see https://github.com/facebook/flow/issues/183#issuecomment-358607052
  constructor({ server, agent = null }: $Subtype<{ server: string, agent?: ?Object }>) {
    this._server = server;
    this._agent = agent;

    this._updateClient();
  }

  _updateClient() {
    this.client = new ApiRequester({ server: this._server, agent: this._agent });

    this._initializeEndpoints();
  }

  _initializeEndpoints(): void {
    this.auth = authMethods(this.client, `auth/${AUTH_VERSION}`);
    this.application = applicationMethods(this.client, `ctid-ng/${APPLICATION_VERSION}/applications`);
    this.confd = confdMethods(this.client, `confd/${CONFD_VERSION}`);
    this.accessd = accessdMethods(this.client, `accessd/${ACCESSD_VERSION}`);
    this.ctidNg = ctidNgMethods(this.client, `ctid-ng/${CTIDNG_VERSION}`);
    this.dird = dirdMethods(this.client, `dird/${DIRD_VERSION}`);
    this.callLogd = callLogdMethods(this.client, `call-logd/${CALL_LOGD_VERSION}`);
  }
}
