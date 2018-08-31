import client from './application';
import init from './config/init';
import logIn from './api/auth/log-in';
import logOut from './api/auth/log-out';
import checkToken from './api/auth/check-token';

import calls from './api/applications/calls';
import hangupCall from './api/applications/hangup-call';
import answerCall from './api/applications/answer-call';
import playCall from './api/applications/play';
import listNodes from './api/applications/nodes';
import removeNode from './api/applications/nodes-remove';
import listCallsNodes from './api/applications/nodes-calls';
import removeCallNodes from './api/applications/nodes-remove-calls';
import addCallNodes from './api/applications/nodes-add-calls';
import addNewCallNodes from './api/applications/nodes-add-new-calls';

import listUsers from './api/confd/users';
import getUser from './api/confd/user';
import getUserLineSip from './api/confd/user-line';

import WebRTCPhone from './api/phone';
import WazoWebSocket from './api/websocket';

export default {
  client,
  init,
  logIn,
  logOut,
  checkToken,
  calls,
  hangupCall,
  answerCall,
  listNodes,
  removeNode,
  listCallsNodes,
  removeCallNodes,
  addCallNodes,
  addNewCallNodes,
  playCall,
  listUsers,
  getUser,
  getUserLineSip,
  WebRTCPhone,
  WazoWebSocket,
};
