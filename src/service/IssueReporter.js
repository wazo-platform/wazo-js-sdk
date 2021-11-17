/* global window */
/* eslint-disable prefer-destructuring, no-param-reassign, no-underscore-dangle */
// @flow
import moment from 'moment';

import { realFetch } from '../utils/api-requester';
import isMobile from '../utils/isMobile';

const TRACE = 'trace';
const DEBUG = 'debug';
const INFO = 'info';
const LOG = 'log';
const WARN = 'warn';
const ERROR = 'error';
const CONSOLE_METHODS = [INFO, LOG, WARN, ERROR];
const LOG_LEVELS = [TRACE, DEBUG, INFO, LOG, WARN, ERROR];
const CATEGORY_PREFIX = 'logger-category=';

const MAX_REMOTE_RETRY = 100;

const addLevelsTo = (instance: Object, withMethods = false) => {
  instance.TRACE = TRACE;
  instance.DEBUG = DEBUG;
  instance.INFO = INFO;
  instance.LOG = LOG;
  instance.WARN = WARN;
  instance.ERROR = ERROR;

  if (withMethods) {
    instance.trace = (...args) => instance.apply(null, [TRACE, ...args]);
    instance.debug = (...args) => instance.apply(null, [DEBUG, ...args]);
    instance.info = (...args) => instance.apply(null, [INFO, ...args]);
    instance.log = (...args) => instance.apply(null, [LOG, ...args]);
    instance.warn = (...args) => instance.apply(null, [WARN, ...args]);
    instance.error = (...args) => instance.apply(null, [ERROR, ...args]);
  }

  return instance;
};

const safeStringify = (object: Object) => {
  const result = '{"message": "Not parsable JSON"}';
  try {
    return JSON.stringify(object);
  } catch (e) {
    // Nothing to do
  }

  return result;
};

class IssueReporter {
  TRACE: string;
  INFO: string;
  LOG: string;
  WARN: string;
  ERROR: string;

  oldConsoleMethods: Object;
  enabled: boolean;
  remoteClientConfiguration: ?Object;

  buffer: Object[];
  bufferTimeout: ?TimeoutID;
  _boundProcessBuffer: Function;
  _boundParseLoggerBody: Function;

  constructor() {
    addLevelsTo(this);

    this.oldConsoleMethods = null;
    this.enabled = false;
    this.remoteClientConfiguration = null;
    this.buffer = [];
    this.bufferTimeout = null;
    this._boundProcessBuffer = this._processBuffer.bind(this);
    this._boundParseLoggerBody = this._parseLoggerBody.bind(this);
  }

  init() {
    this._catchConsole();
  }

  configureRemoteClient(configuration: Object = { tag: 'wazo-sdk', host: null, port: null, level: null, extra: {} }) {
    this.remoteClientConfiguration = configuration;
  }

