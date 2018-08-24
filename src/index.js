import client from './application';
import init from './config/init';
import logIn from './api/auth/log-in';
import logOut from './api/auth/log-out';
import checkAuth from './api/auth/check-auth';

import calls from './api/applications/calls';
import hangupCall from './api/applications/hangup-call';
import answerCall from './api/applications/answer-call';
import playCall from './api/applications/play';
import listNodes from './api/applications/nodes';
import listCallsNodes from './api/applications/nodes-calls';
import removeCallNodes from './api/applications/nodes-remove-calls';

import WebRTCPhone from './api/phone';

export default {
  client,
  init,
  logIn,
  logOut,
  checkAuth,
  calls,
  hangupCall,
  answerCall,
  listNodes,
  listCallsNodes,
  removeCallNodes,
  playCall,
  WebRTCPhone,
};
