/* @flow */
/* global btoa, window, fetch */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { Base64 } from 'js-base64';

import BadResponse from '../domain/BadResponse';
import ServerError from '../domain/ServerError';
import Logger from './logger';
import isMobile from './isMobile';
import type { Token } from '../domain/types';
import IssueReporter from '../service/IssueReporter';

type ConstructorParams = {
  server: string,
  agent: ?Object,
  clientId: ?string,
  refreshTokenCallback: Function,
  token?: string,
};

const methods = ['head', 'get', 'post', 'put', 'delete'];

// Use a function here to be able to mock it in tests
const realFetch = () => {
  if (typeof document !== 'undefined') {
    // Browser
    return window.fetch;
  }

  if (isMobile()) {
    // React native
    return fetch;
  }

  // nodejs
  // this package is disable for react-native in package.json because it requires nodejs modules
  return require('node-fetch/lib/index');
};

export default class ApiRequester {
  server: string;
  agent: ?Object;
  clientId: ?string;
  token: string;
  tenant: ?string;
  refreshTokenCallback: Function;

  head: Function;
  get: Function;
  post: Function;
  put: Function;
  delete: Function;

  // eslint-disable-next-line
  static successResponseParser(response: Object, isJson: boolean) {
    return response.status === 204;
  }

  static defaultParser(response: Object) {
    return response.json().then((data: Object) => data);
  }

  static getQueryString(obj: Object): string {
    return Object.keys(obj)
      .filter(key => obj[key])
      .map(key => `${key}=${encodeURIComponent(obj[key])}`)
      .join('&');
  }

  static base64Encode(str: string): string {
    return typeof btoa !== 'undefined' ? btoa(str) : Base64.encode(str);
  }

  // @see https://github.com/facebook/flow/issues/183#issuecomment-358607052
  constructor({ server, refreshTokenCallback, clientId, agent = null, token = null }: ConstructorParams) {
    this.server = server;
    this.agent = agent;
    this.clientId = clientId;
    this.refreshTokenCallback = refreshTokenCallback;
    if (token) {
      this.token = token;
    }

    methods.forEach(method => {
      // $FlowFixMe
      ApiRequester.prototype[method] = function sugar(...args) {
        // Add method in arguments passed to `call`
        args.splice(1, 0, method);

        return this.call.call(this, ...args);
      };
    });
  }

  setTenant(tenant: ?string) {
    this.tenant = tenant;
  }

  setToken(token: string) {
    this.token = token;
  }

  call(
    path: string,
    method: string = 'get',
    body: ?Object = null,
    headers: ?string | ?Object = null,
    parse: Function = ApiRequester.defaultParser,
    firstCall: boolean = true,
  ): Promise<any> {
    const url = this.computeUrl(method, path, body);
    const newHeaders = this.getHeaders(headers);
    let newBody = method === 'get' ? null : body;
    if (newBody && newHeaders['Content-Type'] === 'application/json') {
      newBody = JSON.stringify(newBody);
    }
    const isHead = method === 'head';
    const hasEmptyResponse = method === 'delete' || isHead;
    const newParse = hasEmptyResponse ? ApiRequester.successResponseParser : parse;
    const options = {
      method,
      body: newBody,
      headers: this.getHeaders(headers),
      agent: this.agent,
    };

    return realFetch()(url, options).then(response => {
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.indexOf('application/json') !== -1;

      const curl = this._getCurlCommand(url, options, response);
      Logger.log(curl);
      IssueReporter.logRequest(curl, response);

      // Throw an error only if status >= 400
      if ((isHead && response.status >= 500) || (!isHead && response.status >= 400)) {
        const promise = isJson ? response.json() : response.text();
        const exceptionClass = response.status >= 500 ? ServerError : BadResponse;

        return promise.then(async err => {
          // Check if the token is still valid
          if (firstCall && this._checkTokenExpired(response, err)) {
            // Replay the call after refreshing the token
            return this._replayWithNewToken(err, path, method, body, headers, parse);
          }

          throw typeof err === 'string'
            ? exceptionClass.fromText(err, response.status)
            : exceptionClass.fromResponse(err, response.status);
        });
      }

      return newParse(response, isJson);
    });
  }

  _checkTokenExpired(response: Object, err: Object) {
    // Special case when authenticating form a token: we got a 404
    const isTokenNotFound = response.status === 404 && this._isTokenNotFound(err);

    return response.status === 401 || isTokenNotFound;
  }

  _isTokenNotFound(err: Object) {
    return err.reason && err.reason[0] === 'No such token';
  }

  _replayWithNewToken(
    err: Object,
    path: string,
    method: string,
    body: ?Object = null,
    headers: ?string | ?Object = null,
    parse: Function,
  ) {
    const isTokenNotFound = this._isTokenNotFound(err);
    let newPath = path;

    return this.refreshTokenCallback().then(() => {
      if (isTokenNotFound) {
        const pathParts = path.split('/');
        pathParts.pop();
        pathParts.push(this.token);
        newPath = pathParts.join('/');
      }

      return this.call(newPath, method, body, headers, parse, false);
    });
  }

  getHeaders(header: ?Token | ?Object): Object {
    if (header instanceof Object) {
      return header;
    }

    return {
      'X-Auth-Token': this.token,
      ...(this.tenant ? { 'Wazo-Tenant': this.tenant } : null),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  computeUrl(method: string, path: string, body: ?Object): string {
    const url = `${this.baseUrl}/${path}`;

    return method === 'get' && body && Object.keys(body).length ? `${url}?${ApiRequester.getQueryString(body)}` : url;
  }

  _getCurlCommand(url: string, { method, body, headers }: Object, response: Object) {
    const { status } = response;

    let curl = `${status} - curl ${method !== 'get' ? `-X ${method.toUpperCase()}` : ''}`;
    Object.keys(headers).forEach(headerName => {
      curl += ` -H '${headerName}: ${headers[headerName]}'`;
    });

    curl += ` ${url}`;

    if (body) {
      curl += ` -d '${body}'`;
    }

    return curl;
  }

  get baseUrl(): string {
    return `https://${this.server}/api`;
  }
}
