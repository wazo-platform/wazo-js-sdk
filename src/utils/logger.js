/* @flow */

export default class Logger {
  static hasDebug() {
    return typeof process !== 'undefined' && (+process.env.DEBUG === 1 || process.env.DEBUG === 'true');
  }

  static log(...msg: any) {
    if (!Logger.hasDebug()) {
      return;
    }

    console.info(...msg);
  }
}
