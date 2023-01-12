import EventEmitter from 'events';

export interface IEmitter {
  eventEmitter: EventEmitter;
  on: (event: string, callback: (...args: Array<any>) => any) => void;
  once: (event: string, callback: (...args: Array<any>) => any) => void;
  off: (event: string, callback: (...args: Array<any>) => any) => void;
  unbind: () => void;
}

export default class Emitter implements IEmitter {
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
