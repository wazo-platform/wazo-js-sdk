import axios from 'axios';

// import WebRTCPhone from './api/phone';
// import WazoWebSocket from './api/websocket';

const AUTH_VERSION = '0.1';
const APPLICATION_VERSION = '1.0';
const CONFD_VERSION = '1.1';

export default class ApiClient {
  static callApi(url, method = 'get', body = null, options = null, parseResponse = response => response.data.data) {
    const config = Object.assign({}, options);

    if (!config.validateStatus) {
      // Throw exception when status code < 400
      config.validateStatus = status => status < 400;
    }

    const args = method === 'get' ? [url, config] : [url, body, config];
    return axios[method].apply(undefined, args).then(parseResponse);
  }

  static getHeaders(token) {
    return {
      headers: {
        'X-Auth-Token': token,
        'Content-Type': 'application/json'
      }
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
    const config = {
      auth: {
        username: params.username,
        password: params.password
      }
    };

    return ApiClient.callApi(this.authUrl, 'post', data, config);
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
