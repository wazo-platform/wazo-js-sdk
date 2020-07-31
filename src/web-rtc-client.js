// @flow
/* eslint-disable class-methods-use-this */
/* global window, document, navigator */
import 'webrtc-adapter';
import { SessionStatus } from 'sip.js/lib/Enums';
import { UA } from 'sip.js/lib/UA';
import { Utils } from 'sip.js/lib/Utils';
import { Exceptions } from 'sip.js/lib/Exceptions';
import { Modifiers } from 'sip.js/lib/Web';
import { URI } from 'sip.js/lib/core/messages/uri';
import { TransportStatus } from 'sip.js/lib/Web/Transport';
import SIP from 'sip.js';

import Emitter from './utils/Emitter';
import Session from './domain/Session';
import ApiClient from './api-client';
import IssueReporter from './service/IssueReporter';
import Heartbeat from './utils/Heartbeat';

import MobileSessionDescriptionHandler from './lib/MobileSessionDescriptionHandler';

const SIPMethods = { Web: { Modifiers }, Utils, Exceptions };

// We need to replace 0.0.0.0 to 127.0.0.1 in the sdp to avoid MOH during a createOffer.
const replaceLocalIpModifier = (description: Object) => Promise.resolve({
  ...description,
  sdp: description.sdp.replace('c=IN IP4 0.0.0.0', 'c=IN IP4 127.0.0.1'),
});

const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];
export const events = [
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
  'message', // i believe this is overwritten by its namesake in transportEvents
];
export const transportEvents = [
  'connected',
  'disconnected',
  'transportError',
  'message',
  'closed',
  'keepAliveDebounceTimeout',
];
const MAX_MERGE_SESSIONS = 4;

type MediaConfig = {
  audio: Object & boolean,
  video: Object & boolean,
  localVideo?: Object & boolean,
};

type WebRtcConfig = {
  displayName: string,
  host: string,
  port?: number,
  authorizationUser: ?string,
  password: ?string,
  uri: string,
  media: MediaConfig,
  iceCheckingTimeout: ?number,
  log?: Object,
  audioOutputDeviceId?: string,
  audioOutputVolume?: number;
  userAgentString?: string,
  heartbeatDelay: number,
  heartbeatTimeout: number,
  maxHeartbeats: number,
};

// @see https://github.com/onsip/SIP.js/blob/master/src/Web/Simple.js
export default class WebRTCClient extends Emitter {
  config: WebRtcConfig;
  uaConfigOverrides: ?Object;
  userAgent: UA;
  hasAudio: boolean;
  audio: Object | boolean;
  audioElements: { [string]: HTMLAudioElement };
  video: Object | boolean;
  videoEnabled: boolean;
  localVideo: ?Object & ?boolean;
  audioContext: ?AudioContext;
  audioStreams: Object;
  audioMixer: ?any /* ChannelMerger */;
  audioOutputDeviceId: ?string;
  audioOutputVolume: number;
  videoSessions: Object;
  connectionPromise: ?Promise<void>;
  _boundOnHeartbeat: Function;
  heartbeat: Heartbeat;

  static isAPrivateIp(ip: string): boolean {
    const regex = /^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\..*/;
    return regex.exec(ip) == null;
  }

