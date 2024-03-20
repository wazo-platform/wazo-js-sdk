/* global window */

/* eslint-disable prefer-destructuring, no-param-reassign, no-underscore-dangle */
import moment from 'moment';
import isMobile from '../utils/isMobile';
import { obfuscateToken } from '../utils/string';

const TRACE = 'trace';
const DEBUG = 'debug';
const INFO = 'info';
const LOG = 'log';
const WARN = 'warn';
const ERROR = 'error';
const CONSOLE_METHODS = [INFO, LOG, WARN, ERROR];
const LOG_LEVELS = [TRACE, DEBUG, INFO, LOG, WARN, ERROR];
const CATEGORY_PREFIX = 'logger-category=';
const MAX_REMOTE_RETRY = 10;

const addLevelsTo = (instance: Record<string, any>, withMethods = false) => {
  instance.TRACE = TRACE;
  instance.DEBUG = DEBUG;
  instance.INFO = INFO;
  instance.LOG = LOG;
  instance.WARN = WARN;
  instance.ERROR = ERROR;

  if (withMethods) {
    instance.trace = (...args: any) => instance.apply(null, [TRACE, ...args]);

    instance.debug = (...args: any) => instance.apply(null, [DEBUG, ...args]);

    instance.info = (...args: any) => instance.apply(null, [INFO, ...args]);

    instance.log = (...args: any) => instance.apply(null, [LOG, ...args]);

    instance.warn = (...args: any) => instance.apply(null, [WARN, ...args]);

    instance.error = (...args: any) => instance.apply(null, [ERROR, ...args]);
  }

  return instance;
};

const safeStringify = (object: Record<string, any>) => {
  const result = '{"message": "Not parsable JSON"}';

  try {
    return JSON.stringify(object);
  } catch (e: any) { // Nothing to do
  }

  return result;
};

class IssueReporter {
  TRACE: string;

  INFO: string;

  LOG: string;

  WARN: string;

  ERROR: string;

  oldConsoleMethods: Record<string, any> | null;

  enabled: boolean;

  remoteClientConfiguration: Record<string, any> | null | undefined;

  buffer: Record<string, any>[];

  bufferTimeout: any | null | undefined;

  _boundProcessBuffer: (...args: Array<any>) => any;

  _boundParseLoggerBody: (...args: Array<any>) => any;

  _callback: ((...args: Array<any>) => any) | null | undefined;

  constructor() {
    addLevelsTo(this);
    this.oldConsoleMethods = null;
    this.enabled = false;
    this.remoteClientConfiguration = null;
    this.buffer = [];
    this.bufferTimeout = null;
    this._boundProcessBuffer = this._processBuffer.bind(this);
    this._boundParseLoggerBody = this._parseLoggerBody.bind(this);
    this._callback = null;
  }

  init() {
    this._catchConsole();
  }

  setCallback(cb: (...args: Array<any>) => any) {
    this._callback = cb;
  }

  configureRemoteClient(configuration: Record<string, any> = {
    tag: 'wazo-sdk',
    host: null,
    port: null,
    level: null,
    extra: {},
  }) {
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

  obfuscateHeaderToken(headers: object): object {
    const newHeaders: object = { ...headers };
    if ('X-Auth-Token' in newHeaders) {
      newHeaders['X-Auth-Token'] = obfuscateToken(newHeaders['X-Auth-Token'] as string);
    }

    return newHeaders;
  }

  log(level: string, ...args: any) {
    if (!this.enabled) {
      return;
    }

    // Handle category label
    let category = null;
    let skipSendToRemote = false;
    let extra: any = {};

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
          skipSendToRemote: (lastArg as Error & { skipSendToRemote: boolean }).skipSendToRemote,
        };
      } else {
        extra = lastArg;
      }

