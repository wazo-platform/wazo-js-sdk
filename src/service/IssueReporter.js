/* global window */
/* eslint-disable prefer-destructuring */
// @flow
import moment from 'moment';

import { realFetch } from '../utils/api-requester';

global.wazoIssueReporterLogs = [];

const TRACE = 'trace';
const DEBUG = 'debug';
const INFO = 'info';
const LOG = 'log';
const WARN = 'warn';
const ERROR = 'error';

const consoleMethods = [INFO, LOG, WARN, ERROR];
const logLevels = [TRACE, DEBUG, INFO, LOG, WARN, ERROR];

class IssueReporter {
  INFO: string;
  LOG: string;
  WARN: string;
  ERROR: string;

  oldConsoleMethods: Object;
  enabled: boolean;
  remoteClientConfiguration: ?Object;

  constructor() {
    this.INFO = INFO;
    this.LOG = LOG;
    this.WARN = WARN;
    this.ERROR = ERROR;

    this.oldConsoleMethods = {};
    this.enabled = false;
    this.remoteClientConfiguration = null;
  }

  init() {
    this._catchConsole();
  }

  configureRemoteClient(configuration: Object = { tag: 'wazo-sdk', host: null, port: null, level: null, extra: {} }) {
    this.remoteClientConfiguration = configuration;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  loggerFor(category: string) {
    const logger = (level: string, ...args: any) => {
      this.log.apply(this, [level, `logger-category=${category}`, ...args]);
    };

    logger.INFO = this.INFO;
    logger.LOG = this.LOG;
    logger.WARN = this.WARN;
    logger.ERROR = this.ERROR;

    return logger;
  }

  log(level: string, ...args: any) {
    if (!this.enabled) {
      return;
    }

    // Handle category label
    let category = null;
    if (args[0].indexOf('logger-category=') === 0) {
      category = args[0].split('=')[1];
      // eslint-disable-next-line no-param-reassign
      args[0] = args.splice(1);
    }

    const date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    let message = args.join(', ');

    if (category) {
      message = `[${category}] ${message}`;
    }
    global.wazoIssueReporterLogs.push({ level, date, message });

    // Log the message in the console anyway
    // eslint-disable-next-line
    const oldMethod = this.oldConsoleMethods[level] || console.log;
    oldMethod.apply(oldMethod, [date, message]);

    this._sendToRemoteLogger(level, { date, message, category });
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
    consoleMethods.forEach((methodName: string) => {
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

    const { tag, host, port, extra, level: minLevel } = this.remoteClientConfiguration;
    if (minLevel && !this._isLevelAbove(level, minLevel)) {
      return;
    }
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

  _isLevelAbove(level1: string, level2: string) {
    return logLevels.indexOf(level1) >= logLevels.indexOf(level2);
  }
}

export default new IssueReporter();
