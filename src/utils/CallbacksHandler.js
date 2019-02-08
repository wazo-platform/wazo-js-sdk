// @flow

export default class CallbacksHandler {
  callbacks: Object;

  constructor() {
    this.callbacks = {};
  }

  on = (event: string, callback: Function) => {
    if (!(event in this.callbacks)) {
      this.callbacks[event] = [];
    }

    this.callbacks[event].push(callback);
  };

  clear = () => {
    this.callbacks = {};
  };

  // trigger callback registered with .on('name', ...)
  triggerCallback = (eventName: string, ...args: Array<any>) => {
    // Add event name at last argument, so we can know the event name if we do on('*', ...)
    args.push(eventName);

    if (this.callbacks['*']) {
      this.callbacks['*'].forEach(cb => cb.apply(undefined, args));
    }

    if (!(eventName in this.callbacks)) {
      return null;
    }

    return this.callbacks[eventName].forEach(cb => cb.apply(undefined, args));
  };
}
