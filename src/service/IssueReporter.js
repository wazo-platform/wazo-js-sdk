/* global window */
// @flow
import moment from 'moment';

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
    const date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const message = args.join(', ');
    global.wazoIssueReporterLogs.push({ level, date, message });

    // Log the message in the console anyway
    // eslint-disable-next-line
    const oldMethod = this.oldConsoleMethods[level] || console.log;
    oldMethod.apply(oldMethod, [date, message]);
  }

  logRequest(curl: string, response: Object) {
    if (!this.enabled) {
      return;
    }
    const { status } = response;

    this.log(status < 500 ? 'info' : 'warn', curl);
  }

  getLogs() {
    return global.wazoIssueReporterLogs;
  }

  getParsedLogs() {
    return this.getLogs().map(log => `${log.date.toString().substr(0, 24)} - ${log.level} - ${log.message}`);
  }

  getReport() {
    return this.getParsedLogs().join('\r\n');
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
