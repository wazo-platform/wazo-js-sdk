/* @flow */
import authMethods from './api/auth';
import applicationMethods from './api/application';
import confdMethods from './api/confd';
import accessdMethods from './api/accessd';
import ctidngMethods from './api/ctidng';

const AUTH_VERSION = '0.1';
const APPLICATION_VERSION = '1.0';
const CONFD_VERSION = '1.1';
const ACCESSD_VERSION = '1.0';
const CTIDNG_VERSION = '1.0';

export default class ApiClient {
  _server: string;
  backendUser: string;
  expiration: number;
  auth: Object;
  application: Object;
  confd: Object;
  accessd: Object;
  ctidng: Object;

  constructor({ server }: { server: string }) {
    this.server = server;
  }

  initializeEndpoints() {
    this.auth = authMethods(this.authUrl);
    this.application = applicationMethods(this.applicationUrl);
    this.confd = confdMethods(this.confdUrl);
    this.accessd = accessdMethods(this.accessdUrl);
    this.ctidng = ctidngMethods(this.ctidngUrl);
  }

  set server(server: string) {
    this._server = server;

    this.initializeEndpoints();
  }

  // Getters
  get authUrl(): string {
    return `${this.baseUrl}/auth/${AUTH_VERSION}`;
  }

  get applicationUrl(): string {
    return `${this.baseUrl}/ctid-ng/${APPLICATION_VERSION}/applications`;
  }

  get confdUrl(): string {
    return `${this.baseUrl}/confd/${CONFD_VERSION}`;
  }

  get accessdUrl(): string {
    return `${this.baseUrl}/accessd/${ACCESSD_VERSION}`;
  }

  get ctidngUrl(): string {
    return `${this.baseUrl}/ctid-ng/${CTIDNG_VERSION}`;
  }

  get baseUrl(): string {
    return `https://${this._server}/api`;
  }
}