  static getIceServers(ip: string): Array<{ urls: Array<string> }> {
    if (WebRTCClient.isAPrivateIp(ip)) {
      return [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun4.l.google.com:19302'],
        },
      ];
    }
    return [];
  }

  constructor(config: WebRtcConfig, session: ?Session, uaConfigOverrides: ?Object) {
    super();
    this.uaConfigOverrides = uaConfigOverrides;
    this.config = config;
    this._buildConfig(config, session).then((newConfig: WebRtcConfig) => {
      this.config = newConfig;
      this.userAgent = this.createUserAgent(uaConfigOverrides);
      this._bindUserAgentEvents();
    });

    this.audioOutputDeviceId = config.audioOutputDeviceId;
    this.audioOutputVolume = config.audioOutputVolume || 1;

    this.configureMedia(config.media);
    this.setMediaConstraints({ audio: config.media.audio, video: config.media.video });

    this.videoSessions = {};
    this.connectionPromise = null;

    this._boundOnHeartbeat = this._onHeartbeat.bind(this);
    this.heartbeat = new Heartbeat(config.heartbeatDelay, config.heartbeatTimeout, config.maxHeartbeats);
    this.heartbeat.setSendHeartbeat(this.pingServer.bind(this));
    this.heartbeat.setOnHeartbeatTimeout(this._onHeartbeatTimeout.bind(this));
  }

  configureMedia(media: MediaConfig) {
    this.hasAudio = !!media.audio;
    this.localVideo = media.localVideo;
    this.audioContext = this._isWeb() ? new (window.AudioContext || window.webkitAudioContext)() : null;
    this.audioStreams = {};
    this.audioElements = {};
  }

  setMediaConstraints(media: MediaStreamConstraints) {
    this.video = media.video;
    this.audio = media.audio;
  }

  createUserAgent(configOverrides: ?Object): UA {
    const webRTCConfiguration = this._createWebRTCConfiguration(configOverrides);

    return new UA(webRTCConfiguration);
  }

  pingServer() {
    if (!this.isConnected()) {
      return;
    }

    try {
      this.userAgent.request('OPTIONS', new URI('', '', this.config.host));
    } catch (_) {
      // Nothing to do
    }
  }

  isConnected() {
    return this.userAgent && this.userAgent.transport.isConnected();
  }

  isRegistered(): boolean {
    return this.userAgent && this.userAgent.transport.isConnected() && this.userAgent.isRegistered();
  }

  register() {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient] register', !!this.userAgent, this.isRegistered());
    if (!this.userAgent) {
      IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][register] recreating UA');
      this.userAgent = this.createUserAgent(this.uaConfigOverrides);
    }
    if (!this.userAgent || this.isRegistered()) {
      return;
    }
    this._bindUserAgentEvents();

    this._connectIfNeeded().then(this.userAgent.register.bind(this.userAgent));
  }

  unregister() {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient] unregister', !!this.userAgent);
    if (!this.userAgent) {
      return;
    }

    this.userAgent.unregister();
  }

  stop() {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient] stop', !!this.userAgent);
    if (!this.userAgent) {
      return;
    }

    try {
      this.userAgent.stop();
    } catch (e) {
      IssueReporter.log(IssueReporter.WARN, '[WebRtcClient] close error', e.message, e.stack);
    }
  }

  // eslint-disable-next-line no-unused-vars
  sessionWantsToDoVideo(session: SIP.sessionDescriptionHandler) {
    const sdp = session.request.body;
    const sessionHasVideo = /\r\nm=video /.test(sdp);

    return sessionHasVideo;
  }

  call(number: string, enableVideo?: boolean): SIP.InviteClientContext {
    this.changeVideo(enableVideo || false);
    const context = this.userAgent.invite(number, this._getMediaConfiguration(enableVideo || false));

    if (!enableVideo) {
      context.modifiers.push(SIPMethods.Web.Modifiers.stripVideo);
    }

    this._setupSession(context);

    return context;
  }

  answer(session: SIP.sessionDescriptionHandler, enableVideo?: boolean) {
    this.changeVideo(enableVideo || false);
    return session.accept(this._getMediaConfiguration(enableVideo || false));
  }

  hangup(session: SIP.sessionDescriptionHandler | SIP.InviteServerContext) {
    try {
      this._cleanupMedia(session);
      const { status } = session;

      if (this.getSipSessionId(session) in this.audioStreams) {
        this.removeFromMerge(session);
      }

      this._cleanupMedia(session);

      // Check if sessionDescriptionHandler or InviteServerContext (ISC = outgoing call)
      const isISC = typeof session.cancel !== 'undefined';

      const cancel = () => {
        if (!session.isCanceled) {
          session.cancel();
        }
      };

      const reject = () => {
        // eslint-disable-next-line
        if (!session._canceled) {
          session.reject();
        }
      };

      const bye = () => session.bye && session.bye();

      const actions = {
        // Status 2 (STATUS_1XX_RECEIVED) : cancel
        [SessionStatus.STATUS_1XX_RECEIVED]: isISC ? cancel : reject,
        // Status 4 (STATUS_WAITING_FOR_ANSWER) : cancel
        [SessionStatus.STATUS_WAITING_FOR_ANSWER]: isISC ? cancel : reject,
        // Status 8 (STATUS_CANCELED) : nothing to do
        [SessionStatus.STATUS_CANCELED]: null,
        // Status 9 (STATUS_TERMINATED): nothing to do
        [SessionStatus.STATUS_TERMINATED]: null,
        // Status 10 (STATUS_ANSWERED_WAITING_FOR_PRACK): bye
        [SessionStatus.STATUS_ANSWERED_WAITING_FOR_PRACK]: bye, // bye is the same for sdh ou isc
        // Status 12 (STATUS_CONFIRMED): bye
        [SessionStatus.STATUS_CONFIRMED]: bye, // bye is the same for sdh ou isc
      };

      // Handle different session status
      if (actions[status]) {
        return actions[status]();
      }

      // For InviteServerContext
      if (isISC) {
        if (session.hasAnswer && session.bye) {
          return session.bye();
        }

        // For InviteServerContext
        if (!session.hasAnswer) {
          return cancel();
        }
      }

      if ('stop' in session) {
        session.stop();
      }

      return bye();
    } catch (error) {
      console.warn('WebRtcClient.hangup error', error);
    }

    return null;
  }

  reject(session: SIP.sessionDescriptionHandler) {
    try {
      return session.reject ? session.reject() : session.cancel();
    } catch (e) {
      console.warn('Error when rejecting call', e.message, e.stack);
    }
  }

  getNumber(session: SIP.sessionDescriptionHandler): ?String {
    if (!session) {
      return null;
    }

    // eslint-disable-next-line
    return session.remoteIdentity.uri._normal.user;
  }

  mute(session: SIP.sessionDescriptionHandler) {
    this._toggleAudio(session, true);
  }

  unmute(session: SIP.sessionDescriptionHandler) {
    this._toggleAudio(session, false);
  }

  toggleCameraOn(session: SIP.sessionDescriptionHandler) {
    this._toggleVideo(session, false);
  }

  toggleCameraOff(session: SIP.sessionDescriptionHandler) {
    this._toggleVideo(session, true);
  }

  hold(session: SIP.sessionDescriptionHandler) {
    this.mute(session);

    return session.hold(this._getMediaConfiguration(this.videoEnabled));
  }

  unhold(session: SIP.sessionDescriptionHandler) {
    this.unmute(session);

    return session.unhold(this._getMediaConfiguration(this.videoEnabled));
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
      },
    };
  }

  merge(sessions: Array<SIP.InviteClientContext>): Array<Promise<boolean>> {
    this._checkMaxMergeSessions(sessions.length);
    if (this.audioContext) {
      this.audioMixer = this.audioContext.createChannelMerger(10);
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return sessions.map(this.addToMerge.bind(this));
  }

  addToMerge(session: SIP.InviteClientContext) {
    this._checkMaxMergeSessions(Object.keys(this.audioStreams).length + 1);

    const sdh = session.sessionDescriptionHandler;
    const pc = sdh.peerConnection;

    const bindStreams = remoteStream => {
      const localStream = this.getLocalStream(pc);
      if (!this.audioContext || !this.audioMixer) {
        return;
      }

      const localAudioSource = this.audioContext.createMediaStreamSource(localStream);
      // $FlowFixMe
      localAudioSource.connect(this.audioMixer);

      const remoteAudioSource = this._addAudioStream(remoteStream);

      // $FlowFixMe
      const audioPeerDestination = this.audioContext.createMediaStreamDestination();
      // $FlowFixMe
      this.audioMixer.connect(audioPeerDestination);

      this.audioStreams[this.getSipSessionId(session)] = { localAudioSource, remoteAudioSource };

      const sender = pc.getSenders().filter(s => s.track.kind === 'audio')[0];
      if (sender) {
        sender.replaceTrack(audioPeerDestination.stream.getAudioTracks()[0]);
      }
    };

    if (session.localHold && !this.isFirefox()) {
      this.unhold(session);

      // When call is hold we lost the current track. Wait for another one.
      return sdh.once('addTrack', e => bindStreams(e.streams[0]));
    }

    return bindStreams(this._getRemoteStream(pc));
  }

  removeFromMerge(session: SIP.InviteClientContext, shouldHold: boolean = true) {
    const sdh = session.sessionDescriptionHandler;
    const pc = sdh.peerConnection;
    const { localAudioSource, remoteAudioSource } = this.audioStreams[this.getSipSessionId(session)];

    if (remoteAudioSource) {
      remoteAudioSource.disconnect(this.audioMixer);
    }
    localAudioSource.disconnect(this.audioMixer);

    if (this.audioContext) {
      const newDestination = this.audioContext.createMediaStreamDestination();
      localAudioSource.connect(newDestination);
      if (remoteAudioSource) {
        remoteAudioSource.connect(newDestination);
      }

      if (pc.signalingState === 'closed' || pc.iceConnectionState === 'closed') {
        return null;
      }

    }

    delete this.audioStreams[this.getSipSessionId(session)];

    if (shouldHold) {
      this.hold(session);
    }
  }

  unmerge(sessions: Array<SIP.InviteClientContext>): Promise<boolean> {
    const nbSessions = sessions.length;

    const promises = sessions.map((session, i) => this.removeFromMerge(session, i < nbSessions - 1));

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          this.audioMixer = null;
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

  isFirefox(): boolean {
    return this._isWeb() && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  close() {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient] close', !!this.userAgent);
    this._cleanupMedia();
    this.connectionPromise = null;

    (Object.values(this.audioElements): any).forEach((audioElement: HTMLAudioElement) => {
      // eslint-disable-next-line
      audioElement.srcObject = null;
      audioElement.pause();
    });

    this.audioElements = {};
    if (!this.userAgent) {
      return null;
    }

    this.stopHeartbeat();

    if (this.userAgent.transport) {
      this.userAgent.transport.disconnect();
    }

    this.userAgent.removeAllListeners();

    try {
      this.userAgent.stop();
    } catch (_) {
      // Avoid to raise exception when trying to close with hanged-up sessions remaining
      // eg: "INVITE not rejectable in state Completed"
    }
    this.userAgent = null;
  }

  changeAudioOutputVolume(volume: number) {
    Object.values(this.audioElements).forEach(audioElement => {
      if (audioElement instanceof HTMLAudioElement) {
        // eslint-disable-next-line no-param-reassign
        audioElement.volume = volume;
      }
    });
    this.audioOutputVolume = volume;
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

  changeAudioInputDevice(id: string, session: ?SIP.InviteClientContext) {
    const currentId = this.getAudioDeviceId();
    if (id === currentId) {
      return;
    }

    if (session) {
      const sdh = session.sessionDescriptionHandler;
      const pc = sdh.peerConnection;

      // $FlowFixMe
      navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: id } } }).then(async stream => {
        const audioTrack = stream.getAudioTracks()[0];
        const sender = pc.getSenders().find(s => s.track.kind === audioTrack.kind);

        if (sender) {
          sender.replaceTrack(audioTrack);
        }

        // let's update the local value
        if (this.audio && this.audio.deviceId) {
          // $FlowFixMe
          this.audio.deviceId.exact = id;
        }
      });
    }
  }

  changeVideoInputDevice(id: string, session: ?SIP.InviteClientContext) {
    const currentId = this.getVideoDeviceId();
    if (id === currentId) {
      return;
    }

    if (session) {
      const sdh = session.sessionDescriptionHandler;
      const pc = sdh.peerConnection;

      // $FlowFixMe
      navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: id } } }).then(async stream => {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = pc.getSenders().find(s => s.track.kind === videoTrack.kind);

        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        // let's update the local value
        if (this.video && this.video.deviceId) {
          // $FlowFixMe
          this.video.deviceId.exact = id;
        }

        // let's update the local stream
        this._addLocalToVideoSession(this.getSipSessionId(session), stream);
      });
    }
  }

  getAudioDeviceId(): ?string {
    // $FlowFixMe
    return this.audio && typeof this.audio === 'object' && 'deviceId' in this.audio ? this.audio.deviceId.exact : null;
  }

  getVideoDeviceId(): ?string {
    // $FlowFixMe
    return this.video && typeof this.video === 'object' && 'deviceId' in this.video ? this.video.deviceId.exact : null;
  }

  changeVideo(enabled: boolean) {
    this.videoEnabled = enabled;
  }

  sessionHasLocalVideo(sessionId: string): boolean {
    const streams = this.videoSessions[sessionId];
    if (!streams || !streams.local) {
      return false;
    }
    return !!streams.local.getVideoTracks().length;
  }

  sessionHasRemoteVideo(sessionId: string): boolean {
    const streams = this.videoSessions[sessionId];
    if (!streams || !streams.remotes) {
      return false;
    }
    return streams.remotes.some(remote => !!remote.getVideoTracks().length);
  }

  sessionHasVideo(sessionId: string) {
    return this.sessionHasLocalVideo(sessionId) || this.sessionHasRemoteVideo(sessionId);
  }

  sessionHasAudio(session: SIP.sessionDescriptionHandler) {
    const pc = session.sessionDescriptionHandler.peerConnection;

    if (pc.getSenders) {
      const senders = pc.getSenders();

      return senders.some(sender => sender.track && sender.track.kind === 'audio' && sender.track.enabled);
    }

    const localStream = this.getLocalStream(pc);
    const audioTracks = localStream.getAudioTracks();

    return audioTracks.some(track => track.kind === 'audio' && track.enabled);
  }

  getRemoteVideoStreamsForSession(sessionId: string) {
    const streams = this.videoSessions[sessionId];
    if (!streams || !streams.remotes) {
      return [];
    }
    return streams.remotes;
  }

  getSipSessionId(sipSession: ?SIP.sessionDescriptionHandler): string {
    return (sipSession && sipSession.request && sipSession.request.callId) || (sipSession && sipSession.id) || '';
  }

  async waitForRegister() {
    return new Promise(resolve => this.on('registered', resolve));
  }

  _checkMaxMergeSessions(nbSessions: number) {
    if (nbSessions < MAX_MERGE_SESSIONS) {
      return;
    }

    console.warn(
      `Merging more than ${MAX_MERGE_SESSIONS} session is not recommended, it will consume too many resources.`,
    );
  }

  _isWeb() {
    return typeof window === 'object' && typeof document === 'object';
  }

  _hasAudio() {
    return this.hasAudio;
  }

  _getAudioConstraints() {
    return this.audio && this.audio.deviceId && this.audio.deviceId.exact ? this.audio : true;
  }

  _getVideoConstraints() {
    if (!this.videoEnabled) {
      return false;
    }
    return this.video && this.video.deviceId && this.video.deviceId.exact ? this.video : true;
  }

  _hasVideo() {
    return this.videoEnabled;
  }

  /**
   * @param pc RTCPeerConnection
   */
  getLocalStream(pc: any) {
    let localStream;

    if (pc.getSenders) {
      localStream = typeof global !== 'undefined' && global.window && global.window.MediaStream
        ? new global.window.MediaStream() : new window.MediaStream();

      pc.getSenders().forEach(sender => {
        const { track } = sender;
        if (track) {
          localStream.addTrack(track);
        }
      });
    } else {
      [localStream] = pc.getLocalStreams();
    }

    return localStream;
  }

  hasHeartbeat() {
    return this.heartbeat.hasHeartbeat;
  }

  startHeartbeat() {
    if (!this.userAgent) {
      this.heartbeat.stop();
      return;
    }

    this.userAgent.transport.off('message', this._boundOnHeartbeat);
    this.userAgent.transport.on('message', this._boundOnHeartbeat);

    this.heartbeat.start();
  }

  stopHeartbeat() {
    this.heartbeat.stop();
  }

  _onHeartbeat(message: string) {
    if (message.indexOf('200 OK') !== -1) {
      this.heartbeat.onHeartbeat();
    }
  }

  async _onHeartbeatTimeout() {
    if (this.userAgent.transport) {
      // Disconnect from WS and triggers events
      this.userAgent.transport.disconnect({ force: true });
      // Force `disconnected` to be called quickly when calling `onClose`
      this.userAgent.transport.disconnectDeferredResolve = null;
      // We have to trigger onClose manually or it can take too much time to be triggered by the transport.
      this.userAgent.transport.status = TransportStatus.STATUS_CLOSING;
      this.userAgent.transport.onClose({ code: 1000, reason: 'heartbeat failed' });
    }
  }

  _bindUserAgentEvents() {
    this.userAgent.removeAllListeners();

    events
      .filter(eventName => eventName !== 'invite' && eventName !== 'new')
      .forEach(eventName => this.userAgent.on(eventName, event => this.eventEmitter.emit(eventName, event)));

    // Particular case for `invite` event
    this.userAgent.on('invite', (session: SIP.sessionDescriptionHandler) => {
      this._setupSession(session);
      const shouldAutoAnswer = !!session.request.getHeader('alert-info');

      this.eventEmitter.emit('invite', session, this.sessionWantsToDoVideo(session), shouldAutoAnswer);
    });

    transportEvents.forEach(eventName => {
      this.userAgent.transport.on(eventName, event => {
        this.eventEmitter.emit(eventName, event);
      });
    });
  }

  _connectIfNeeded(): Promise<void> {
    return new Promise(resolve => {
      IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][_connectIfNeeded]', this.userAgent.transport.isConnected());
      if (!this.userAgent) {
        IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][_connectIfNeeded] recreating UA');
        this.userAgent = this.createUserAgent(this.uaConfigOverrides);
        this._bindUserAgentEvents();
      }

      if (!this.userAgent.transport.isConnected()) {
        if (this.connectionPromise) {
          return this.connectionPromise;
        }

        IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][_connectIfNeeded] connecting');
        this.userAgent.start();
        this.connectionPromise = new Promise(connectResolve => this.userAgent.transport.afterConnected(connectResolve));

        return this.connectionPromise;
      }

      return resolve();
    });
  }

  _initializeVideoSession(sessionId: string) {
    if (!this.videoSessions[sessionId]) {
      this.videoSessions[sessionId] = {
        local: null,
        remotes: [],
      };
    }
  }

  _buildConfig(config: WebRtcConfig, session: ?Session): Promise<WebRtcConfig> {
    // If no session provided, return the configuration directly
    if (!session) {
      return new Promise(resolve => resolve(config));
    }

    const client = new ApiClient({ server: config.host });
    client.setToken(session.token);
    client.setRefreshToken(session.refreshToken);

    return client.confd.getUserLineSipFromToken(session.uuid).then(sipLine => ({
      authorizationUser: sipLine.username,
      password: sipLine.secret,
      uri: `${sipLine.username}@${config.host}`,
      ...config,
    }));
  }

  _addLocalToVideoSession(sessionId: string, stream: any) {
    this._initializeVideoSession(sessionId);

    this.videoSessions[sessionId].local = stream;
  }

  _addRemoteToVideoSession(sessionId: string, stream: any) {
    this._initializeVideoSession(sessionId);

    this.videoSessions[sessionId].remotes.push(stream);
  }

  _hasLocalVideo() {
    return !!this.localVideo;
  }

  _createWebRTCConfiguration(configOverrides: Object = {}) {
    const config: Object = {
      authorizationUser: this.config.authorizationUser,
      displayName: this.config.displayName,
      hackIpInContact: true,
      hackWssInTransport: true,
      log: this.config.log || { builtinEnabled: false },
      password: this.config.password,
      uri: `${this.config.authorizationUser || ''}@${this.config.host}`,
      userAgentString: this.config.userAgentString || 'wazo-sdk',
      transportOptions: {
        maxReconnectionAttempts: 100000,
        reconnectionTimeout: 2,
        traceSip: configOverrides.traceSip || false,
        wsServers: `wss://${this.config.host}:${this.config.port || 443}/api/asterisk/ws`,
      },
      sessionDescriptionHandlerFactoryOptions: {
        modifiers: [replaceLocalIpModifier],
        alwaysAcquireMediaFirst: this.isFirefox(),
        constraints: {
          audio: this._getAudioConstraints(),
          video: this._getVideoConstraints(),
        },
        peerConnectionOptions: {
          iceCheckingTimeout: this.config.iceCheckingTimeout || 1000,
          rtcConfiguration: {
            rtcpMuxPolicy: 'require',
            iceServers: WebRTCClient.getIceServers(this.config.host),
            ...this._getRtcOptions(this.videoEnabled),
            ...configOverrides.peerConnectionOptions || {},
          },
        },
      },
    };

    // Use custom SessionDescription handler for mobile
    if (!this._isWeb()) {
      config.sessionDescriptionHandlerFactory = MobileSessionDescriptionHandler(SIPMethods).defaultFactory;
      config.registerOptions = {
        extraContactHeaderParams: ['mobility=mobile'],
      };
    }

    return { ...config, ...configOverrides };
  }

  // eslint-disable-next-line no-unused-vars
  _getRtcOptions(enableVideo: boolean) {
    return {
      mandatory: {
        OfferToReceiveAudio: this._hasAudio(),
        OfferToReceiveVideo: enableVideo,
      },
    };
  }

  _getMediaConfiguration(enableVideo: boolean) {
    return {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: this._getAudioConstraints(),
          video: this._getVideoConstraints(),
        },
        disableVideo: !enableVideo,
        RTCOfferOptions: {
          OfferToReceiveAudio: this._hasAudio(),
          OfferToReceiveVideo: enableVideo,
          mandatory: {
            OfferToReceiveAudio: this._hasAudio(),
            OfferToReceiveVideo: enableVideo,
          },
        },
      },
    };
  }

  _setupSession(session: SIP.sessionDescriptionHandler) {
    session.on('accepted', () => this._onAccepted(session));

    session.on('terminated', () => {
      if ('stop' in session) {
        session.stop();
      }

      if (this.getSipSessionId(session) in this.audioStreams) {
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
    const remoteStream = this._getRemoteStream(pc);

    if (this._hasVideo()) {
      this._addRemoteToVideoSession(this.getSipSessionId(session), remoteStream);
    }

    if (!this._isWeb()) {
      return;
    }

    const audio = this.audioElements[this.getSipSessionId(session)];
    audio.srcObject = remoteStream;
    audio.volume = this.audioOutputVolume;
    audio.play();
  }

  _addAudioStream(mediaStream: MediaStream) {
    if (!this.audioContext || !mediaStream) {
      return null;
    }
    const audioSource = this.audioContext.createMediaStreamSource(mediaStream);
    if (this.audioMixer) {
      audioSource.connect(this.audioMixer);
    }

    return audioSource;
  }

  _setupLocalMedia(session: SIP.sessionDescriptionHandler) {
    // Safari hack, because you cannot call .play() from a non user action
    if (this._hasAudio() && this._isWeb()) {
      const audio: any = document.createElement('audio');

      if (audio.setSinkId && this.audioOutputDeviceId) {
        audio.setSinkId(this.audioOutputDeviceId);
      }

      if (document.body) {
        document.body.appendChild(audio);
      }
      this.audioElements[this.getSipSessionId(session)] = audio;
    }

    if (!this._hasVideo()) {
      return;
    }

    const pc = session.sessionDescriptionHandler.peerConnection;
    const localStream = this.getLocalStream(pc);

    this._addLocalToVideoSession(this.getSipSessionId(session), localStream);
  }

  _cleanupMedia(session: ?SIP.sessionDescriptionHandler) {
    const sessionId = this.getSipSessionId(session);
    if (session && sessionId in this.videoSessions) {
      delete this.videoSessions[this.getSipSessionId(session)];
    }

    const cleanAudio = id => {
      const element = this.audioElements[id];
      if (!element) {
        return;
      }

      element.pause();
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      element.srcObject = null;

      delete this.audioElements[id];
    };

    if (this._hasAudio() && this._isWeb()) {
      if (session) {
        cleanAudio(this.getSipSessionId(session));
      } else {
        Object.keys(this.audioElements).forEach(id => cleanAudio(id));
      }
    }
  }

  _toggleAudio(session: SIP.sessionDescriptionHandler, muteAudio: boolean) {
    const pc = session.sessionDescriptionHandler ? session.sessionDescriptionHandler.peerConnection : null;
    if (!pc) {
      return;
    }

    if (pc.getSenders) {
      pc.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          // eslint-disable-next-line
          sender.track.enabled = !muteAudio;
        }
      });
    } else {
      pc.getLocalStreams().forEach(stream => {
        stream.getAudioTracks().forEach(track => {
          // eslint-disable-next-line
          track.enabled = !muteAudio;
        });
      });
    }
  }

  _toggleVideo(session: SIP.sessionDescriptionHandler, muteCamera: boolean) {
    const pc = session.sessionDescriptionHandler.peerConnection;

    if (pc.getSenders) {
      pc.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'video') {
          // eslint-disable-next-line
          sender.track.enabled = !muteCamera;
        }
      });
    } else {
      pc.getLocalStreams().forEach(stream => {
        stream.getVideoTracks().forEach(track => {
          // eslint-disable-next-line
          track.enabled = !muteCamera;
        });
      });
    }
  }

  /**
   * @param pc RTCPeerConnection
   */
  _getRemoteStream(pc: any) {
    let remoteStream;

    if (pc.getReceivers) {
      remoteStream = typeof global !== 'undefined' && global.window && global.window.MediaStream
        ? new global.window.MediaStream() : new window.MediaStream();
      pc.getReceivers().forEach(receiver => {
        const { track } = receiver;
        if (track) {
          remoteStream.addTrack(track);
        }
      });
    } else {
      [remoteStream] = pc.getRemoteStreams();
    }

    return remoteStream;
  }
}
