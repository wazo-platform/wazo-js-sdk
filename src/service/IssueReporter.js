/* global window */
// @flow

class IssueReporter {
  INFO: string;
  LOG: string;
  WARN: string;
  ERROR: string;

  consoleMethods: string[];
  oldConsoleMethods: Object;
  logs: Object[];

  constructor() {
    this.INFO = 'info';
    this.LOG = 'log';
    this.WARN = 'warn';
    this.ERROR = 'error';

    this.consoleMethods = [this.INFO, this.LOG, this.WARN, this.ERROR];
    this.oldConsoleMethods = {};
    this.logs = [];
  }

  init() {
    this._catchConsole();
  }

  log(level: string, ...args: any) {
    this.logs.push({
      level,
      date: new Date(),
      message: args.join(', '),
    });
  }

  getReport() {
    return this.logs.map(log => `${log.date.toString().substr(0, 24)} - ${log.level} - ${log.message}`).join('\r\n');
  }

  _catchConsole() {
    this.consoleMethods.forEach((methodName: string) => {
      // eslint-disable-next-line
      this.oldConsoleMethods[methodName] = console[methodName];
      window.console[methodName] = (...args) => {
        // Store message
        this.log(methodName, args.join(' '));
        // Use old console method to log it normally
        this.oldConsoleMethods[methodName].apply(null, args);
      };
    });
  }
}

export default new IssueReporter();
