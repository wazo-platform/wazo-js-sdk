import applicationMethods from './api/application';
import confdMethods from './api/confd';
import ctidNgMethods from './api/ctid-ng';
import dirdMethods from './api/dird';
import callLogdMethods from './api/call-logd';
import chatdMethods from './api/chatd';
import calldMethods from './api/calld';
import agentdMethods from './api/agentd';
import webhookdMethods from './api/webhookd';
import amidMethods from './api/amid';
import {
  APPLICATION_VERSION,
  CONFD_VERSION,
  CTIDNG_VERSION,
  DIRD_VERSION,
  CALL_LOGD_VERSION,
  CHATD_VERSION,
  CALLD_VERSION,
  AGENTD_VERSION,
  WEBHOOKD_VERSION,
  AMID_VERSION,
} from './constants';
import BaseApiClient, { ConstructorParams } from './base-api-client';

export default class ApiClient extends BaseApiClient {
  application: ReturnType<typeof applicationMethods>;

  confd: ReturnType<typeof confdMethods>;

  ctidNg: ReturnType<typeof ctidNgMethods>;

  dird: ReturnType<typeof dirdMethods>;

  callLogd: ReturnType<typeof callLogdMethods>;

  chatd: ReturnType<typeof chatdMethods>;

  calld: ReturnType<typeof calldMethods>;

  agentd: ReturnType<typeof agentdMethods>;

  webhookd: ReturnType<typeof webhookdMethods>;

  amid: ReturnType<typeof amidMethods>;

  constructor(args: ConstructorParams) {
    super(args);
    this.initializeEndpoints(); // Reinitialize sdk endpoints
  }

  initializeEndpoints(): void {
    super.initializeEndpoints();

    this.application = applicationMethods(this.client, `calld/${APPLICATION_VERSION}/applications`);
    this.confd = confdMethods(this.client, `confd/${CONFD_VERSION}`);
    this.ctidNg = ctidNgMethods(this.client, `ctid-ng/${CTIDNG_VERSION}`);
    this.dird = dirdMethods(this.client, `dird/${DIRD_VERSION}`);
    this.callLogd = callLogdMethods(this.client, `call-logd/${CALL_LOGD_VERSION}`);
    this.chatd = chatdMethods(this.client, `chatd/${CHATD_VERSION}`);
    this.calld = calldMethods(this.client, `calld/${CALLD_VERSION}`);
    this.agentd = agentdMethods(this.client, `agentd/${AGENTD_VERSION}`);
    this.webhookd = webhookdMethods(this.client, `webhookd/${WEBHOOKD_VERSION}`);
    this.amid = amidMethods(this.client, `amid/${AMID_VERSION}`);
  }
}