      // eslint-disable-next-line no-param-reassign
      args.splice(1, 1);
    }

    if (extra.skipSendToRemote) {
      skipSendToRemote = true;
      delete extra.skipSendToRemote;
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
    const oldMethod = this.oldConsoleMethods?.[consoleLevel] || this.oldConsoleMethods?.log;
    oldMethod.apply(oldMethod, [date, consoleMessage]);

    if (this._callback) {
      this._callback(level, consoleMessage);
    }

    if (!skipSendToRemote) {
      this._sendToRemoteLogger(level, {
        date,
        message,
        category,
        ...extra,
      });
    }
  }

  logRequest(url: string, options: Record<string, any>, response: Record<string, any>, start: Date) {
    if (!this.enabled) {
      return;
    }

    const {
      status,
    } = response;

    const duration = +(new Date()) - +start;
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
      headers: this.obfuscateHeaderToken(options.headers),
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
      if (this.oldConsoleMethods) {
        // @ts-ignore: keys
        // eslint-disable-next-line
        this.oldConsoleMethods[methodName] = console[methodName];
      }
      const parent:any = typeof window !== 'undefined' ? window : global;
      parent.console[methodName] = (...args: any) => {
        // Store message
        try {
          this.log(methodName, args.join(' '));
          if (this.oldConsoleMethods) {
            // Use old console method to log it normally
            this.oldConsoleMethods[methodName].apply(null, args);
          }
        } catch (e: any) { // Avoid circular structure issues
        }
      };
    });
  }

  _sendToRemoteLogger(level: string, payload: Record<string, any> = {}) {
    if (!this.remoteClientConfiguration) {
      return;
    }

    const {
      level: minLevel,
      bufferSize,
    } = this.remoteClientConfiguration;

    if (!minLevel || this._isLevelAbove(minLevel, level)) {
      return;
    }

    payload.level = level;

    if (bufferSize > 0) {
      return this._addToBuffer(payload);
    }

    this._sendDebugToGrafana(payload);
  }

  _parseLoggerBody(payload: Record<string, any>) {
    const {
      level,
    } = payload;
    const {
      maxMessageSize,
      extra,
    } = this.remoteClientConfiguration || {};
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

  _addToBuffer(payload: Record<string, any>) {
    // Reset buffer timer
    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
      this.bufferTimeout = null;
    }

    this.buffer.push(payload);

    const {
      bufferSize,
      bufferTimeout,
    }: any = this.remoteClientConfiguration;

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

  _computeRetryDelay(attempt: number, initial = 1000, maxWait = 50000) {
    // min wait is initial(attempt = 0)
    // later retries are randomly distributed between initial wait and exponential
    const base = 1.5;
    const wait = Math.min(initial * base ** attempt, maxWait);
    const jitterWait = Math.max(initial, Math.random() * wait);
    return jitterWait;
  }

  _sendDebugToGrafana(payload: string | Record<string, any> | Record<string, any>[], retry = 0) {
    if (!this.remoteClientConfiguration || retry >= MAX_REMOTE_RETRY) {
      return;
    }

    const {
      tag,
      host,
      port,
    } = this.remoteClientConfiguration;

    const isSecure = +port === 443;
    const url = `http${isSecure ? 's' : ''}://${host}${isSecure ? '' : `:${port}`}/${tag}`;
    const body = Array.isArray(payload) ? `[${payload.map(this._boundParseLoggerBody).join(',')}]` : this._parseLoggerBody(payload as Record<string, any>);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    }).catch((e: Error & { skipSendToRemote?: boolean }) => {
      e.skipSendToRemote = true;
      this.log('error', this._makeCategory('grafana'), 'Sending log to grafana, error', e);
      // wait at least 1 second, at most 50 seconds
      const wait = this._computeRetryDelay(retry, 1000, 50000);
      setTimeout(() => {
        if (Array.isArray(payload)) {
          payload = payload.map(message => this._writeRetryCount(message, retry + 1));
        } else if (payload && typeof payload === 'object') {
          payload = this._writeRetryCount(payload, retry + 1);
        }

        this._sendDebugToGrafana(payload, retry + 1);
      }, wait);
    });
  }

  _writeRetryCount(message: string | Record<string, any>, count: number): string | Record<string, any> {
    if (message && typeof message === 'object') {
      message._retry = count;
    }

    return message;
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
