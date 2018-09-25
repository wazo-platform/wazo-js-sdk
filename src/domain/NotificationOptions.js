// @flow

import { Record } from 'immutable';

type NotificationOptionResponse = {
  sound: string,
  vibration: string
};

const NotificationOptionsRecord = Record({
  sound: true,
  vibration: true
});

export default class NotificationOptions extends NotificationOptionsRecord {
  sound: boolean;
  vibration: boolean;

  static parse(plain: NotificationOptionResponse): NotificationOptions {
    if (!plain) {
      return new NotificationOptions();
    }

    return new NotificationOptions({
      sound: plain.sound,
      vibration: plain.vibration
    });
  }

  setSound(sound: boolean): boolean {
    return this.set('sound', sound);
  }

  setVibration(vibration: boolean) {
    return this.set('vibration', vibration);
  }

  enable() {
    return this.set('vibration', true).set('sound', true);
  }

  disable() {
    return this.set('vibration', false).set('sound', false);
  }

  isEnabled() {
    return this.sound || this.vibration;
  }
}
