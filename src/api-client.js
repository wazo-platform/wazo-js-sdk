import fetch from 'cross-fetch';

import authMethods from './api/auth';
import applicationMethods from './api/application';
import confdMethods from './api/confd';
import accessdMethods from './api/accessd';

const AUTH_VERSION = '0.1';
const APPLICATION_VERSION = '1.0';
const CONFD_VERSION = '1.1';
const ACCESSD_VERSION = '1.0';

export default class ApiClient {
  static callApi(url, method = 'get', body = null, headers = {}, parse = res => res.json().then(data => data)) {
    return fetch(url, { method, body: body ? JSON.stringify(body) : null, headers }).then(response => {
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
  }

  static getHeaders(token) {
    return {
      'X-Auth-Token': token,
      'Content-Type': 'application/json'
    };
  }

  constructor({ server }) {
    this.server = server;
    this.backendUser = 'wazo_user';
    this.expiration = 3600;

    this.auth = authMethods(ApiClient, this);
    this.application = applicationMethods(ApiClient, this);
    this.confd = confdMethods(ApiClient, this);
    this.accessd = accessdMethods(ApiClient, this);
  }

  // Getters
  get authUrl() {
    return `${this.baseUrl}/auth/${AUTH_VERSION}`;
  }

  get applicationUrl() {
    return `${this.baseUrl}/ctid-ng/${APPLICATION_VERSION}/applications`;
  }

  get confdUrl() {
    return `${this.baseUrl}/confd/${CONFD_VERSION}`;
  }

  get accessdUrl() {
    return `${this.baseUrl}/accessd/${ACCESSD_VERSION}`;
  }

  get baseUrl() {
    return `https://${this.server}/api`;
  }
}
