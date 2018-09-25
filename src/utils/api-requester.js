/* @flow */
/* global fetch */
// $FlowFixMe: can't find `cross-fetch/polyfill`.
import 'cross-fetch/polyfill';

import BadResponse from '../domain/BadResponse';
import Logger from './logger';
import type { Token } from '../types';

const methods = ['head', 'get', 'post', 'put', 'delete'];

export default class ApiRequester {
  server: string;
  agent: ?Object;

  head: Function;
  get: Function;
  post: Function;
  put: Function;
  delete: Function;

  // eslint-disable-next-line
  static successResponseParser(response: Object, isJson: boolean) {
    return response.status === 204;
  }

  static defaultParser(response: Object, isJson: boolean) {
    if (!response.ok) {
      return (isJson ? response.json() : response.text()).then(
        error => (isJson ? BadResponse.fromResponse(error) : BadResponse.fromText(error))
      );
    }

    return response.json().then((data: Object) => data);
  }

  static getHeaders(header: ?Token | ?Object): Object {
    if (header instanceof Object) {
      return header;
    }

    return {
      'X-Auth-Token': header,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }

  static getQueryString(obj: Object): string {
    return Object.keys(obj)
      .filter(key => obj[key])
      .map(key => `${key}=${encodeURIComponent(obj[key])}`)
      .join('&');
  }

  // @see https://github.com/facebook/flow/issues/183#issuecomment-358607052
  constructor({ server, agent = null }: $Subtype<{ server: string, agent: ?Object }>) {
    this.server = server;
    this.agent = agent;

    methods.forEach(method => {
      // $FlowFixMe
      ApiRequester.prototype[method] = function sugar(...args) {
        // Add method in arguments passed to `call`
        args.splice(1, 0, method);

        return this.call.call(this, ...args);
      };
    });
  }

  call(
    path: string,
    method: string = 'get',
    body: ?Object = null,
    headers: ?string | ?Object = null,
    parse: Function = ApiRequester.defaultParser
  ): Promise<any> {
    const url = this.computeUrl(method, path, body);
    const newBody = body && method !== 'get' ? JSON.stringify(body) : null;
    const newParse = method === 'delete' || method === 'head' ? ApiRequester.successResponseParser : parse;
    const options = {
      method,
      body: newBody,
      headers: headers ? ApiRequester.getHeaders(headers) : {},
      agent: this.agent
    };

    return fetch(url, options).then(response => {
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.indexOf('application/json') !== -1;

      Logger.logRequest(url, options, response);

      // Throw an error only if status >= 500
      if (response.status >= 500) {
        const promise = isJson ? response.json() : response.text();

        return promise.then(err => {
          throw err;
        });
      }

      return newParse(response, isJson);
    });
  }

  computeUrl(method: string, path: string, body: ?Object): string {
    const url = `${this.baseUrl}/${path}`;

    return method === 'get' && body && Object.keys(body).length ? `${url}?${ApiRequester.getQueryString(body)}` : url;
  }

  get baseUrl(): string {
    return `https://${this.server}/api`;
  }
}
