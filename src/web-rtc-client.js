// @flow
/* eslint-disable class-methods-use-this */
/* global window, document, navigator */
import 'webrtc-adapter';
import SIP from 'sip.js';
import Emitter from './utils/Emitter';

import once from './utils/once';

import MobileSessionDescriptionHandler from './lib/MobileSessionDescriptionHandler';

const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];
const events = [
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
const transportEvents = [
  'connected',
  'disconnected',
  'transportError',
  'message',
  'closed',
  'keepAliveDebounceTimeout'
];
const MAX_MERGE_SESSIONS = 4;

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
  media: MediaConfig,
  maxMergeSessions: number,
  iceCheckingTimeout: ?number,
  log?: Object
};

// @see https://github.com/onsip/SIP.js/blob/master/src/Web/Simple.js
export default class WebRTCClient extends Emitter {
  config: WebRtcConfig;
  userAgent: SIP.UA;
  hasAudio: boolean;
  audio: Object;
  audioElements: { [string]: HTMLAudioElement };
  video: Object & boolean;
  localVideo: ?Object & ?boolean;
  audioContext: ?AudioContext;
  audioStreams: Object;
  mergeDestination: ?MediaStreamAudioDestinationNode;

  static isAPrivateIp(ip: string): boolean {
    const regex = /^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\..*/;
    return regex.exec(ip) == null;
  }

