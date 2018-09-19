import { Base64 } from 'js-base64';
import fetch from 'cross-fetch';

const AUTH_VERSION = '0.1';
const APPLICATION_VERSION = '1.0';
const CONFD_VERSION = '1.1';

export default class ApiClient {
  static callApi(url, method = 'get', body = null, headers = {}, parse = res => res.json().then(data => data.data)) {
    return fetch(url, { method, body: body ? JSON.stringify(body) : null, headers }).then(response => {
      // Throw an error if status >= 400
      if (response.status >= 400) {
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
  }

  // Auth methods
  logIn(params = {}) {
    const data = {
      backend: params.backend || this.backendUser,
      expiration: params.expiration || this.expiration
    };
    const headers = {
      Authorization: `Basic ${Base64.encode(`${params.username}:${params.password}`)}`,
      'Content-Type': 'application/json'
    };

    return ApiClient.callApi(this.authUrl, 'post', data, headers);
  }

  logOut(token) {
    return ApiClient.callApi(`${this.authUrl}/${token}`, 'delete');
  }

  checkToken(token) {
    return ApiClient.callApi(`${this.authUrl}/${token}`, 'head', null, null, response => response.status === 204);
  }

  // Applications methods
  answerCall(token, applicationUuid, callId, context, exten, autoanswer) {
    const url = `${this.applicationUrl}/${applicationUuid}/nodes`;
    const body = { calls: [{ id: callId }] };
    const headers = ApiClient.getHeaders(token);

    return ApiClient.callApi(url, 'post', body, headers, res => res.data.uuid).then(nodeUuid =>
      ApiClient.callApi(`${url}/${nodeUuid}/calls`, 'post', { context, exten, autoanswer }, headers).then(data => ({
        nodeUuid,
        data
      }))
    );
  }

  calls(token, applicationUuid) {
    return ApiClient.callApi(
      `${this.applicationUrl}/${applicationUuid}/calls`,
      'get',
      null,
      ApiClient.getHeaders(token)
    );
  }

  hangupCall(token, applicationUuid, callId) {
    const url = `${this.applicationUrl}/${applicationUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  }

  nodes(token, applicationUuid) {
    const url = `${this.applicationUrl}/${applicationUuid}/nodes`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getTokenHeaders(token));
  }

  playCall(token, applicationUuid, callId, language, uri) {
    const url = `${this.applicationUrl}/${applicationUuid}/calls/${callId}/play`;

    return ApiClient.callApi(url, 'post', { language, uri }, ApiClient.getHeaders(token));
  }

  addCallNodes(token, applicationUuid, nodeUuid, callId) {
    const url = `${this.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'put', null, ApiClient.getHeaders(token));
  }

  addNewCallNodes(token, applicationUuid, nodeUuid, context, exten, autoanswer) {
    const url = `${this.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`;
    const data = { context, exten, autoanswer };

    return ApiClient.callApi(url, 'post', data, ApiClient.getHeaders(token));
  }

  listCallsNodes(token, applicationUuid, nodeUuid) {
    const url = `${this.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  }

  removeNode(token, applicationUuid, nodeUuid) {
    const url = `${this.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  }

  removeCallNodes(token, applicationUuid, nodeUuid, callId) {
    const url = `${this.applicationUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`;

    return ApiClient.callApi(url, 'delete', null, ApiClient.getHeaders(token));
  }

  // Confd methods
  listUsers(token) {
    return ApiClient.callApi(`${this.confdUrl}/users`, 'get', null, ApiClient.getHeaders(token));
  }

  getUser(token, userUuid) {
    return ApiClient.callApi(`${this.confdUrl}/users/${userUuid}`, 'get', null, ApiClient.getHeaders(token));
  }

  getUserLineSip(token, userUuid, lineId) {
    const url = `${this.confdUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  }

  listApplications(token) {
    const url = `${this.confdUrl}/applications?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  }

  // Getters
  get authUrl() {
    return `${this.baseUrl}/auth/${AUTH_VERSION}/token`;
  }

  get applicationUrl() {
    return `${this.baseUrl}/ctid-ng/${APPLICATION_VERSION}/applications`;
  }

  get confdUrl() {
    return `${this.baseUrl}/confd/${CONFD_VERSION}`;
  }

  get baseUrl() {
    return `https://${this.server}/api`;
  }
}
