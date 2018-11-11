// @flow
/* eslint-disable class-methods-use-this */
/* global window */
import 'webrtc-adapter';
import SIP from './lib/sip-0.11.1';
import CallbacksHandler from './utils/CallbacksHandler';

const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];
const events = [
  'connected',
  'disconnected',
  'registered',
  'unregistered',
  'registrationFailed',
  'invite',
  'inviteSent',
  'transportCreated',
  'newTransaction',
  'transactionDestroyed',
  'notify',
  'outOfDialogReferRequested',
  'message'
];

type MediaConfig = {
  audio: Object & boolean,
  video: Object & boolean,
  localVideo?: Object & boolean
};

type WebRtcConfig = {
  displayName: string,
  host: string,
  port?: number,
  authorizationUser: string,
  password: string,
  media: MediaConfig
};

// @see https://github.com/onsip/SIP.js/blob/master/src/Web/Simple.js
export default class WebRTCClient {
  config: WebRtcConfig;
  userAgent: SIP.UA;
  callbacksHandler: CallbacksHandler;
  audio: Object & boolean;
  video: Object & boolean;
  localVideo: ?Object & ?boolean;

  static isAPrivateIp(ip: string): boolean {
    const regex = /^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\..*/;
    return regex.exec(ip) == null;
  }

