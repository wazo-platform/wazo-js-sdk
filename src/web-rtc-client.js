// @flow

import SIP from 'sip.js';

const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];

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

const defaultCallback = () => {
  console.warn('Please set a callback for WazoWebRTCClient');
};

export default class WebRTCClient {
  config: Object;
  userAgent: Object;
  callback: Function;

  constructor(config: WebRtcConfig, callback: Function = defaultCallback) {
    this.config = config;
    this.userAgent = this.configureUserAgent();
    this.callback = callback;
  }

  configureUserAgent() {
    const userAgent = new SIP.Web.Simple(this.getConfig());

    userAgent.on('registered', () => {
      this.callback('phone-events-registered');
    });

    userAgent.on('unregistered', () => {
      this.callback('phone-events-unregistered');
    });

    userAgent.on('new', session => {
      const info = {
        callerid: getCallerID(session),
        autoanswer: getAutoAnswer(session.request)
      };
      this.callback('phone-events-new', info);
    });

    userAgent.on('ringing', () => {
      this.callback('phone-events-ringing');
    });

    userAgent.on('connected', () => {
      this.callback('phone-events-connected');
    });

    userAgent.on('ended', () => {
      this.callback('phone-events-ended');
    });

    return userAgent;
  }

  getConfig() {
    return {
      media: {
        remote: {
          audio: this.config.media.audio
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
