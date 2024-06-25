import { EventEmitter } from 'events';

import { SipCall } from '../domain/types';

class Call extends EventEmitter {
  eventEmitter: EventEmitter;

  constructor(sipSession: SipCall) {
    super();

    this.video = false;
  }

}

export default Call;
