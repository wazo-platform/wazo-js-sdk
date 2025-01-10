import { Base64 } from 'js-base64';

import BadResponse from '../domain/BadResponse';
import ServerError from '../domain/ServerError';
import type { Token } from '../domain/types';
import IssueReporter from '../service/IssueReporter';

type ConstructorParams = {
  server: string;
  agent: Record<string, any> | null | undefined;
  clientId: string | null | undefined;
  refreshTokenCallback: (...args: Array<any>) => any;
  token?: string | null;
  fetchOptions: Record<string, any> | null | undefined;
  requestTimeout?: number | null;
};
const methods = ['head', 'get', 'post', 'put', 'delete', 'options'];
const logger = IssueReporter ? IssueReporter.loggerFor('api') : console;
const REQUEST_TIMEOUT_MS = 300 * 1000; // 300s like the Chrome engine default value.

export default class ApiRequester {
  server: string;

  agent: Record<string, any> | null | undefined;

  clientId: string | null | undefined;

  token: string;

  tenant: string | null | undefined;

  fetchOptions: Record<string, any>;

  refreshTokenCallback: (...args: Array<any>) => any;

  refreshTokenPromise: Promise<any> | null | undefined;

  shouldLogErrors: boolean;

  requestTimeout: number;

  head: (...args: Array<any>) => any;

  get: (...args: Array<any>) => any;

  post: (...args: Array<any>) => any;

  put: (...args: Array<any>) => any;

  delete: (...args: Array<any>) => any;

  options: (...args: Array<any>) => any;

  static successResponseParser(response: Record<string, any>): boolean {
    return response.status === 204 || response.status === 201 || response.status === 200;
  }

  static defaultParser(response: Record<string, any>) {
    return response.json().then((data: Record<string, any>) => ({ ...data, _headers: response.headers }));
  }

  static getQueryString(obj: Record<string, any>): string {
    return Object.keys(obj).filter(key => obj[key]).map(key => `${key}=${encodeURIComponent(obj[key])}`).join('&');
  }

  static base64Encode(str: string): string {
    if (typeof btoa !== 'undefined') {
      try {
        return btoa(str);
      } catch (error) {
        // fall back to Base64.encode if btoa fails
      }
    }

    return Base64.encode(str);
  }

  constructor({
    server,
    refreshTokenCallback,
    clientId,
    agent = null,
    token = null,
    fetchOptions,
    requestTimeout = REQUEST_TIMEOUT_MS,
  }: ConstructorParams) {
    this.server = server;
    this.agent = agent;
    this.clientId = clientId;
    this.refreshTokenCallback = refreshTokenCallback;
    this.refreshTokenPromise = null;
    this.fetchOptions = fetchOptions || {};
    this.requestTimeout = requestTimeout || REQUEST_TIMEOUT_MS;

    if (token) {
      this.token = token;
    }

    this.shouldLogErrors = true;
    methods.forEach(method => {
      // @ts-ignore
      this[method] = function sugar(...args) {
        // Add method in arguments passed to `call`
        args.splice(1, 0, method);
        // @ts-ignore
        return this.call.call(this, ...args);
      };
    });
  }

  setRequestTimeout(requestTimeout: number) {
    this.requestTimeout = requestTimeout;
  }

  setTenant(tenant: string | null | undefined) {
    this.tenant = tenant;
  }

  setToken(token: string) {
    this.token = token;
  }

  setFetchOptions(options: Record<string, any>) {
    this.fetchOptions = options;
  }

  disableErrorLogging() {
    this.shouldLogErrors = false;
  }

  enableErrorLogging() {
    this.shouldLogErrors = true;
  }

