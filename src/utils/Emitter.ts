import EventEmitter from 'events';

export default class Emitter {
  eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  on(event: string, callback: (...args: Array<any>) => any) {
    this.eventEmitter.on(event, callback);
  }

  once(event: string, callback: (...args: Array<any>) => any) {
    this.eventEmitter.once(event, callback);
  }

  off(event: string, callback: (...args: Array<any>) => any) {
    this.eventEmitter.removeListener(event, callback);
  }

  unbind() {
    this.eventEmitter.removeAllListeners();
  }

}
