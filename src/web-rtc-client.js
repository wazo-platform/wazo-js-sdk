// @flow
/* eslint-disable class-methods-use-this, no-param-reassign */
/* global window, document, navigator */
import 'webrtc-adapter';
import type InviterInviteOptions from 'sip.js/lib/api/inviter-invite-options';
import type Invitation from 'sip.js/lib/api/invitation';
import type { IncomingResponse } from 'sip.js/lib/core/messages/incoming-response';
import type { Session } from 'sip.js/lib/core/session';
import type { SessionDialog } from 'sip.js/lib/core/dialogs/session-dialog';
import type { IncomingRequestMessage } from 'sip.js/lib/core/messages/incoming-request-message';
import type { SessionDescriptionHandlerFactoryOptions }
  from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-factory-options';
import type SessionDescriptionHandlerConfiguration
  from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration';

import { C } from 'sip.js/lib/core/messages/methods/constants';
import { URI } from 'sip.js/lib/grammar/uri';
import { Parser } from 'sip.js/lib/core/messages/parser';
import { UserAgent } from 'sip.js/lib/api/user-agent';
import { stripVideo } from 'sip.js/lib/platform/web/modifiers/modifiers';
import { Registerer } from 'sip.js/lib/api/registerer';
import { Inviter } from 'sip.js/lib/api/inviter';
import { Messager } from 'sip.js/lib/api/messager';
import { RegistererState } from 'sip.js/lib/api/registerer-state';
import { SessionState } from 'sip.js/lib/api/session-state';
import { TransportState } from 'sip.js/lib/api/transport-state';
import { holdModifier } from 'sip.js/lib/platform/web/modifiers';
import { defaultMediaStreamFactory }
  from 'sip.js/lib/platform/web/session-description-handler/media-stream-factory-default';
import { defaultPeerConnectionConfiguration }
  from 'sip.js/lib/platform/web/session-description-handler/peer-connection-configuration-default';

import WazoSessionDescriptionHandler from './lib/WazoSessionDescriptionHandler';
// import MobileSessionDescriptionHandler from './lib/MobileSessionDescriptionHandler';

import Emitter from './utils/Emitter';
import ApiClient from './api-client';
import IssueReporter from './service/IssueReporter';
import Heartbeat from './utils/Heartbeat';

// We need to replace 0.0.0.0 to 127.0.0.1 in the sdp to avoid MOH during a createOffer.
const replaceLocalIpModifier = (description: Object) => Promise.resolve({
  ...description,
  sdp: description.sdp.replace('c=IN IP4 0.0.0.0', 'c=IN IP4 127.0.0.1'),
});

const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];

// events
const REGISTERED = 'registered';
const UNREGISTERED = 'unregistered';
const REGISTRATION_FAILED = 'registrationFailed';
const INVITE = 'invite';
const CONNECTED = 'connected';
const DISCONNECTED = 'disconnected';
const TRANSPORT_ERROR = 'transportError';
const MESSAGE = 'message';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';
const ON_TRACK = 'onTrack';
const ON_REINVITE = 'reinvite';

