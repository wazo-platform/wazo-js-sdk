import SIP from 'sip.js';


const state = [
  'STATUS_NULL',
  'STATUS_NEW',
  'STATUS_CONNECTING',
  'STATUS_CONNECTED',
  'STATUS_COMPLETED',
];

export default class WebRTCPhone {
  constructor(config, callback) {
    this.config = config;
    this.ua = this.configureUa();
    this.callback = callback;
  }

  configureUa() {
    const ua = new SIP.Web.Simple(this.getConfig());

    ua.on('registered', () => {
      this.callback('phone-events-registered');
    });

    ua.on('unregistered', () => {
      this.callback('phone-events-unregistered');
    });

    ua.on('new', (session) => {
      const info = {
        callerid: this.getCallerId(session),
        autoanswer: this.getAutoAnswer(session.request),
      };
      this.callback('phone-events-new', info);
    });

    ua.on('ringing', () => {
      this.callback('phone-events-ringing');
    });

    ua.on('connected', () => {
      this.callback('phone-events-connected');
    });

    ua.on('ended', () => {
      this.callback('phone-events-ended');
    });

    return ua;
  }

  getConfig() {
    return {
      media: {
        remote: {
          audio: this.config.media.audio,
        },
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
                urls: [
                  'stun:stun.l.google.com:19302',
                  'stun:stun1.l.google.com:19302',
                ],
              },
            },
          },
        },
      },
    };
  }

  static getCallerId(session) {
    return {
      caller_id_name: session.remoteIdentity.displayName,
      caller_id_number: session.remoteIdentity.uri.user,
    };
  }

  static getAutoAnswer(request) {
    const alertInfo = request.getHeader('alert-info');
    if (alertInfo) {
      return true;
    }

    return false;
  }

  getState() {
    return state[this.ua.state];
  }

  call(destination) {
    const re = /^\+?[0-9#*]+$/;

    if (re.exec(destination)) {
      this.ua.call(destination);
    }
  }

  answer() {
    this.ua.answer();
  }

  reject() {
    this.ua.reject();
  }

  hangup() {
    this.ua.hangup();
  }
}
