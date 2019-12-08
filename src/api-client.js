/* @flow */
import authMethods from './api/auth';
import applicationMethods from './api/application';
import confdMethods from './api/confd';
import accessdMethods from './api/accessd';
import ctidNgMethods from './api/ctid-ng';
import dirdMethods from './api/dird';
import callLogdMethods from './api/call-logd';
import chatdMethods from './api/chatd';
import calldMethods from './api/calld';

import ApiRequester from './utils/api-requester';

type ConstructorParams = {
  server: string,
  agent?: ?Object,
  clientId?: string,
  refreshToken?: ?string,
};

const AUTH_VERSION = '0.1';
const APPLICATION_VERSION = '1.0';
const CONFD_VERSION = '1.1';
const ACCESSD_VERSION = '1.0';
const CTIDNG_VERSION = '1.0';
const DIRD_VERSION = '0.1';
const CALL_LOGD_VERSION = '1.0';
const CHATD_VERSION = '1.0';
const CALLD_VERSION = '1.0';

export default class ApiClient {
  client: ApiRequester;
  auth: Object;
  application: Object;
  confd: Object;
  accessd: Object;
  ctidNg: Object;
  dird: Object;
  callLogd: Object;
  chatd: Object;
  calld: Object;

  refreshToken: ?string;
  onRefreshToken: ?Function;
  refreshExpiration: ?number;
  refreshBackend: ?string;

  // @see https://github.com/facebook/flow/issues/183#issuecomment-358607052
  constructor({ server, agent = null, refreshToken, clientId }: ConstructorParams) {
    this.updateParameters({ server, agent, clientId });
    this.refreshToken = refreshToken;
  }

  initializeEndpoints(): void {
    this.auth = authMethods(this.client, `auth/${AUTH_VERSION}`);
    this.application = applicationMethods(this.client, `ctid-ng/${APPLICATION_VERSION}/applications`);
    this.confd = confdMethods(this.client, `confd/${CONFD_VERSION}`);
    this.accessd = accessdMethods(this.client, `accessd/${ACCESSD_VERSION}`);
    this.ctidNg = ctidNgMethods(this.client, `ctid-ng/${CTIDNG_VERSION}`);
    this.dird = dirdMethods(this.client, `dird/${DIRD_VERSION}`);
    this.callLogd = callLogdMethods(this.client, `call-logd/${CALL_LOGD_VERSION}`);
    this.chatd = chatdMethods(this.client, `chatd/${CHATD_VERSION}`);
    this.calld = calldMethods(this.client, `calld/${CALLD_VERSION}`);
  }

  updateParameters({ server, agent, clientId }: { server: string, agent: ?Object, clientId: ?string }) {
    const refreshTokenCallback = this.refreshTokenCallback.bind(this);
    this.client = new ApiRequester({ server, agent, refreshTokenCallback, clientId });

    this.initializeEndpoints();
  }

  async forceRefreshToken() {
    return this.refreshTokenCallback();
  }

  async refreshTokenCallback() {
    if (!this.refreshToken) {
      return null;
    }

    const session = await this.auth.refreshToken(this.refreshToken, this.refreshBackend, this.refreshExpiration, true);

    if (this.onRefreshToken) {
      this.onRefreshToken(session.token, session);
    }

    this.setToken(session.token);

    return session.token;
  }

  setToken(token: string) {
    this.client.token = token;
  }

  setTenant(tenant: string) {
    this.client.setTenant(tenant);
  }

  setRefreshToken(refreshToken: ?string) {
    this.refreshToken = refreshToken;
  }

  setClientId(clientId: ?string) {
    this.client.clientId = clientId;
  }

  setOnRefreshToken(onRefreshToken: Function) {
    this.onRefreshToken = onRefreshToken;
  }

  setRefreshExpiration(refreshExpiration: number) {
    this.refreshExpiration = refreshExpiration;
  }

  setRefreshBackend(refreshBackend: string) {
    this.refreshBackend = refreshBackend;
  }
}
