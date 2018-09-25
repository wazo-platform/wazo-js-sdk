/* @flow */
import authMethods from './api/auth';
import applicationMethods from './api/application';
import confdMethods from './api/confd';
import accessdMethods from './api/accessd';
import ctidngMethods from './api/ctid-ng';
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

export default class ApiClient {
  client: ApiRequester;
  auth: Object;
  application: Object;
  confd: Object;
  accessd: Object;
  ctidng: Object;
  dird: Object;
  callLogd: Object;

  // @see https://github.com/facebook/flow/issues/183#issuecomment-358607052
  constructor({ server, agent = null }: $Subtype<{ server: string, agent?: ?Object }>) {
    this.updatePatemers({ server, agent });
  }

  initializeEndpoints(): void {
    this.auth = authMethods(this.client, `auth/${AUTH_VERSION}`);
    this.application = applicationMethods(this.client, `ctid-ng/${APPLICATION_VERSION}/applications`);
    this.confd = confdMethods(this.client, `confd/${CONFD_VERSION}`);
    this.accessd = accessdMethods(this.client, `accessd/${ACCESSD_VERSION}`);
    this.ctidng = ctidngMethods(this.client, `ctid-ng/${CTIDNG_VERSION}`);
    this.dird = dirdMethods(this.client, `dird/${DIRD_VERSION}`);
    this.callLogd = callLogdMethods(this.client, `call-logd/${CALL_LOGD_VERSION}`);
  }

  updatePatemers({ server, agent }: { server: string, agent: ?Object }) {
    this.client = new ApiRequester({ server, agent });

    this.initializeEndpoints();
  }
}
