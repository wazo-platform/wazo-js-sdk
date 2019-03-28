// @flow
import newFrom from '../utils/new-from';

type NotificationOptionResponse = {
  sound: boolean,
  vibration: boolean,
};

type NotificationOptionsArguments = {
  sound: boolean,
  vibration: boolean,
};

export default class NotificationOptions {
  sound: boolean;
  vibration: boolean;

  static parse(plain: NotificationOptionResponse): NotificationOptions {
    if (!plain) {
      return new NotificationOptions({ sound: true, vibration: true });
    }

    return new NotificationOptions({
      sound: plain.sound,
      vibration: plain.vibration,
    });
  }

  static newFrom(profile: NotificationOptions) {
    return newFrom(profile, NotificationOptions);
  }

  constructor({ sound = true, vibration = true }: NotificationOptionsArguments = {}) {
    this.sound = sound;
    this.vibration = vibration;
  }

  setSound(sound: boolean): NotificationOptions {
    this.sound = sound;

    return this;
  }

  setVibration(vibration: boolean): NotificationOptions {
    this.vibration = vibration;

    return this;
  }

  enable() {
    this.vibration = true;
    this.sound = true;

    return this;
  }

  disable() {
    this.vibration = false;
    this.sound = false;

    return this;
  }

  isEnabled() {
    return this.sound || this.vibration;
  }
}
