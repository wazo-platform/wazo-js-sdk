// @flow
import EventEmitter from 'events';

export default class Emitter {
  eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  on(event: string, callback: Function) {
    this.eventEmitter.on(event, callback);
  }

  once(event: string, callback: Function) {
    this.eventEmitter.once(event, callback);
  }

  off(event: string, callback: Function) {
    this.eventEmitter.removeListener(event, callback);
  }

  unbind() {
    this.eventEmitter.removeAllListeners();
  }
}