  static getIceServers(ip: string): Array<{ urls: Array<string> }> {
    if (WebRTCClient.isAPrivateIp(ip)) {
      return [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302'
          ]
        }
      ];
    }
    return [];
  }

  constructor(config: WebRtcConfig) {
    this.config = config;
    this.callbacksHandler = new CallbacksHandler();

    this.configureMedia(config.media);
    this.userAgent = this.createUserAgent();
  }

  configureMedia(media: MediaConfig) {
    this.audio = media.audio;
    this.video = media.video;
    this.localVideo = media.localVideo;
  }

  createUserAgent(): SIP.UA {
    const webRTCConfiguration = this._createWebRTCConfiguration();
    const userAgent = new SIP.UA(webRTCConfiguration);

    events.filter(eventName => eventName !== 'invite').forEach(eventName => {
      userAgent.on(eventName, event => {
        this.callbacksHandler.triggerCallback(eventName, event);
      });
    });

    // Particular case for `invite` event
    userAgent.on('invite', (session: SIP.sessionDescriptionHandler) => {
      this._setupSession(session);

      this.callbacksHandler.triggerCallback('invite', session);
    });
    return userAgent;
  }

  on(event: string, callback: Function) {
    this.callbacksHandler.on(event, callback);
  }

  call(number: string): SIP.sessionDescriptionHandler {
    // Safari hack, because you cannot call .play() from a non user action
    if (this.audio && this._isWeb()) {
      this.audio.autoplay = true;
    }
    if (this.video && this._isWeb()) {
      this.video.autoplay = true;
    }
    if (this.localVideo && this._isWeb()) {
      this.localVideo.autoplay = true;
      this.localVideo.volume = 0;
    }

    const session = this.userAgent.invite(number, this._getMediaConfiguration());
    this._fixLocalDescription(session);

    this._setupSession(session);

    return session;
  }

  answer(session: SIP.sessionDescriptionHandler) {
    // Safari hack, because you cannot call .play() from a non user action
    if (this.audio && this._isWeb()) {
      this.audio.autoplay = true;
    }
    if (this.video && this._isWeb()) {
      this.video.autoplay = true;
    }

    session.accept(this._getMediaConfiguration());
  }

  hangup(session: SIP.sessionDescriptionHandler) {
    if (session.hasAnswer && session.bye) {
      session.bye();
      return;
    }

    if (!session.hasAnswer && session.cancel) {
      session.cancel();
      return;
    }

    if (session.reject) {
      session.reject();
    }
  }

  reject(session: SIP.sessionDescriptionHandler) {
    return session.reject();
  }

  mute(session: SIP.sessionDescriptionHandler) {
    this._toggleMute(session, true);
  }

  unmute(session: SIP.sessionDescriptionHandler) {
    this._toggleMute(session, false);
  }

  hold(session: SIP.sessionDescriptionHandler) {
    this.mute(session);

    return session.hold();
  }

  unhold(session: SIP.sessionDescriptionHandler) {
    this.unmute(session);

    return session.unhold();
  }

  sendDTMF(session: SIP.sessionDescriptionHandler, tone: string) {
    session.dtmf(tone);
  }

  message(destination: string, message: string) {
    this.userAgent.message(destination, message);
  }

  transfert(session: SIP.sessionDescriptionHandler, target: string) {
    this.hold(session);

    setTimeout(() => {
      session.refer(target);
      this.hangup(session);
    }, 50);
  }

  getState() {
    return states[this.userAgent.state];
  }

  close() {
    this._cleanupMedia();

    this.userAgent.transport.disconnect();
    this.userAgent.stop();
  }

  _isWeb() {
    return typeof this.audio === 'object' || typeof this.video === 'object';
  }

  _hasAudio() {
    return !!this.audio;
  }

  _hasVideo() {
    return !!this.video;
  }

  _hasLocalVideo() {
    return !!this.localVideo;
  }

  _fixLocalDescription(session: SIP.sessionDescriptionHandler) {
    if (!session.sessionDescriptionHandler) {
      return;
    }

    const pc = session.sessionDescriptionHandler.peerConnection;
    let count = 0;
    let fixed = false;

    pc.onicecandidate = () => {
      if (count > 0 && !fixed) {
        fixed = true;
        pc.createOffer()
          .then(
            (offer) => pc.setLocalDescription(offer),
            (error) => console.log(error)
          );
      }
      count += 1;
    }
  }

  _createWebRTCConfiguration() {
    return {
      authorizationUser: this.config.authorizationUser,
      displayName: this.config.displayName,
      hackIpInContact: true,
      hackWssInTransport: true,
      log: { builtinEnabled: false },
      password: this.config.password,
      uri: `${this.config.authorizationUser}@${this.config.host}`,
      transportOptions: {
        traceSip: false,
        wsServers: `wss://${this.config.host}:${this.config.port || 443}/api/asterisk/ws`
      },
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionOptions: {
          iceCheckingTimeout: 5000,
          constraints: {
            audio: this._hasAudio(),
            video: this._hasVideo()
          },
          rtcConfiguration: {
            rtcpMuxPolicy: 'require',
            iceServers: WebRTCClient.getIceServers(this.config.host),
            mandatory: {
              OfferToReceiveAudio: this._hasAudio(),
              OfferToReceiveVideo: this._hasVideo()
            }
          }
        }
      }
    };
  }

  _getMediaConfiguration() {
    return {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: this._hasAudio(),
          video: this._hasVideo()
        },
        RTCOfferOptions: {
          mandatory: {
            OfferToReceiveAudio: this._hasAudio(),
            OfferToReceiveVideo: this._hasVideo()
          }
        }
      }
    };
  }

  _setupSession(session: SIP.sessionDescriptionHandler) {
    session.on('accepted', () => this._onAccepted(session));
  }

  _onAccepted(session: SIP.sessionDescriptionHandler) {
    this._setupLocalMedia(session);
    this._setupRemoteMedia(session);

    session.sessionDescriptionHandler.on('addTrack', () => {
      this._setupRemoteMedia(session);
    });

    session.sessionDescriptionHandler.on('addStream', () => {
      this._setupRemoteMedia(session);
    });

    this.callbacksHandler.triggerCallback('accepted', session);
  }

  _setupRemoteMedia(session: SIP.sessionDescriptionHandler) {
    // If there is a video track, it will attach the video and audio to the same element
    const pc = session.sessionDescriptionHandler.peerConnection;
    let remoteStream;

    if (pc.getReceivers) {
      remoteStream = typeof global !== 'undefined' ? new global.window.MediaStream() : new window.MediaStream();
      pc.getReceivers().forEach(receiver => {
        const { track } = receiver;
        if (track) {
          remoteStream.addTrack(track);
        }
      });
    } else {
      [remoteStream] = pc.getRemoteStreams();
    }

    if (this._hasVideo() && this._isWeb()) {
      this.video.srcObject = remoteStream;
      this.video.play();
    } else if (this._hasAudio() && this._isWeb()) {
      this.audio.srcObject = remoteStream;
      this.audio.play();
    }
  }

  _setupLocalMedia(session: SIP.sessionDescriptionHandler) {
    if (!this.localVideo) {
      return;
    }

    const pc = session.sessionDescriptionHandler.peerConnection;
    let localStream;

    if (pc.getSenders) {
      localStream = typeof global !== 'undefined' ? new global.window.MediaStream() : new window.MediaStream();
      pc.getSenders().forEach(sender => {
        const { track } = sender;
        if (track && track.kind === 'video') {
          localStream.addTrack(track);
        }
      });
    } else {
      [localStream] = pc.getLocalStreams();
    }

    this.localVideo.srcObject = localStream;
    this.localVideo.volume = 0;
    this.localVideo.play();
  }

  _cleanupMedia() {
    if (this.video && this._isWeb()) {
      this.video.srcObject = null;
      this.video.pause();

      if (this.localVideo) {
        this.localVideo.srcObject = null;
        this.localVideo.pause();
      }
    }

    if (this.audio && this._isWeb()) {
      this.audio.srcObject = null;
      this.audio.pause();
    }
  }

  _toggleMute(session: SIP.sessionDescriptionHandler, mute: boolean) {
    const pc = session.sessionDescriptionHandler.peerConnection;

    if (pc.getSenders) {
      pc.getSenders().forEach(sender => {
        if (sender.track) {
          // eslint-disable-next-line
          sender.track.enabled = !mute;
        }
      });
    } else {
      pc.getLocalStreams().forEach(stream => {
        stream.getAudioTracks().forEach(track => {
          // eslint-disable-next-line
          track.enabled = !mute;
        });
        stream.getVideoTracks().forEach(track => {
          // eslint-disable-next-line
          track.enabled = !mute;
        });
      });
    }
  }
}