export const events = [REGISTERED, UNREGISTERED, REGISTRATION_FAILED, INVITE];
export const transportEvents = [CONNECTED, DISCONNECTED, TRANSPORT_ERROR, MESSAGE];

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
  userAgent: UserAgent;
  registerer: Registerer;
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
  heldSessions: Object;
  connectionPromise: ?Promise<void>;
  _boundOnHeartbeat: Function;
  heartbeat: Heartbeat;
  heartbeatTimeoutCb: ?Function;

  attemptingReconnection: boolean;
  shouldBeConnected: boolean;

  // sugar
  ON_USER_AGENT: string;
  REGISTERED: string;
  UNREGISTERED: string;
  REGISTRATION_FAILED: string;
  INVITE: string;
  CONNECTED: string;
  DISCONNECTED: string;
  TRANSPORT_ERROR: string;
  MESSAGE: string;
  ACCEPTED: string;
  REJECTED: string;
  ON_TRACK: string;
  ON_REINVITE: string;

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
    });

    this.audioOutputDeviceId = config.audioOutputDeviceId;
    this.audioOutputVolume = config.audioOutputVolume || 1;

    this.configureMedia(config.media);
    this.setMediaConstraints({ audio: config.media.audio, video: config.media.video });

    this.videoSessions = {};
    this.heldSessions = {};
    this.connectionPromise = null;
    this.attemptingReconnection = false;
    this.shouldBeConnected = false;

    this._boundOnHeartbeat = this._onHeartbeat.bind(this);
    this.heartbeat = new Heartbeat(config.heartbeatDelay, config.heartbeatTimeout, config.maxHeartbeats);
    this.heartbeat.setSendHeartbeat(this.pingServer.bind(this));
    this.heartbeat.setOnHeartbeatTimeout(this._onHeartbeatTimeout.bind(this));

    // sugar
    this.REGISTERED = REGISTERED;
    this.UNREGISTERED = UNREGISTERED;
    this.REGISTRATION_FAILED = REGISTRATION_FAILED;
    this.INVITE = INVITE;
    this.CONNECTED = CONNECTED;
    this.DISCONNECTED = DISCONNECTED;
    this.TRANSPORT_ERROR = TRANSPORT_ERROR;
    this.MESSAGE = MESSAGE;
    this.ACCEPTED = ACCEPTED;
    this.REJECTED = REJECTED;
    this.ON_TRACK = ON_TRACK;
    this.ON_REINVITE = ON_REINVITE;
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

  createUserAgent(configOverrides: ?Object): UserAgent {
    const webRTCConfiguration = this._createWebRTCConfiguration(configOverrides);

    webRTCConfiguration.delegate = {
      onConnect: () => {
        this.eventEmitter.emit(CONNECTED);
        this.connectionPromise = null;
        this.register();
      },
      onDisconnect: (error?: Error) => {
        this.connectionPromise = null;
        // The UA will attempt to reconnect automatically when an error occurred
        this.eventEmitter.emit(DISCONNECTED, error);
        if (this.isRegistered()) {
          this.registerer.terminated();
          this.eventEmitter.emit(UNREGISTERED);
        }
      },
      onInvite: (invitation: Invitation) => {
        this._setupSession(invitation);
        const shouldAutoAnswer = !!invitation.request.getHeader('alert-info');

        this.eventEmitter.emit(INVITE, invitation, this.sessionWantsToDoVideo(invitation), shouldAutoAnswer);
      },
    };

    const ua = new UserAgent(webRTCConfiguration);
    ua.transport.onMessage = (rawMessage: string) => {
      const message = Parser.parseMessage(rawMessage, ua.transport.logger);

      // We have to re-sent the message to the UA ...
      ua.onTransportMessage(rawMessage);
      // And now do what we want with the message
      this.eventEmitter.emit(MESSAGE, message);

      if (message.method === C.MESSAGE) {
        // We have to manually reply to MESSAGE with a 200 OK or Asterisk will hangup.
        ua.userAgentCore.replyStateless(message, { statusCode: 200 });
      }
    };

    return ua;
  }

  isConnected(): boolean {
    return this.userAgent && this.userAgent.isConnected();
  }

  isConnecting(): boolean {
    return this.userAgent && this.userAgent.transport && this.userAgent.transport.state === TransportState.Connecting;
  }

  isRegistered(): boolean {
    return this.registerer && this.registerer.state === RegistererState.Registered;
  }

  register(): Promise<any> {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient] register', !!this.userAgent, this.isRegistered());
    if (!this.userAgent) {
      IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][register] recreating UA');
      this.userAgent = this.createUserAgent(this.uaConfigOverrides);
    }
    if (!this.userAgent || this.isRegistered()) {
      return Promise.resolve();
    }

    const registerOptions = this._isWeb() ? {} : { extraContactHeaderParams: ['mobility=mobile'] };

    return this._connectIfNeeded().then(() => {
      this.registerer = new Registerer(this.userAgent, registerOptions);
      this.shouldBeConnected = true;
      this.connectionPromise = null;

      // Bind registerer events
      this.registerer.stateChange.addListener(newState => {
        if (newState === RegistererState.Registered) {
          this.eventEmitter.emit(REGISTERED);
        } else if (newState === RegistererState.Unregistered) {
          this.eventEmitter.emit(UNREGISTERED);
        }
      });

      return this.registerer.register().catch((e) => {
        this.eventEmitter.emit(REGISTRATION_FAILED);
        return e;
      });
    });
  }

  unregister() {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient] unregister', !!this.userAgent);
    if (!this.registerer) {
      return Promise.resolve();
    }

    return this.registerer.unregister();
  }

  stop(): Promise<any> {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient] stop', !!this.userAgent);
    if (!this.userAgent) {
      return Promise.resolve();
    }

    return this.userAgent.stop().catch(e => {
      IssueReporter.log(IssueReporter.WARN, '[WebRtcClient] close error', e.message, e.stack);
    });
  }

  call(number: string, enableVideo?: boolean): Session {
    this.changeVideo(enableVideo || false);

    const session = new Inviter(this.userAgent, this._makeURI(number));

    this._setupSession(session);

    const inviteOptions: InviterInviteOptions = {
      requestDelegate: {
        onAccept: (response: IncomingResponse) => this._onAccepted(session, response.session),
        onReject: (response: IncomingResponse) => this.eventEmitter.emit(REJECTED, session, response),
      },
      sessionDescriptionHandlerOptions: this._getMediaConfiguration(enableVideo || false),
    };

    if (!enableVideo) {
      inviteOptions.sessionDescriptionHandlerModifiers = [stripVideo];
    }

    // Do not await invite here or we'll miss the Establishing state transition
    session.invite(inviteOptions);
    return session;
  }

  answer(session: Invitation, enableVideo?: boolean) {
    this.changeVideo(enableVideo || false);
    const options = {
      sessionDescriptionHandlerOptions: this._getMediaConfiguration(enableVideo || false),
    };

    return session.accept(options).then(() => {
      this._onAccepted(session);
    });
  }

  hangup(session: Session) {
    try {
      this._cleanupMedia(session);
      const { state } = session;

      if (this.getSipSessionId(session) in this.audioStreams) {
        this.removeFromMerge(session);
      }

      this._cleanupMedia(session);

      // Check if Invitation or Inviter (Invitation = incoming call)
      const isInviter = session instanceof Inviter;
      const cancel = () => session.cancel();
      const reject = () => session.reject();
      const bye = () => session.bye && session.bye();

      // @see github.com/onsip/SIP.js/blob/f11dfd584bc9788ccfc94e03034020672b738975/src/platform/web/simple-user/simple-user.ts#L1004
      const actions = {
        [SessionState.Initial]: isInviter ? cancel : reject,
        [SessionState.Establishing]: isInviter ? cancel : reject,
        [SessionState.Established]: bye,
      };

      // Handle different session status
      if (actions[state]) {
        return actions[state]();
      }

      return bye();
    } catch (error) {
      console.warn('WebRtcClient.hangup error', error);
    }

    return null;
  }

  reject(session: Inviter) {
    try {
      return session.reject ? session.reject() : session.cancel();
    } catch (e) {
      console.warn('Error when rejecting call', e.message, e.stack);
    }
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

    this.userAgent.stateChange.removeAllListeners();

    try {
      this.userAgent.stop();
    } catch (_) {
      // Avoid to raise exception when trying to close with hanged-up sessions remaining
      // eg: "INVITE not rejectable in state Completed"
    }
    this.userAgent = null;
  }

  getNumber(session: Inviter): ?String {
    if (!session) {
      return null;
    }

    // eslint-disable-next-line
    return session.remoteIdentity.uri._normal.user;
  }

  mute(session: Inviter) {
    this._toggleAudio(session, true);
  }

  unmute(session: Inviter) {
    this._toggleAudio(session, false);
  }

  toggleCameraOn(session: Inviter) {
    this._toggleVideo(session, false);
  }

  toggleCameraOff(session: Inviter) {
    this._toggleVideo(session, true);
  }

  hold(session: Inviter) {
    const sessionId = this.getSipSessionId(session);
    if (sessionId in this.heldSessions) {
      return Promise.resolve();
    }
    this.heldSessions[sessionId] = true;

    const hasVideo = this.sessionWantsToDoVideo(session);
    this.changeVideo(hasVideo);

    const options = {
      ...this._getMediaConfiguration(hasVideo),
      sessionDescriptionHandlerModifiers: [holdModifier],
    };

    // Send re-INVITE
    return session.invite(options).then(() => {
      this.mute(session);
    });
  }

  unhold(session: Inviter) {
    const hasVideo = this.sessionWantsToDoVideo(session);
    this.changeVideo(hasVideo);
    this.unmute(session);

    delete this.heldSessions[this.getSipSessionId(session)];

    const options = {
      ...this._getMediaConfiguration(hasVideo),
      // We should sent an empty `sessionDescriptionHandlerModifiers` or sip.js will take the last sent modifiers
      // (eg: holdModifier)
      sessionDescriptionHandlerModifiers: [],
    };

    // Send re-INVITE
    return session.invite(options).then(() => {
      this.unmute(session);
    });
  }

  isCallHeld(session: Inviter) {
    return this.getSipSessionId(session) in this.heldSessions;
  }

  sendDTMF(session: Inviter, tone: string) {
    if (!session.sessionDescriptionHandler) {
      return;
    }
    return session.sessionDescriptionHandler.sendDtmf(tone);
  }

  message(destination: string, message: string) {
    const messager = new Messager(this.userAgent, this._makeURI(destination), message);

    return messager.message();
  }

  transfer(session: Inviter, target: string) {
    this.hold(session);

    setTimeout(() => {
      session.refer(this._makeURI(target));
      this.hangup(session);
    }, 50);
  }

  // check https://sipjs.com/api/0.12.0/refer/referClientContext/
  atxfer(session: Inviter) {
    this.hold(session);

    const result: Object = {
      newSession: null,
      init: async (target: string) => {
        result.newSession = await this.call(target);
      },
      complete: () => {
        session.refer(result.newSession);
      },
      cancel: () => {
        this.hangup(result.newSession);
        this.unhold(session);
      },
    };

    return result;
  }

  merge(sessions: Array<Inviter>): Array<Promise<boolean>> {
    this._checkMaxMergeSessions(sessions.length);
    if (this.audioContext) {
      this.audioMixer = this.audioContext.createChannelMerger(10);
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return sessions.map(this.addToMerge.bind(this));
  }

  addToMerge(session: Inviter) {
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

  removeFromMerge(session: Inviter, shouldHold: boolean = true) {
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

  unmerge(sessions: Array<Inviter>): Promise<boolean> {
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

  pingServer() {
    if (!this.isConnected()) {
      return;
    }

    const core = this.userAgent.userAgentCore;
    const fromURI = this._makeURI(this.config.authorizationUser || '');
    const toURI = new URI('sip', '', this.config.host);
    const message = core.makeOutgoingRequestMessage('OPTIONS', toURI, fromURI, toURI, {});

    return core.request(message);
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

  changeAudioInputDevice(id: string, session: ?Inviter) {
    const currentId = this.getAudioDeviceId();
    if (id === currentId) {
      return null;
    }

    // let's update the local value
    if (this.audio && this.audio.deviceId) {
      // $FlowFixMe
      this.audio.deviceId.exact = id;
    }

    if (session) {
      const sdh = session.sessionDescriptionHandler;
      const pc = sdh.peerConnection;

      // $FlowFixMe
      return navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: id } } }).then(async stream => {
        const audioTrack = stream.getAudioTracks()[0];
        const sender = pc.getSenders().find(s => s.track.kind === audioTrack.kind);

        if (sender) {
          sender.replaceTrack(audioTrack);
        }

        return stream;
      });
    }
  }

  changeVideoInputDevice(id: string, session: ?Inviter) {
    const currentId = this.getVideoDeviceId();
    if (id === currentId) {
      return null;
    }

    // let's update the local value
    if (this.video && this.video.deviceId) {
      // $FlowFixMe
      this.video.deviceId.exact = id;
    }

    if (session) {
      const sdh = session.sessionDescriptionHandler;
      const pc = sdh.peerConnection;
      const localStream = this.getLocalStream(pc);

      // Release old video stream
      if (localStream) {
        localStream.getVideoTracks().forEach(track => {
          track.stop();
        });
      }

      // $FlowFixMe
      return navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: id } } }).then(async stream => {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = pc.getSenders().find(s => s.track.kind === videoTrack.kind);

        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        // let's update the local stream
        this._addLocalToVideoSession(this.getSipSessionId(session), stream);
        this.eventEmitter.emit('onVideoInputChange', stream);
        return stream;
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

  sessionHasAudio(session: Inviter) {
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

  getSipSessionId(sipSession: ?Inviter): string {
    if (!sipSession) {
      return '';
    }
    if (sipSession.message && sipSession.message.callId) {
      return sipSession.message.callId;
    }

    // For Inviter
    if (sipSession.outgoingRequestMessage) {
      return sipSession.outgoingRequestMessage.callId;
    }

    // For Invitation
    return (sipSession.id || '').substr(0, 36);
  }

  async waitForRegister() {
    return new Promise(resolve => this.on(REGISTERED, resolve));
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

  // eslint-disable-next-line no-unused-vars
  sessionWantsToDoVideo(session: Inviter) {
    const { body } = session.request;
    // Sometimes with InviteClientContext the body is in the body attribute ...
    const sdp = typeof body === 'object' && body ? body.body : body;

    return /\r\nm=video /.test(sdp);
  }

  hasHeartbeat() {
    return this.heartbeat.hasHeartbeat;
  }

  startHeartbeat() {
    if (!this.userAgent) {
      this.heartbeat.stop();
      return;
    }

    this.eventEmitter.off(MESSAGE, this._boundOnHeartbeat);
    this.eventEmitter.on(MESSAGE, this._boundOnHeartbeat);

    this.heartbeat.start();
  }

  stopHeartbeat() {
    this.heartbeat.stop();
  }

  setOnHeartbeatTimeout(cb: Function) {
    this.heartbeatTimeoutCb = cb;
  }

  attemptReconnection(): void {
    this.userAgent.attemptReconnection();
  }

  _onTransportError() {
    this.eventEmitter.emit(TRANSPORT_ERROR);
    this.attemptReconnection();
  }

  _onHeartbeat(message: string | Object) {
    const body = message && typeof message === 'object' ? message.data : message;
    if (body.indexOf('200 OK') !== -1) {
      this.heartbeat.onHeartbeat();
    }
  }

  async _onHeartbeatTimeout() {
    if (this.heartbeatTimeoutCb) {
      this.heartbeatTimeoutCb();
    }

    if (this.userAgent.transport) {
      // Disconnect from WS and triggers events, but do not trigger disconnect if already disconnecting...
      if (!this.userAgent.transport.transitioningState) {
        await this.userAgent.transport.disconnect();
      }

      // We can invoke disconnect() with an error that can be catcher by `onDisconnect`, so we have to trigger it here.
      this._onTransportError();
    }
  }

  _checkMaxMergeSessions(nbSessions: number) {
    if (nbSessions < MAX_MERGE_SESSIONS) {
      return;
    }

    console.warn(`Merging more than ${MAX_MERGE_SESSIONS} session is not recommended, it's too expensive for CPU.`);
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

  _connectIfNeeded(): Promise<void> {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][_connectIfNeeded]', this.isConnected());
    if (!this.userAgent) {
      IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][_connectIfNeeded] recreating UA');
      this.userAgent = this.createUserAgent(this.uaConfigOverrides);
    }

    if (this.isConnected()) {
      return Promise.resolve();
    }

    if (this.isConnecting()) {
      return this.userAgent.transport.connectPromise;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    IssueReporter.log(IssueReporter.INFO, '[WebRtcClient][_connectIfNeeded] connecting');
    this.connectionPromise = this.userAgent.start();

    return this.connectionPromise;
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

  _createWebRTCConfiguration(configOverrides: Object = {}) {
    const config: Object = {
      authorizationUsername: this.config.authorizationUser,
      authorizationPassword: this.config.password,
      displayName: this.config.displayName,
      autoStart: true,
      hackIpInContact: true,
      hackWssInTransport: true,
      logBuiltinEnabled: this.config.log ? this.config.log.builtinEnabled : null,
      logLevel: this.config.log ? this.config.log.logLevel : null,
      logConnector: this.config.log ? this.config.log.connector : null,
      uri: this._makeURI(this.config.authorizationUser || ''),
      userAgentString: this.config.userAgentString || 'wazo-sdk',
      reconnectionAttempts: 50,
      reconnectionDelay: 5,
      sessionDescriptionHandlerFactory: (session: Session, options: SessionDescriptionHandlerFactoryOptions = {}) => {
        const logger = session.userAgent.getLogger('sip.WazoSessionDescriptionHandler');

        const iceGatheringTimeout = 'iceGatheringTimeout' in options ? options.iceGatheringTimeout : 3000;

        const sdhOptions: SessionDescriptionHandlerConfiguration = {
          ...options,
          iceGatheringTimeout,
          peerConnectionConfiguration: {
            ...defaultPeerConnectionConfiguration(),
            ...(options.peerConnectionConfiguration || {}),
          },
        };

        return new WazoSessionDescriptionHandler(logger, defaultMediaStreamFactory(), sdhOptions, this._isWeb());
      },
      transportOptions: {
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
    };
  }

  // Invitation and Inviter extends Session
  _setupSession(session: Session) {
    session.stateChange.addListener((newState: SessionState) => {
      if (newState === SessionState.Terminated && this.getSipSessionId(session) in this.audioStreams) {
        this.removeFromMerge(session);
      }
    });

    // When receiving an Invitation, the delegate is not defined.
    if (!session.delegate) {
      session.delegate = {};
    }

    session.delegate.onInvite = (inviteRequest: IncomingRequestMessage) => {
      const updatedCalleeName = session.assertedIdentity && session.assertedIdentity.displayName;

      return this.eventEmitter.emit(ON_REINVITE, session, inviteRequest, updatedCalleeName);
    };
  }

  _onAccepted(session: Session, sessionDialog?: SessionDialog) {
    this._setupLocalMedia(session);
    this._setupRemoteMedia(session);

    session.sessionDescriptionHandler.peerConnection.addEventListener('track', event => {
      this._setupRemoteMedia(session);
      this.eventEmitter.emit(ON_TRACK, session, event);
    });

    session.sessionDescriptionHandler.remoteMediaStream.onaddtrack = event => {
      this._setupRemoteMedia(session);
      this.eventEmitter.emit(ON_TRACK, session, event);
    };

    this.eventEmitter.emit(ACCEPTED, session, sessionDialog);
  }

  _setupRemoteMedia(session: Session) {
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
    if (audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > 2) {
      audio.pause();
    }
    audio.srcObject = remoteStream;
    audio.volume = this.audioOutputVolume;
    audio.play().catch(() => {});
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

  _setupLocalMedia(session: Session) {
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

  _cleanupMedia(session: Session) {
    const sessionId = this.getSipSessionId(session);
    if (session && sessionId in this.videoSessions) {
      this.videoSessions[this.getSipSessionId(session)].local.getTracks().forEach(track => track.stop());
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

  _toggleAudio(session: Inviter, muteAudio: boolean) {
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

  _toggleVideo(session: Inviter, muteCamera: boolean) {
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

  _makeURI(target: string): URI {
    return UserAgent.makeURI(`sip:${target}@${this.config.host}`);
  }

}
