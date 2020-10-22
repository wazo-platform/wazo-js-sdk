/* global window */
// @flow
import moment from 'moment';

import { realFetch } from '../utils/api-requester';

global.wazoIssueReporterLogs = [];

class IssueReporter {
  INFO: string;
  LOG: string;
  WARN: string;
  ERROR: string;

  consoleMethods: string[];
  oldConsoleMethods: Object;
  enabled: boolean;
  remoteClientConfiguration: ?Object;

  constructor() {
    this.INFO = 'info';
    this.LOG = 'log';
    this.WARN = 'warn';
    this.ERROR = 'error';

    this.consoleMethods = [this.INFO, this.LOG, this.WARN, this.ERROR];
    this.oldConsoleMethods = {};
    this.enabled = false;
    this.remoteClientConfiguration = null;
  }

  init() {
    this._catchConsole();
  }

  configureRemoteClient(configuration: Object = { tag: 'wazo-sdk', host: null, port: null, extra: {} }) {
    this.remoteClientConfiguration = configuration;
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

    this._sendToRemoteLogger(level, { date, message });
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

  _sendToRemoteLogger(level: string, payload: Object) {
    if (!this.remoteClientConfiguration) {
      return;
    }

    const { tag, host, port, extra } = this.remoteClientConfiguration;
    const url = `http://${host}:${port}/${tag}`;

    realFetch()(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level,
        ...payload,
        ...extra,
      }),
    });
  }
}

export default new IssueReporter();
