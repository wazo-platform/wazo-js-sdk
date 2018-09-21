/* @flow */
/* global fetch */
// $FlowFixMe: can't find `cross-fetch/polyfill`.
import 'cross-fetch/polyfill';

import type { Token } from './types';
import BadResponse from './domain/BadResponse';

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

  return fetch(newUrl, { method, body: newBody, headers }).then(response => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.indexOf('application/json') !== -1;

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
  'Content-Type': 'application/json'
});
