/* @flow */
import 'cross-fetch/polyfill';

import type { Token } from './types';

export const callApi = (
  url: string,
  method: string = 'get',
  body: ?Object = null,
  headers: Object = {},
  parse: Function = (res: Object) => res.json().then((data: Object) => data)
) => fetch(url, { method, body: body ? JSON.stringify(body) : null, headers }).then(response => {
    // Throw an error only if status >= 500
    if (response.status >= 500) {
      const isJson = response.headers.get('content-type').indexOf('application/json') !== -1;
      const promise = isJson ? response.json() : response.text();

      return promise.then(err => {
        throw err;
      });
    }

    return parse(response);
  });

export const getHeaders = (token: Token): Object => ({
    'X-Auth-Token': token,
    'Content-Type': 'application/json'
  });