  static getIceServers(ip: string): Array<{ urls: Array<string> }> {
    if (WebRTCClient.isAPrivateIp(ip)) {
      return [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun4.l.google.com:19302']
        }
      ];
    }
    return [];
  }

  constructor(config: WebRtcConfig) {
    super();
    this.config = config;

    this.configureMedia(config.media);
    this.userAgent = this.createUserAgent();
  }

  configureMedia(media: MediaConfig) {
    this.hasAudio = !!media.audio;
    this.video = media.video;
    this.audio = media.audio;
    this.localVideo = media.localVideo;
    this.audioContext = this._isWeb() ? new (window.AudioContext || window.webkitAudioContext)() : null;
    this.audioStreams = {};
    this.audioElements = {};
  }

  createUserAgent(): SIP.UA {
    const webRTCConfiguration = this._createWebRTCConfiguration();
    const userAgent = new SIP.UA(webRTCConfiguration);

    events
      .filter(eventName => eventName !== 'invite')
      .forEach(eventName => {
        userAgent.on(eventName, event => {
          this.eventEmitter.emit(eventName, event);
        });
      });

    // Particular case for `invite` event
    userAgent.on('invite', (session: SIP.sessionDescriptionHandler) => {
      this._setupSession(session);
      this._fixLocalDescription(session, 'answer');

      this.eventEmitter.emit('invite', session);
    });

    transportEvents.forEach(eventName => {
      userAgent.transport.on(eventName, event => {
        this.eventEmitter.emit(eventName, event);
      });
    });

    return userAgent;
  }

  isRegistered(): Boolean {
    return this.userAgent && this.userAgent.isRegistered();
  }

  register() {
    if (!this.userAgent) {
      return;
    }

    this.userAgent.register();
  }

  unregister() {
    if (!this.userAgent) {
      return;
    }

    this.userAgent.unregister();
  }

  call(number: string): SIP.InviteClientContext {
    const context = this.userAgent.invite(number, this._getMediaConfiguration());

    this._setupSession(context);

    return context;
  }

  answer(session: SIP.sessionDescriptionHandler) {
    return session.accept(this._getMediaConfiguration());
  }

  hangup(session: SIP.sessionDescriptionHandler) {
    if ('stop' in session) {
      session.stop();
    }

    if (session.id in this.audioStreams) {
      this.removeFromMerge(session);
    }

    if (session.hasAnswer && session.bye) {
      return session.bye();
    }

    if (!session.hasAnswer && session.cancel) {
      return session.cancel();
    }

    if (session.reject) {
      return session.reject();
    }

    this._cleanupMedia(session);

    return null;
  }

  reject(session: SIP.sessionDescriptionHandler) {
    return session.reject();
  }

  getNumber(session: SIP.sessionDescriptionHandler): ?String {
    if (!session) {
      return null;
    }

    // eslint-disable-next-line
    return session.remoteIdentity.uri._normal.user;
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
    return session.dtmf(tone);
  }

  message(destination: string, message: string) {
    return this.userAgent.message(destination, message);
  }

  transfer(session: SIP.sessionDescriptionHandler, target: string) {
    this.hold(session);

    setTimeout(() => {
      session.refer(target);
      this.hangup(session);
    }, 50);
  }

  // check https://sipjs.com/api/0.12.0/refer/referClientContext/
  atxfer(session: SIP.sessionDescriptionHandler) {
    this.hold(session);

    return {
      init: (target: string) => this.call(target),
      complete: (newSession: SIP.sessionDescriptionHandler) => {
        this.unhold(session);

        setTimeout(() => {
          newSession.refer(session);
          this.hangup(session);
        }, 50);
      },
      cancel: (newSession: SIP.sessionDescriptionHandler) => {
        this.hangup(newSession);
        this.unhold(session);
      }
    };
  }

  merge(sessions: Array<SIP.InviteClientContext>): Array<Promise<boolean>> {
    this._checkMaxMergeSessions(sessions.length);
    if (this.audioContext) {
      this.mergeDestination = this.audioContext.createMediaStreamDestination();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return sessions.map(this.addToMerge.bind(this));
  }

  addToMerge(session: SIP.InviteClientContext): Promise<boolean> {
    this._checkMaxMergeSessions(Object.keys(this.audioStreams).length + 1);

    const isFirefox = this._isWeb() && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const sdh = session.sessionDescriptionHandler;
    const pc = sdh.peerConnection;

    const bindStreams = remoteStream => {
      const localStream = pc.getLocalStreams()[0];
      const localAudioSource = this._addAudioStream(localStream);
      const remoteAudioSource = this._addAudioStream(remoteStream);

      pc.removeStream(remoteStream);
      pc.removeStream(localStream);
      if (this.mergeDestination) {
        pc.addStream(this.mergeDestination.stream);
      }

      return pc.createOffer(this._getRtcOptions()).then(offer => {
        this.audioStreams[session.id] = { localAudioSource, remoteAudioSource };

        pc.setLocalDescription(offer);
      });
    };

    if (session.local_hold && !isFirefox) {
      this.unhold(session);

      // When call is hold we lost the current track. Wait for another one.
      return sdh.once('addTrack', e => bindStreams(e.streams[0]));
    }

    return bindStreams(pc.getRemoteStreams()[0]);
  }

  removeFromMerge(session: SIP.InviteClientContext, shouldHold: boolean = true) {
    const sdh = session.sessionDescriptionHandler;
    const pc = sdh.peerConnection;
    const { localAudioSource, remoteAudioSource } = this.audioStreams[session.id];

    remoteAudioSource.disconnect(this.mergeDestination);
    localAudioSource.disconnect(this.mergeDestination);

    if (this.audioContext) {
      const newDestination = this.audioContext.createMediaStreamDestination();
      localAudioSource.connect(newDestination);
      remoteAudioSource.connect(newDestination);

      if (pc.signalingState === 'closed' || pc.iceConnectionState === 'closed') {
        return null;
      }

      if (this.mergeDestination) {
        pc.removeStream(this.mergeDestination.stream);
      }
      pc.addStream(newDestination.stream);
    }

    delete this.audioStreams[session.id];

    return pc.createOffer(this._getRtcOptions()).then(offer => {
      const result = pc.setLocalDescription(offer);

      if (shouldHold) {
        this.hold(session);
      }

      return result;
    });
  }

  unmerge(sessions: Array<SIP.InviteClientContext>): Promise<boolean> {
    const nbSessions = sessions.length;

    const promises = sessions.map((session, i) => this.removeFromMerge(session, i < nbSessions - 1));

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          this.mergeDestination = null;
          resolve(true);
        })
        .catch(reject);
    });
  }

  getState() {
    return states[this.userAgent.state];
  }

  getContactIdentifier() {
    return this.userAgent ? `${this.userAgent.configuration.contactName}/${this.userAgent.contact.uri}` : null;
  }

  close() {
    this._cleanupMedia();

    (Object.values(this.audioElements): any).forEach((audioElement: HTMLAudioElement) => {
      // eslint-disable-next-line
      audioElement.srcObject = null;
      audioElement.pause();
    });

    this.audioElements = {};

    this.userAgent.transport.disconnect();

    return this.userAgent.stop();
  }

  changeAudioOutputDevice(id: string) {
    Object.values(this.audioElements).forEach(audioElement => {
      // `setSinkId` method is not included in any flow type definitions for HTMLAudioElements but is a valid method
      // audioElement is an array of HTMLAudioElements, and HTMLAudioElement inherits the method from HTMLMediaElement
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId

      // $FlowFixMe
      if (audioElement.setSinkId) {
        audioElement.setSinkId(id);
      }
    });
  }

  _checkMaxMergeSessions(nbSessions: number) {
    if (nbSessions < MAX_MERGE_SESSIONS) {
      return;
    }

    console.warn(
      `Merging more than ${MAX_MERGE_SESSIONS} session is not recommended, it will consume too many resources.`
    );
  }

  _fixLocalDescription(context: SIP.InviteClientContext, direction: string) {
    const eventName = direction === 'answer' ? 'iceGatheringComplete' : 'iceCandidate';
    context.on(
      'SessionDescriptionHandler-created',
      once(sdh => {
        sdh.on(
          eventName,
          once(() => {
            const pc = sdh.peerConnection;
            const constraints = this._getRtcOptions();
            pc.createOffer(constraints).then(offer => pc.setLocalDescription(offer));
          })
        );
      })
    );
  }

  _isWeb() {
    return typeof window === 'object' && typeof document === 'object';
  }

  _hasAudio() {
    return this.hasAudio;
  }

  _hasVideo() {
    return !!this.video;
  }

  _hasLocalVideo() {
    return !!this.localVideo;
  }

  _createWebRTCConfiguration() {
    const config: Object = {
      authorizationUser: this.config.authorizationUser,
      displayName: this.config.displayName,
      hackIpInContact: true,
      hackWssInTransport: true,
      log: this.config.log || { builtinEnabled: false },
      password: this.config.password,
      uri: `${this.config.authorizationUser}@${this.config.host}`,
      transportOptions: {
        traceSip: false,
        wsServers: `wss://${this.config.host}:${this.config.port || 443}/api/asterisk/ws`
      },
      sessionDescriptionHandlerFactoryOptions: {
        constraints: {
          audio: this.audio,
          video: this.video
        },
        peerConnectionOptions: {
          iceCheckingTimeout: this.config.iceCheckingTimeout || 5000,
          rtcConfiguration: {
            rtcpMuxPolicy: 'require',
            bundlePolicy: 'max-compat',
            iceServers: WebRTCClient.getIceServers(this.config.host),
            ...this._getRtcOptions()
          }
        }
      }
    };

    // Use custom SessionDescription handler for mobile
    if (!this._isWeb()) {
      config.sessionDescriptionHandlerFactory = MobileSessionDescriptionHandler(SIP).defaultFactory;
      config.registerOptions = {
        extraContactHeaderParams: ['mobility=mobile']
      };
    }

    return config;
  }

  _getRtcOptions() {
    return {
      mandatory: {
        OfferToReceiveAudio: this._hasAudio(),
        OfferToReceiveVideo: this._hasVideo()
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

    session.on('terminated', () => {
      if ('stop' in session) {
        session.stop();
      }

      if (session.id in this.audioStreams) {
        this.removeFromMerge(session);
      }
    });

    session.on('SessionDescriptionHandler-created', sdh => {
      sdh.on('userMedia', stream => {
        // eslint-disable-next-line
        session.stop = () => {
          stream.getAudioTracks().forEach(track => {
            track.stop();
          });
        };
      });
    });
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

    this.eventEmitter.emit('accepted', session);
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
      const audio = this.audioElements[session.id];
      audio.srcObject = remoteStream;
      audio.play();
    }
  }

  _addAudioStream(mediaStream: MediaStream) {
    if (!this.audioContext) {
      return null;
    }
    const audioSource = this.audioContext.createMediaStreamSource(mediaStream);
    if (this.mergeDestination) {
      audioSource.connect(this.mergeDestination);
    }

    return audioSource;
  }

  _setupLocalMedia(session: SIP.sessionDescriptionHandler) {
    // Safari hack, because you cannot call .play() from a non user action
    if (this._hasAudio() && this._isWeb()) {
      const audio = document.createElement('audio');
      if (document.body) {
        document.body.appendChild(audio);
      }
      this.audioElements[session.id] = audio;
    }
    if (this.video && this._isWeb()) {
      this.video.autoplay = true;
    }

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

    if (this._isWeb() && this.localVideo) {
      this.localVideo.srcObject = localStream;
      this.localVideo.volume = 0;
      this.localVideo.autoplay = true;
      this.localVideo.play();
    }
  }

  _cleanupMedia(session: ?SIP.sessionDescriptionHandler) {
    if (this.video && this._isWeb()) {
      this.video.srcObject = null;
      this.video.pause();

      if (this.localVideo) {
        this.localVideo.srcObject = null;
        this.localVideo.pause();
      }
    }

    const cleanAudio = id => {
      const element = this.audioElements[id];

      element.pause();
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      element.srcObject = null;

      delete this.audioElements[id];
    };

    if (this._hasAudio() && this._isWeb()) {
      if (session) {
        cleanAudio(session.id);
      } else {
        Object.keys(this.audioElements).forEach(sessionId => cleanAudio(sessionId));
      }
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
