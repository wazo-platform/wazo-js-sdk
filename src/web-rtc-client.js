// @flow

import SIP from 'sip.js';

import CallbacksHandler from './utils/CallbacksHandler';

const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];
const events = [
  'registered',
  'unregistered',
  'new',
  'ringing',
  'connecting',
  'connected',
  'ended',
  'hold',
  'unhold',
  'mute',
  'unmute',
  'dtmf',
  'message'
];

const getCallerID = session => ({
  caller_id_name: session.remoteIdentity.displayName,
  caller_id_number: session.remoteIdentity.uri.user
});

const getAutoAnswer = request => !!request.getHeader('alert-info');
const DESTINATION_REGEXP = /^\+?[0-9#*]+$/;

type WebRtcConfig = {
  displayName: string,
  wsServers: Array<string>,
  authorizationUser: string,
  password: string,
  uri: string,
  media: {
    audio: string
  }
};

export default class WebRTCClient {
  config: Object;
  userAgent: Object;
  callbacksHandler: CallbacksHandler;

  constructor(config: WebRtcConfig) {
    this.config = config;
    this.userAgent = this.configureUserAgent();
    this.callbacksHandler = new CallbacksHandler();
  }

  configureUserAgent() {
    const userAgent = new SIP.Web.Simple(this.getConfig());

    events.filter(eventName => eventName !== 'new').forEach(eventName => {
      userAgent.on(eventName, event => {
        this.callbacksHandler.triggerCallback(eventName, event);
      });
    });

    // Particular case for `new` event
    userAgent.on('new', session => {
      this.callbacksHandler.triggerCallback('new', {
        callerid: getCallerID(session),
        autoanswer: getAutoAnswer(session.request)
      });
    });

    return userAgent;
  }

  on(event: string, callback: Function) {
    this.callbacksHandler.on(event, callback);
  }

  getConfig() {
    const {
      media: { audio, video, localVideo }
    } = this.config;

    return {
      media: {
        remote: {
          audio: video || audio,
          video
        },
        local: {
          video: localVideo
        }
      },
      ua: {
        traceSip: false,
        displayName: this.config.displayName,
        uri: this.config.uri,
        wsServers: this.config.wsServers,
        authorizationUser: this.config.authorizationUser,
        password: this.config.password,
        sessionDescriptionHandlerFactoryOptions: {
          peerConnectionOptions: {
            iceCheckingTimeout: 500,
            rtcpMuxPolicy: 'negotiate',
            rtcConfiguration: {
              iceServers: {
                urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']
              }
            }
          }
        }
      }
    };
  }

  getState() {
    return states[this.userAgent.state];
  }

  call(destination: string) {
    if (DESTINATION_REGEXP.exec(destination)) {
      this.userAgent.call(destination);
    }
  }

  answer() {
    this.userAgent.answer();
  }

  reject() {
    this.userAgent.reject();
  }

  hangup() {
    this.userAgent.hangup();
  }

  close() {
    this.userAgent.transport.disconnect();
  }
}