  enable() {
    if (!this.oldConsoleMethods) {
      this.init();
    }

    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  loggerFor(category: string): any {
    const logger = (level: string, ...args: any) => {
      this.log.apply(this, [level, this._makeCategory(category), ...args]);
    };

    return addLevelsTo(logger, true);
  }

  removeSlashes(str: string) {
    return str.replace(/"/g, "'").replace(/\\/g, '');
  }

  log(level: string, ...args: any) {
    if (!this.enabled) {
      return;
    }

    // Handle category label
    let category = null;
    let extra = {};
    if (args[0].indexOf(CATEGORY_PREFIX) === 0) {
      category = args[0].split('=')[1];
      // eslint-disable-next-line no-param-reassign
      args.splice(0, 1);
    }

    // Handle extra data as object for the last argument
    const lastArg = args[args.length - 1];
    if (lastArg && ((typeof lastArg === 'object' && Object.keys(lastArg).length) || lastArg instanceof Error)) {
      if (lastArg instanceof Error) {
        extra = {
          errorMessage: lastArg.message,
          errorStack: lastArg.stack,
          errorType: lastArg.constructor.name,
        };
      } else {
        extra = lastArg;
      }
      // eslint-disable-next-line no-param-reassign
      args.splice(1, 1);
    }

    const date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const message = args.join(', ');
    let consoleMessage = message;

    if (Object.keys(extra).length) {
      const parsedExtra = safeStringify(extra);
      consoleMessage = `${consoleMessage} (${parsedExtra})`;
    }

    if (category) {
      consoleMessage = `[${category}] ${consoleMessage}`;
    }

    // Log the message in the console anyway (but don't console.error on mobile)
    const consoleLevel = isMobile() && level === 'error' ? WARN : level;

    // eslint-disable-next-line
    const oldMethod = this.oldConsoleMethods[consoleLevel] || this.oldConsoleMethods.log;
    oldMethod.apply(oldMethod, [date, consoleMessage]);

    this._sendToRemoteLogger(level, { date, message, category, ...extra });
  }

  logRequest(url: string, options: Object, response: Object, start: Date) {
    if (!this.enabled) {
      return;
    }
    const { status } = response;
    const duration = new Date() - start;

    let level = TRACE;
    if (status >= 400 && status < 500) {
      level = WARN;
    } else if (status >= 500) {
      level = ERROR;
    }

    this.log(level, this._makeCategory('http'), url, {
      status,
      body: this.removeSlashes(JSON.stringify(options.body)),
      method: options.method,
      headers: options.headers,
      duration,
    });
  }

  // Logs aren't stored anymore
  getLogs() {
    console.warn('IssueReporter\'s logs aren\'t stored anymore. Please use fluentd to store them');
    return [];
  }

  getParsedLogs() {
    console.warn('IssueReporter\'s logs aren\'t stored anymore. Please use fluentd to store them');
    return [];
  }

  getReport() {
    return this.getParsedLogs().join('\r\n');
  }

  _catchConsole() {
    this.oldConsoleMethods = {};
    CONSOLE_METHODS.forEach((methodName: string) => {
      // eslint-disable-next-line
      this.oldConsoleMethods[methodName] = console[methodName];
      window.console[methodName] = (...args) => {
        // Store message
        try {
          this.log(methodName, args.join(' '));
          // Use old console method to log it normally
          this.oldConsoleMethods[methodName].apply(null, args);
        } catch (e) {
          // Avoid circular structure issues
        }
      };
    });
  }

  _sendToRemoteLogger(level: string, payload: Object = {}) {
    if (!this.remoteClientConfiguration) {
      return;
    }

    const { level: minLevel, bufferSize } = this.remoteClientConfiguration;
    if (!minLevel || this._isLevelAbove(minLevel, level)) {
      return;
    }

    payload.level = level;

    if (bufferSize > 0) {
      return this._addToBuffer(payload);
    }

    this._sendDebugToGrafana(payload);
  }

  _parseLoggerBody(payload: Object) {
    const { level } = payload;
    const { maxMessageSize, extra } = this.remoteClientConfiguration || {};

    delete payload.level;

    if (maxMessageSize && typeof payload.message === 'string' && payload.message.length > maxMessageSize) {
      payload.message = `${payload.message.substr(0, maxMessageSize)}...`;
    }

    return safeStringify({
      level,
      ...payload,
      ...extra,
    });
  }

  _addToBuffer(payload: Object) {
    // Reset buffer timer
    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
      this.bufferTimeout = null;
    }

    this.buffer.push(payload);

    // $FlowFixMe
    const { bufferSize, bufferTimeout } = this.remoteClientConfiguration;

    if (this.buffer.length > bufferSize) {
      return this._processBuffer();
    }

    if (bufferTimeout > 0) {
      this.bufferTimeout = setTimeout(this._boundProcessBuffer, bufferTimeout);
    }
  }

  _processBuffer() {
    this._sendDebugToGrafana(this.buffer);

    this.buffer = [];
    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
      this.bufferTimeout = null;
    }
  }

  _sendDebugToGrafana(payload: Object | Object[], retry: number = 0) {
    if (!this.remoteClientConfiguration || retry >= MAX_REMOTE_RETRY) {
      return;
    }

    const { tag, host, port } = this.remoteClientConfiguration;
    const isArray = Array.isArray(payload);
    const isSecure = +port === 443;
    const url = `http${isSecure ? 's' : ''}://${host}${isSecure ? '' : `:${port}`}/${tag}`;
    const body = isArray ? `[${payload.map(this._boundParseLoggerBody).join(',')}]` : this._parseLoggerBody(payload);

    realFetch()(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // $FlowFixMe
      body,
    }).catch(() => {
      setTimeout(() => {
        if (isArray) {
          payload = payload.map(message => {
            message._retry = retry + 1;
            return message;
          });
        } else {
          // $FlowFixMe
          payload._retry = retry + 1;
        }

        this._sendDebugToGrafana(payload, retry + 1);
      }, 5000 + retry * 1000);
    });
  }

  _isLevelAbove(level1: string, level2: string) {
    const index1 = LOG_LEVELS.indexOf(level1);
    const index2 = LOG_LEVELS.indexOf(level2);
    if (index1 === -1 || index2 === -1) {
      return false;
    }

    return index1 > index2;
  }

  _makeCategory(category: string) {
    return `${CATEGORY_PREFIX}${category}`;
  }
}

export default new IssueReporter();
