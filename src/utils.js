/* @flow */
/* global fetch */
// $FlowFixMe: can't find `cross-fetch/polyfill`.
import 'cross-fetch/polyfill';

import type { Token } from './types';
import BadResponse from './domain/BadResponse';

export const hasDebug = +process.env.DEBUG === 1 || process.env.DEBUG === 'true';

export const logRequest = (url: string, { method, body, headers }: Object, response: Object) => {
  if (!hasDebug) {
    return;
  }

  const { status } = response;

  let curl = `${status} - curl ${method !== 'get' ? `-X ${method.toUpperCase()}` : ''}`;
  Object.keys(headers).forEach(headerName => {
    curl += ` -H '${headerName}: ${headers[headerName]}'`;
  });

  curl += ` ${url}`;

  if (body) {
    curl += ` -d '${body}'`;
  }

  console.info(curl);
};

// eslint-disable-next-line
export const successResponseParser = (response: Object, isJson: boolean) => response.status === 204;

export const defaultParser = (response: Object, isJson: boolean) => {
  if (!response.ok) {
    return (isJson ? response.json() : response.text()).then(
      error => (isJson ? BadResponse.fromResponse(error) : BadResponse.fromText(error))
    );
  }

  return response.json().then((data: Object) => data);
};

export const getQueryString = (obj: Object): string =>
  Object.keys(obj)
    .filter(key => obj[key])
    .map(key => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&');

export const computeUrl = (method: string, url: string, body: ?Object): string =>
  method === 'get' && body && Object.keys(body).length ? `${url}?${getQueryString(body)}` : url;

export const callApi = (
  url: string,
  method: string = 'get',
  body: ?Object = null,
  headers: Object = {},
  parse: Function = defaultParser
): Promise<any> => {
  const newUrl = computeUrl(method, url, body);
  const newBody = body && method !== 'get' ? JSON.stringify(body) : null;
  const newParse = method === 'delete' || method === 'head' ? successResponseParser : parse;
  const options = { method, body: newBody, headers };

  return fetch(newUrl, options).then(response => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.indexOf('application/json') !== -1;

    logRequest(newUrl, options, response);

    // Throw an error only if status >= 500
    if (response.status >= 500) {
      const promise = isJson ? response.json() : response.text();

      return promise.then(err => {
        throw err;
      });
    }

    return newParse(response, isJson);
  });
};

export const getHeaders = (token: Token): Object => ({
  'X-Auth-Token': token,
  Accept: 'application/json',
  'Content-Type': 'application/json'
});
