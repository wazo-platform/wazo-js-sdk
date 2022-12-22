import { Registerer as SipJsRegisterer } from 'sip.js/lib/api/registerer';

// @ts-ignore
export default class Registerer extends SipJsRegisterer {
  waiting: boolean;

  waitingToggle(...args): void {
    // @ts-ignore
    super.waitingToggle(...args);
  }

  unregistered(...args): any {
    return super.unregister(...args);
  }
}
