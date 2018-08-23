import client from './application';
import init from './config/init';
import logIn from './api/auth/log-in';
import logOut from './api/auth/log-out';

import calls from './api/applications/calls';
import hangupCall from './api/applications/hangup-call';
import answerCall from './api/applications/answer-call';
import playCall from './api/applications/play';

import WebRTCPhone from './api/phone';

export default {
  client,
  init,
  logIn,
  logOut,
  calls,
  hangupCall,
  answerCall,
  playCall,
  WebRTCPhone,
};
