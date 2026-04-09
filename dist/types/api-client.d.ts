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
    constructor(args: ConstructorParams);
    initializeEndpoints(): void;
}
//# sourceMappingURL=api-client.d.ts.map