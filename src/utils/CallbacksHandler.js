// @flow

export default class CallbacksHandler {
  callbacks: Object;

  constructor() {
    this.callbacks = {};
  }

  on(event: string, callback: Function) {
    this.callbacks[event] = callback;
  }

  // trigger callback registered with .on('name', ...)
  triggerCallback(eventName: string, ...args: Array<any>) {
    // Add event name at last argument, so we can know the event name if we do on('*', ...)
    args.push(eventName);

    if (this.callbacks['*']) {
      this.callbacks['*'].apply(undefined, args);
    }

    if (!(eventName in this.callbacks)) {
      return null;
    }

    return this.callbacks[eventName].apply(undefined, args);
  }
}