  async call(path: string, method = 'get', body: Record<string, any> | null | undefined = null, headers: (string | null | undefined) | (Record<string, any> | null | undefined) = null, parse: (...args: Array<any>) => any = ApiRequester.defaultParser, firstCall = true): Promise<any> {
    const url = this.computeUrl(method, path, body);
    const newHeaders = this.getHeaders(headers);
    let newBody: any = method === 'get' ? null : body;

    if (newBody && newHeaders['Content-Type'] === 'application/json') {
      newBody = JSON.stringify(newBody);
    }

    const isHead = method === 'head';
    const hasEmptyResponse = method === 'delete' || isHead;
    const newParse = hasEmptyResponse && parse === ApiRequester.defaultParser ? ApiRequester.successResponseParser : parse;
    const fetchOptions = { ...(this.fetchOptions || {}) };
    const controller = new AbortController();
    const extraHeaders = fetchOptions.headers || {};
    delete fetchOptions.headers;
    const options = {
      method,
      body: newBody,
      signal: controller ? controller.signal : null,
      headers: {
        ...this.getHeaders(headers),
        ...extraHeaders,
      },
      agent: this.agent,
      ...fetchOptions,
    };

    if (this.refreshTokenPromise) {
      logger.info('A token is already refreshing, waiting ...', {
        url,
      });
      await this.refreshTokenPromise;
    }

    const start = new Date();
    const requestPromise = fetch(url, options).then((response: any) => {
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.indexOf('application/json') !== -1;
      IssueReporter.logRequest(url, options, response, start);

      // Throw an error only if status >= 400
      if ((isHead && response.status >= 500) || (!isHead && response.status >= 400)) {
        const promise = isJson ? response.json() : response.text();
        const exceptionClass = response.status >= 500 ? ServerError : BadResponse;
        return promise.then(async (err: Record<string, any>) => {
          // Check if the token is still valid
          if (firstCall && this._checkTokenExpired(response, err)) {
            logger.warn('token expired', {
              error: err.reason,
            });
            // Replay the call after refreshing the token
            return this._replayWithNewToken(err, path, method, body, headers, parse);
          }

          const error = typeof err === 'string' ? exceptionClass.fromText(err, response.status) : exceptionClass.fromResponse(err, response.status);

          if (this.shouldLogErrors) {
            logger.error('API error', error);
          }

          throw error;
        });
      }

      return newParse(response, isJson);
    }).catch((error: any) => {
      if (this.shouldLogErrors) {
        logger.error('Fetch failed', {
          url,
          options,
          message: error.message,
          stack: error.stack,
        });
      }

      throw error;
    });

    const requestTimeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error(`Request timed out after ${this.requestTimeout} ms`));
      }, this.requestTimeout);
    });

    return Promise.race([requestPromise, requestTimeout]);
  }

  _checkTokenExpired(response: Record<string, any>, err: Record<string, any>) {
    // Special case when authenticating form a token: we got a 404
    const isTokenNotFound = response.status === 404 && this._isTokenNotFound(err);

    return response.status === 401 || isTokenNotFound;
  }

  _isTokenNotFound(err: Record<string, any>) {
    return err && err.reason && err.reason[0] === 'No such token';
  }

  _replayWithNewToken(
    err: Record<string, any>,
    path: string,
    method: string,
    body: Record<string, any> | null | undefined = null,
    headers: (string | null | undefined) | (Record<string, any> | null | undefined) = null,
    parse: ((...args: Array<any>) => any) | undefined = undefined,
  ) {
    const isTokenNotFound = this._isTokenNotFound(err);

    let newPath = path;
    logger.info('refreshing token', {
      inProgress: !!this.refreshTokenPromise,
    });
    this.refreshTokenPromise = this.refreshTokenPromise || this.refreshTokenCallback();
    return this.refreshTokenPromise?.then(() => {
      this.refreshTokenPromise = null;
      logger.info('token refreshed', {
        isTokenNotFound,
      });

      if (isTokenNotFound) {
        const pathParts = path.split('/');
        pathParts.pop();
        pathParts.push(this.token);
        newPath = pathParts.join('/');
      }

      return this.call(newPath, method, body, headers, parse, false);
    }).catch(e => {
      this.refreshTokenPromise = null;
      throw e;
    });
  }

  getHeaders(header: (Token | null | undefined) | (Record<string, any> | null | undefined)): Record<string, any> {
    if (header instanceof Object) {
      return header;
    }

    return {
      'X-Auth-Token': this.token,
      ...(this.tenant ? {
        'Wazo-Tenant': this.tenant,
      } : null),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  computeUrl(method: string, path: string, body: Record<string, any> | null | undefined): string {
    const url = `${this.baseUrl}/${path}`;
    return method === 'get' && body && Object.keys(body).length ? `${url}?${ApiRequester.getQueryString(body)}` : url;
  }

  get baseUrl(): string {
    return `https://${this.server}/api`;
  }

}
