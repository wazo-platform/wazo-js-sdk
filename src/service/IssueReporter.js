/* global window */
// @flow

global.wazoIssueReporterLogs = [];

class IssueReporter {
  INFO: string;
  LOG: string;
  WARN: string;
  ERROR: string;

  consoleMethods: string[];
  oldConsoleMethods: Object;
  enabled: boolean;

  constructor() {
    this.INFO = 'info';
    this.LOG = 'log';
    this.WARN = 'warn';
    this.ERROR = 'error';

    this.consoleMethods = [this.INFO, this.LOG, this.WARN, this.ERROR];
    this.oldConsoleMethods = {};
    this.enabled = false;
  }

  init() {
    this._catchConsole();
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  log(level: string, ...args: any) {
    if (!this.enabled) {
      return;
    }
    global.wazoIssueReporterLogs.push({
      level,
      date: new Date(),
      message: args.join(', '),
    });
  }

  getReport() {
    return global.wazoIssueReporterLogs
      .map(log => `${log.date.toString().substr(0, 24)} - ${log.level} - ${log.message}`)
      .join('\r\n');
  }

  getLogs() {
    return global.wazoIssueReporterLogs;
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
