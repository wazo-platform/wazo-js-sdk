/* global window */
// @flow

class IssueReporter {
  static INFO: string;
  static LOG: string;
  static WARN: string;
  static ERROR: string;

  consoleMethods: string[];
  oldConsoleMethods: Object;
  logs: Object[];

  constructor() {
    this.consoleMethods = [IssueReporter.INFO, IssueReporter.LOG, IssueReporter.WARN, IssueReporter.ERROR];
    this.oldConsoleMethods = {};
    this.logs = [];
  }

  init() {
    this._catchConsole();
  }

  log(level: string, message: string) {
    this.logs.push({
      level,
      date: Date.now(),
      message,
    });
  }

  getReport() {
    return this.logs.map(log => `${log.date.toString()} - ${log.level} - ${log.message}`).join('\r\n');
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

// Can't use static
IssueReporter.INFO = 'info';
IssueReporter.LOG = 'log';
IssueReporter.WARN = 'warn';
IssueReporter.ERROR = 'error';

export default new IssueReporter();
