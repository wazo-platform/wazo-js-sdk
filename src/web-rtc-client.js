// @flow
/* eslint-disable class-methods-use-this, no-param-reassign, max-classes-per-file, no-underscore-dangle */
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
import type SessionDescriptionHandler
  from 'sip.js/lib/platform/web/session-description-handler/session-description-handler';
import { UserAgentState } from 'sip.js/lib/api/user-agent-state';
import { Parser } from 'sip.js/lib/core/messages/parser';
import { C } from 'sip.js/lib/core/messages/methods/constants';
import { URI } from 'sip.js/lib/grammar/uri';
import { UserAgent } from 'sip.js/lib/api/user-agent';
import { holdModifier, stripVideo } from 'sip.js/lib/platform/web/modifiers/modifiers';
import { Registerer } from 'sip.js/lib/api/registerer';
import { Inviter } from 'sip.js/lib/api/inviter';
import { Messager } from 'sip.js/lib/api/messager';
import { RegistererState } from 'sip.js/lib/api/registerer-state';
import { SessionState } from 'sip.js/lib/api/session-state';
import { TransportState } from 'sip.js/lib/api/transport-state';
import { defaultPeerConnectionConfiguration }
  from 'sip.js/lib/platform/web/session-description-handler/peer-connection-configuration-default';
import getStats from 'getstats';

import WazoSessionDescriptionHandler, { wazoMediaStreamFactory } from './lib/WazoSessionDescriptionHandler';

import Emitter from './utils/Emitter';
import ApiClient from './api-client';
import IssueReporter from './service/IssueReporter';
import Heartbeat from './utils/Heartbeat';
import { getVideoDirection, hasAnActiveVideo } from './utils/sdp';
import { lastIndexOf } from './utils/array';

// We need to replace 0.0.0.0 to 127.0.0.1 in the sdp to avoid MOH during a createOffer.
export const replaceLocalIpModifier = (description: Object) => Promise.resolve({
  // description is immutable... so we have to clone it or the `type` attribute won't be returned.
  ...JSON.parse(JSON.stringify(description)),
  sdp: description.sdp.replace('c=IN IP4 0.0.0.0', 'c=IN IP4 127.0.0.1'),
});

const DEFAULT_ICE_TIMEOUT = 3000;
const SEND_STATS_DELAY = 5000;

const states = ['STATUS_NULL', 'STATUS_NEW', 'STATUS_CONNECTING', 'STATUS_CONNECTED', 'STATUS_COMPLETED'];
const logger = IssueReporter ? IssueReporter.loggerFor('webrtc-client') : console;
const statsLogger = IssueReporter ? IssueReporter.loggerFor('webrtc-stats') : console;

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
const ON_EARLY_MEDIA = 'onEarlyMedia';
const ON_REINVITE = 'reinvite';
const ON_ERROR = 'onError';
const ON_SCREEN_SHARING_REINVITE = 'onScreenSharingReinvite';
const ON_NETWORK_STATS = 'onNetworkStats';
const ON_DISCONNECTED = 'onDisconnected';

export const events = [REGISTERED, UNREGISTERED, REGISTRATION_FAILED, INVITE];
export const transportEvents = [CONNECTED, DISCONNECTED, TRANSPORT_ERROR, MESSAGE];
export class CanceledCallError extends Error {}

const MAX_REGISTER_TRIES = 5;

type MediaConfig = {
  audio: Object & boolean,
  video: Object & boolean,
  localVideo?: Object & boolean,
};

type WebRtcConfig = {
  displayName: string,
  host: string,
  port?: number,
  websocketSip?: ?string,
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
  skipRegister: boolean,
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
  audioStreams: Object;
  audioOutputDeviceId: ?string;
  audioOutputVolume: number;
  heldSessions: Object;
  connectionPromise: ?Promise<void>;
  _boundOnHeartbeat: Function;
  heartbeat: Heartbeat;
  heartbeatTimeoutCb: ?Function;
  heartbeatCb: ?Function;
  statsIntervals: Object;
  sipSessions: { [string]: Session };
  conferences: { [string]: boolean };
  skipRegister: boolean;
  networkMonitoringInterval: { [string]: IntervalID };
  sessionNetworkStats: { [string]: Object };
  forceClosed: boolean;

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
  ON_ERROR: string;
  ON_SCREEN_SHARING_REINVITE: string;
  ON_NETWORK_STATS: string;
  ON_EARLY_MEDIA: string;
  ON_DISCONNECTED: string;

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
    this.skipRegister = config.skipRegister;

    this._buildConfig(config, session).then((newConfig: WebRtcConfig) => {
      this.config = newConfig;
      this.userAgent = this.createUserAgent(uaConfigOverrides);
    });

    this.audioOutputDeviceId = config.audioOutputDeviceId;
    this.audioOutputVolume = config.audioOutputVolume || 1;

    if (config.media) {
      this.configureMedia(config.media);
      this.setMediaConstraints({ audio: config.media.audio, video: config.media.video });
    }

    this.heldSessions = {};
    this.statsIntervals = {};
    this.connectionPromise = null;
    this.sipSessions = {};
    this.conferences = {};
    this.networkMonitoringInterval = {};
    this.sessionNetworkStats = {};
    this.forceClosed = false;

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
    this.ON_ERROR = ON_ERROR;
    this.ON_SCREEN_SHARING_REINVITE = ON_SCREEN_SHARING_REINVITE;
    this.ON_NETWORK_STATS = ON_NETWORK_STATS;
    this.ON_DISCONNECTED = ON_DISCONNECTED;
    this.ON_EARLY_MEDIA = ON_EARLY_MEDIA;
  }

  configureMedia(media: MediaConfig) {
    this.hasAudio = !!media.audio;
    this.audioStreams = {};
    this.audioElements = {};
  }

  setMediaConstraints(media: MediaStreamConstraints) {
    this.video = media.video;
    this.audio = media.audio;
  }

  createUserAgent(configOverrides: ?Object): UserAgent {
    const webRTCConfiguration = this._createWebRTCConfiguration(configOverrides);
    logger.info('sdk webrtc, creating UA', { webRTCConfiguration });

    webRTCConfiguration.delegate = {
      onConnect: this.onConnect.bind(this),
      onDisconnect: this.onDisconnect.bind(this),
      onInvite: (invitation: Invitation) => {
        logger.info('sdk webrtc on invite', {
          method: 'delegate.onInvite',
          id: invitation.id,
          remoteURI: invitation.remoteURI,
        });
        this._setupSession(invitation);
        const shouldAutoAnswer = !!invitation.request.getHeader('alert-info');

        this.eventEmitter.emit(INVITE, invitation, this.sessionWantsToDoVideo(invitation), shouldAutoAnswer);
      },
    };

    const ua = new UserAgent(webRTCConfiguration);
    if (ua.transport && ua.transport.connectPromise) {
      ua.transport.connectPromise.catch((e => {
        logger.warn('Transport connect error', e);
      }));
    }

    ua.transport.onMessage = (rawMessage: string) => {
      const message = Parser.parseMessage(rawMessage, ua.transport.logger);

      // We have to re-sent the message to the UA ...
      ua.onTransportMessage(rawMessage);
      // And now do what we want with the message
      this.eventEmitter.emit(MESSAGE, message);

      if (message && message.method === C.MESSAGE) {
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

  onConnect() {
    logger.info('sdk webrtc connected', { method: 'delegate.onConnect' });
    this.eventEmitter.emit(CONNECTED);
    if (!this.isRegistered() && this.registerer && this.registerer.waiting) {
      this.registerer.waitingToggle(false);
    }
    return this.register();
  }

  async onDisconnect(error?: Error) {
    logger.info('sdk webrtc disconnected', { method: 'delegate.onConnect', error });
    this.connectionPromise = null;
    // The UA will attempt to reconnect automatically when an error occurred
    this.eventEmitter.emit(DISCONNECTED, error);
    if (this.isRegistered()) {
      await this.unregister();
      if (this.registerer && this.registerer.waiting) {
        this.registerer.waitingToggle(false);
      }
      this.eventEmitter.emit(UNREGISTERED);
    }
  }

  register(tries: number = 0): Promise<any> {
    const logInfo = {
      userAgent: !!this.userAgent,
      registered: this.isRegistered(),
      connectionPromise: !!this.connectionPromise,
      registerer: !!this.registerer,
      waiting: this.registerer && this.registerer.waiting,
      tries,
      skipRegister: this.skipRegister,
    };

    this.forceClosed = false;

    if (this.skipRegister) {
      logger.info('sdk webrtc skip register...', logInfo);
      return Promise.resolve();
    }

    logger.info('sdk webrtc registering...', logInfo);

    if (!this.userAgent) {
      logger.info('sdk webrtc recreating User Agent');
      this.userAgent = this.createUserAgent(this.uaConfigOverrides);
    }
    if (!this.userAgent || this.isRegistered()) {
      logger.info('sdk webrtc registering aborted, already registered or no UA can be created');
      return Promise.resolve();
    }

    if (this.connectionPromise || (this.registerer && this.registerer.waiting)) {
      logger.info('sdk webrtc registering aborted due to a registration in progress.');
      return Promise.resolve();
    }

    const registerOptions = this._isWeb() ? {} : { extraContactHeaderParams: ['mobility=mobile'] };

    const onRegisterFailed = () => {
      logger.info('sdk webrtc registering failed', {
        tries,
        registerer: !!this.registerer,
        forceClosed: this.forceClosed,
      });
      if (this.forceClosed) {
        return;
      }

      this.connectionPromise = null;
      if (this.registerer && this.registerer.waiting) {
        this.registerer.waitingToggle(false);
      }

      if (tries <= MAX_REGISTER_TRIES) {
        logger.info('sdk webrtc registering, retrying...', { tries });
        setTimeout(() => this.register(tries + 1), 300);
      }
    };

    return this._connectIfNeeded().then(() => {
      // Avoid race condition with the close method called just before register and setting userAgent to null
      // during the resolution of the primise.
      if (!this.userAgent) {
        logger.info('sdk webrtc recreating User Agent after connection');
        this.userAgent = this.createUserAgent(this.uaConfigOverrides);
      }

      logger.info('sdk webrtc registering, transport connected', { registerOptions, ua: !!this.userAgent });
      this.registerer = new Registerer(this.userAgent, registerOptions);
      this.connectionPromise = null;
      this._monkeyPatchRegisterer(this.registerer);

      // Bind registerer events
      this.registerer.stateChange.addListener(newState => {
        logger.info('sdk webrtc registering, state changed', { newState });

        if (newState === RegistererState.Registered && this.registerer
          && this.registerer.state === RegistererState.Registered) {
          this.eventEmitter.emit(REGISTERED);
        } else if (newState === RegistererState.Unregistered) {
          this.eventEmitter.emit(UNREGISTERED);
        }
      });

      const options = {
        requestDelegate: {
          onReject: response => {
            logger.error('sdk webrtc registering, rejected', { response });

            onRegisterFailed();
          },
        },
      };

      return this.registerer.register(options).catch((e) => {
        logger.error('sdk webrtc registering, error', e);

        this.eventEmitter.emit(REGISTRATION_FAILED);
        return e;
      });
    }).catch(error => {
      logger.error('sdk webrtc registering, transport error', error);
      onRegisterFailed();
    });
  }

  // Monkey patching sip.js to avoid issues during register.onReject
  _monkeyPatchRegisterer(registerer: ?Registerer) {
    if (!registerer) {
      return;
    }
    const oldWaitingToggle = registerer.waitingToggle.bind(registerer);
    const oldUnregistered = registerer.unregistered.bind(registerer);

    registerer.waitingToggle = (waiting: boolean) => {
      if (!registerer || registerer.waiting === waiting) {
        return;
      }
      oldWaitingToggle(waiting);
    };

    registerer.unregistered = () => {
      if (!registerer || registerer.state === RegistererState.Terminated) {
        return;
      }
      oldUnregistered();
    };
  }

  unregister() {
    logger.info('sdk webrtc unregistering..', { userAgent: !!this.userAgent, registerer: !!this.registerer });
    if (!this.registerer) {
      return Promise.resolve();
    }

    try {
      return this.registerer.unregister().then(() => {
        logger.info('sdk webrtc unregistered');
        this._cleanupRegister();
      }).catch(e => {
        logger.error('sdk webrtc unregistering, promise error', e);
        this._cleanupRegister();
      });
    } catch (e) {
      logger.error('sdk webrtc unregistering, error', e);
      // Avoid issue with `undefined is not an object (evaluating 'new.target.prototype')` when triggering a new
      // error when the registerer is in a bad state
      this._cleanupRegister();
    }
  }

  stop(): Promise<any> {
    logger.info('sdk webrtc stop', { userAgent: !!this.userAgent });
    if (!this.userAgent) {
      return Promise.resolve();
    }

    return this.userAgent.stop().then(() => {
      return this._cleanupRegister();
    }).catch(e => {
      logger.warn('sdk webrtc stop, error', { message: e.message, stack: e.stack });
    });
  }

  call(number: string, enableVideo?: boolean, audioOnly: boolean = false, conference: boolean = false): Session {
    logger.info('sdk webrtc creating call', { number, enableVideo, audioOnly, conference });
    const inviterOptions: Object = {
      sessionDescriptionHandlerOptionsReInvite: {
        conference,
        audioOnly,
      },
      earlyMedia: true,
    };

    if (audioOnly) {
      inviterOptions.sessionDescriptionHandlerModifiersReInvite = [stripVideo];
    }

    const session = new Inviter(this.userAgent, this._makeURI(number), inviterOptions);

    this.storeSipSession(session);

    this._setupSession(session);

    if (conference) {
      this.conferences[this.getSipSessionId(session)] = true;
    }

    const inviteOptions: InviterInviteOptions = {
      requestDelegate: {
        onAccept: (response: IncomingResponse) => {
          if (session.sessionDescriptionHandler.peerConnection) {
            session.sessionDescriptionHandler.peerConnection.sfu = conference;
          }
          this._onAccepted(session, response.session, true);
        },
        onProgress: (payload) => {
          if (payload.message.statusCode === 183) {
            this._onEarlyProgress(payload.session);
          }
        },
        onReject: (response: IncomingResponse) => {
          logger.info('on call rejected', { id: session.id, fromTag: session.fromTag });
          this._stopSendingStats(session);
          this.stopNetworkMonitoring(session);

          this.eventEmitter.emit(REJECTED, session, response);
        },
      },
      sessionDescriptionHandlerOptions: this.getMediaConfiguration(enableVideo || false, conference),
    };

    inviteOptions.sessionDescriptionHandlerOptions.audioOnly = audioOnly;

    inviteOptions.sessionDescriptionHandlerModifiers = [replaceLocalIpModifier];
    if (audioOnly) {
      inviteOptions.sessionDescriptionHandlerModifiers.push(stripVideo);
    }

    // Do not await invite here or we'll miss the Establishing state transition
    session.invitePromise = session.invite(inviteOptions);
    return session;
  }

  answer(session: Invitation, enableVideo?: boolean) {
    logger.info('sdk webrtc answer call', { id: session.id, enableVideo });

    if (!session || !session.accept) {
      const error = 'No session to answer, or not an invitation';
      logger.warn(error);
      return Promise.reject(new Error(error));
    }
    const options = {
      sessionDescriptionHandlerOptions: this.getMediaConfiguration(enableVideo || false),
    };

    return session.accept(options).then(() => {
      if (session.isCanceled) {
        const message = 'accepted a canceled session (or was canceled during the accept phase).';
        logger.error(message, { id: session.id });
        this.onCallEnded(session);

        throw new CanceledCallError(message);
      }
      logger.info('sdk webrtc answer, accepted.');
      this._onAccepted(session);
    }).catch(e => {
      logger.error(`answer call error for ${session ? session.id : 'n/a'}`, e);

      throw e;
    });
  }

  hangup(session: Session) {
    const { state, id } = session;
    logger.info('sdk webrtc hangup call', { id, state });

    try {
      this._stopSendingStats(session);

      this._cleanupMedia(session);

      delete this.sipSessions[this.getSipSessionId(session)];

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
      logger.warn('sdk webrtc hangup, error', error);
    }

    return null;
  }

  async getStats(session: Session): ?Object {
    const pc = session.sessionDescriptionHandler.peerConnection;
    if (!pc) {
      return null;
    }

    return pc.getStats(null);
  }

  // Fetch and emit an event at `interval` with session network stats
  startNetworkMonitoring(session: Session, interval: number = 1000): ?Object {
    const sessionId = this.getSipSessionId(session);
    logger.info('starting network inspection', { id: sessionId });

    this.sessionNetworkStats[sessionId] = [];

    this.networkMonitoringInterval[sessionId] = setInterval(() => this._fetchNetworkStats(sessionId), interval);
  }

  stopNetworkMonitoring(session: Session): ?Object {
    const sessionId = this.getSipSessionId(session);
    const exists = sessionId in this.networkMonitoringInterval;
    logger.info('stopping network inspection', { id: sessionId, exists });

    if (exists) {
      clearInterval(this.networkMonitoringInterval[sessionId]);
      delete this.networkMonitoringInterval[sessionId];
      delete this.sessionNetworkStats[sessionId];
    }
  }

  reject(session: Inviter) {
    logger.info('sdk webrtc reject call', { id: session.id });

    try {
      return session.reject ? session.reject() : session.cancel();
    } catch (e) {
      logger.warn('Error when rejecting call', e.message, e.stack);
    }
  }

  async close(force: boolean = false) {
    logger.info('sdk webrtc closing client', { userAgent: !!this.userAgent, force });
    this.forceClosed = force;
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
    this.userAgent.delegate = null;
    this.userAgent.stateChange.removeAllListeners();

    await this._disconnectTransport(force);

    this._cleanupRegister();

    try {
      // Don't wait here, It can take ~30s to stop ...
      this.userAgent.stop().catch(console.error);
    } catch (_) {
      // Avoid to raise exception when trying to close with hanged-up sessions remaining
      // eg: "INVITE not rejectable in state Completed"
    }
    this.userAgent = null;
    logger.info('sdk webrtc client closed');
  }

  getNumber(session: Inviter): ?String {
    if (!session) {
      return null;
    }

    // eslint-disable-next-line
    return session.remoteIdentity.uri._normal.user;
  }

  mute(session: Inviter) {
    logger.info('sdk webrtc mute', { id: session.id });

    this._toggleAudio(session, true);
  }

  unmute(session: Inviter) {
    logger.info('sdk webrtc unmute', { id: session.id });

    this._toggleAudio(session, false);
  }

  isAudioMuted(session: Inviter): boolean {
    if (!session || !session.sessionDescriptionHandler) {
      return false;
    }

    let muted = true;
    const pc = session.sessionDescriptionHandler.peerConnection;
    if (!pc) {
      return false;
    }

    if (pc.getSenders) {
      if (!pc.getSenders().length) {
        return false;
      }
      pc.getSenders().forEach(sender => {
        if (sender && sender.track && sender.track.kind === 'audio') {
          muted = muted && !sender.track.enabled;
        }
      });
    } else {
      if (!pc.getLocalStreams().length) {
        return false;
      }
      pc.getLocalStreams().forEach(stream => {
        stream.getAudioTracks().forEach(track => {
          muted = muted && !track.enabled;
        });
      });
    }

    return muted;
  }

  toggleCameraOn(session: Inviter) {
    logger.info('sdk webrtc toggle camera on', { id: session.id });

    this._toggleVideo(session, false);
  }

  toggleCameraOff(session: Inviter) {
    logger.info('sdk webrtc toggle camera off', { id: session.id });

    this._toggleVideo(session, true);
  }

  hold(session: Inviter, isConference: boolean = false, hadVideo: boolean = false) {
    const sessionId = this.getSipSessionId(session);
    const hasVideo = hadVideo || this.hasLocalVideo(sessionId);

    logger.info('sdk webrtc hold', {
      sessionId,
      keys: Object.keys(this.heldSessions),
      pendingReinvite: !!session.pendingReinvite,
      isConference,
      hasVideo,
    });

    if (sessionId in this.heldSessions) {
      return Promise.resolve();
    }
    if (session.pendingReinvite) {
      return Promise.resolve();
    }
    this.heldSessions[sessionId] = {
      hasVideo,
      isConference,
    };

    if (isConference) {
      this.mute(session);
    }

    session.sessionDescriptionHandlerOptionsReInvite = {
      hold: true,
      conference: isConference,
    };

    const options = this.getMediaConfiguration(false, isConference);
    if (!this._isWeb()) {
      options.sessionDescriptionHandlerModifiers = [holdModifier];
    }
    options.sessionDescriptionHandlerOptions = {
      constraints: options.constraints,
      hold: true,
      conference: isConference,
    };

    // Avoid sdh to create a new stream
    if (session.sessionDescriptionHandler) {
      session.sessionDescriptionHandler.localMediaStreamConstraints = options.constraints;
    }

    // Send re-INVITE
    return session.invite(options);
  }

  unhold(session: Inviter, isConference: boolean = false) {
    const sessionId = this.getSipSessionId(session);
    const hasVideo = sessionId in this.heldSessions && this.heldSessions[sessionId].hasVideo;

    logger.info('sdk webrtc unhold', {
      sessionId,
      keys: Object.keys(this.heldSessions),
      pendingReinvite: !!session.pendingReinvite,
      isConference,
      hasVideo,
    });

    if (session.pendingReinvite) {
      return Promise.resolve();
    }

    if (isConference) {
      this.unmute(session);
    }

    delete this.heldSessions[this.getSipSessionId(session)];
    session.sessionDescriptionHandlerOptionsReInvite = {
      hold: false,
      conference: isConference,
    };

    const options = this.getMediaConfiguration(false, isConference);
    if (!this._isWeb()) {
      // We should sent an empty `sessionDescriptionHandlerModifiers` or sip.js will take the last sent modifiers
      // (eg: holdModifier)
      options.sessionDescriptionHandlerModifiers = [];
    }
    options.sessionDescriptionHandlerOptions = {
      constraints: options.constraints,
      hold: false,
      conference: isConference,
    };

    // Send re-INVITE
    return session.invite(options);
  }

  // Returns true if a re-INVITE is required
  async upgradeToVideo(session: Session, constraints: ?Object, isConference: boolean): Promise<?Object> {
    const pc = session.sessionDescriptionHandler.peerConnection;

    // Check if a video sender already exists
    let videoSender;
    if (isConference) {
      // We search for the last transceiver without `video-` in the mid (video- means remote transceiver)
      const transceivers = pc.getTransceivers();
      const transceiverIdx = lastIndexOf(transceivers, transceiver =>
        transceiver.sender.track === null && transceiver.mid && transceiver.mid.indexOf('video') === -1);

      videoSender = transceiverIdx !== -1 ? transceivers[transceiverIdx].sender : null;
    } else {
      videoSender = pc && pc.getSenders && pc.getSenders().find(sender => sender.track === null);
    }

    if (!videoSender) {
      // When no video sender found, it means that we're in the first video upgrade in 1:1
      return null;
    }

    // Reuse bidirectional video stream
    const newStream = await this.getStreamFromConstraints(constraints);
    if (!newStream) {
      console.warn(`Can't create media stream with: ${JSON.stringify(constraints || {})}`);
      return false;
    }

    // Add previous local audio track
    if (constraints && !constraints.audio) {
      const localVideoStream = session.sessionDescriptionHandler.localMediaStream;
      const localAudioTrack = localVideoStream.getTracks().find(track => track.kind === 'audio');
      if (localAudioTrack) {
        newStream.addTrack(localAudioTrack);
      }
    }

    const videoTrack = newStream.getVideoTracks()[0];
    if (videoTrack) {
      videoSender.replaceTrack(videoTrack);
    }

    this.setLocalMediaStream(this.getSipSessionId(session), newStream);

    return newStream;
  }

  downgradeToAudio(session: Session) {
    // Release local video stream when downgrading to audio
    const localStream = session.sessionDescriptionHandler.localMediaStream;
    const pc = session.sessionDescriptionHandler.peerConnection;
    const videoTracks = localStream.getVideoTracks();

    // Remove video senders
    if (pc.getSenders) {
      pc.getSenders().filter(sender => sender.track && sender.track.kind === 'video').forEach(videoSender => {
        videoSender.replaceTrack(null);
      });
    }

    videoTracks.forEach(videoTrack => {
      videoTrack.enabled = false;
      videoTrack.stop();
      localStream.removeTrack(videoTrack);
    });
  }

  async getStreamFromConstraints(constraints: Object, conference: boolean = false): Promise<?MediaStream> {
    const video = constraints && constraints.video;
    // $FlowFixMe
    const { constraints: newConstraints } = this.getMediaConfiguration(video, conference, constraints);

    let newStream;
    try {
      newStream = await wazoMediaStreamFactory(newConstraints);
    } catch (e) {
      // Nothing to do when the user cancel the screensharing prompt
    }
    if (!newStream) {
      return null;
    }
    // $FlowFixMe
    newStream.local = true;

    return newStream;
  }

  getHeldSession(sessionId: string) {
    return this.heldSessions[sessionId];
  }

  isCallHeld(session: Inviter) {
    return this.getSipSessionId(session) in this.heldSessions;
  }

  isVideoRemotelyHeld(sessionId: string) {
    const pc = this.getPeerConnection(sessionId);
    const sdp = pc && pc.remoteDescription ? pc.remoteDescription.sdp : null;
    if (!sdp) {
      return false;
    }

    const videoDirection = getVideoDirection(sdp);

    return videoDirection === 'sendonly';
  }

  sendDTMF(session: Inviter, tone: string) {
    if (!session.sessionDescriptionHandler) {
      return;
    }
    logger.info('Sending DTMF', {
      id: this.getSipSessionId(session),
      tone,
    });
    return session.sessionDescriptionHandler.sendDtmf(tone);
  }

  message(destination: string, message: string) {
    const messager = new Messager(this.userAgent, this._makeURI(destination), message);

    return messager.message();
  }

  transfer(session: Inviter, target: string) {
    this.hold(session);

    logger.info('Transfering a session', {
      id: this.getSipSessionId(session),
      target,
    });

    const options = {
      requestDelegate: {
        onAccept: () => {
          this.hangup(session);
        },
      },
    };

    setTimeout(() => {
      session.refer(this._makeURI(target), options);
    }, 50);
  }

  // check https://sipjs.com/api/0.12.0/refer/referClientContext/
  atxfer(session: Inviter) {
    this.hold(session);

    logger.info('webrtc transfer started', { id: this.getSipSessionId(session) });

    const result: Object = {
      newSession: null,
      init: async (target: string) => {
        logger.info('webrtc transfer initialized', { id: this.getSipSessionId(session), target });

        result.newSession = await this.call(target);
      },
      complete: () => {
        logger.info('webrtc transfer completed', {
          id: this.getSipSessionId(session),
          referId: this.getSipSessionId(result.newSession),
        });

        session.refer(result.newSession);
      },
      cancel: () => {
        this.hangup(result.newSession);
        this.unhold(session);
      },
    };

    return result;
  }

  sendMessage(sipSession: Session = null, body: string, contentType: string = 'text/plain') {
    if (!sipSession) {
      return;
    }

    logger.info('send WebRTC message', { sipId: sipSession.id, contentType });

    try {
      sipSession.message({
        requestOptions: {
          body: {
            content: body,
            contentType,
          },
        },
      });
    } catch (e) {
      console.warn(e);
    }
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
    return this.userAgent ? states[this.userAgent.state] : UserAgentState.Stopped;
  }

  getContactIdentifier() {
    return this.userAgent ? `${this.userAgent.configuration.contactName}/${this.userAgent.contact.uri}` : null;
  }

  isFirefox(): boolean {
    return this._isWeb() && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  changeAudioOutputVolume(volume: number) {
    logger.info('Changing audio output volume', { volume });

    Object.values(this.audioElements).forEach(audioElement => {
      if (audioElement instanceof HTMLAudioElement) {
        // eslint-disable-next-line no-param-reassign
        audioElement.volume = volume;
      }
    });
    this.audioOutputVolume = volume;
  }

  changeAudioOutputDevice(id: string) {
    logger.info('Changing audio output device', { id });
    this.audioOutputDeviceId = id;

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

  async changeAudioInputDevice(id: string, session: ?Inviter, force: ?boolean) {
    const currentId = this.getAudioDeviceId();
    logger.info('setting audio input device', { id, currentId, session: !!session });

    if (!force && id === currentId) {
      return null;
    }

    // in order to handle an audio track change for default devices
    // we need the actual id of the device (not 'default')
    let deviceId = id;
    if (id === 'default' && navigator.mediaDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const defaultDevice = devices.find(device => device.deviceId === 'default');
      if (defaultDevice) {
        const deviceLabel = defaultDevice.label.replace('Default - ', '');
        const targetDevice = devices.find(device => device.label === deviceLabel);
        if (targetDevice) {
          deviceId = targetDevice.deviceId;
          if (!force && deviceId === currentId) {
            return null;
          }
        }
      }
    }

    // let's update the local audio value
    if (this.audio) {
      this.audio = {
        deviceId: {
          exact: deviceId,
        },
      };
    }

    if (session && navigator.mediaDevices) {
      const sdh = session.sessionDescriptionHandler;
      const pc = sdh.peerConnection;

      const constraints = { audio: { deviceId: { exact: deviceId } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioTrack = stream.getAudioTracks()[0];
      const sender = pc && pc.getSenders
        && pc.getSenders().find(s => audioTrack && s && s.track && s.track.kind === audioTrack.kind);

      if (sender) {
        if (sender.track) {
          audioTrack.enabled = sender.track.enabled;
        }
        sender.replaceTrack(audioTrack);
      }

      return stream;
    }
  }

  changeVideoInputDevice(id: ?string, session: ?Inviter) {
    this.setVideoInputDevice(id);

    if (session) {
      return this.changeSessionVideoInputDevice(id, session);
    }
  }

  setVideoInputDevice(id: ?string) {
    const currentId = this.getVideoDeviceId();
    logger.info('setting video input device', { id, currentId });

    if (id === currentId) {
      return null;
    }

    // let's make sure we don't lose other video constraints settings -- width, height, frameRate...
    const videoObject = typeof this.video === 'object' ? this.video : {};
    this.video = {
      ...videoObject,
      deviceId: {
        exact: id,
      },
    };
  }

  changeSessionVideoInputDevice(id: ?string, session: Inviter) {
    if (!this.sessionWantsToDoVideo(session)) {
      return;
    }
    const sdh = session.sessionDescriptionHandler;
    const pc = sdh.peerConnection;
    const sessionId = this.getSipSessionId(session);
    const localStream = this.getLocalStream(sessionId);

    logger.info('changing video input device', { id, sessionId });

    // Release old video stream
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.stop();
      });
    }

    const constraints = {
      video: id ? { deviceId: { exact: id } } : true,
    };
    // $FlowFixMe
    return navigator.mediaDevices.getUserMedia(constraints).then(async stream => {
      const videoTrack = stream.getVideoTracks()[0];
      let sender = pc && pc.getSenders
        && pc.getSenders().find(s => videoTrack && s && s.track && s.track.kind === videoTrack.kind);
      let wasTrackEnabled = false;
      if (!sender) {
        sender = pc && pc.getSenders && pc.getSenders().find(s => !s.track);
      }

      if (sender) {
        // No video track means video not enabled
        wasTrackEnabled = sender.track ? sender.track.enabled : false;
        videoTrack.enabled = wasTrackEnabled;

        if (!wasTrackEnabled) {
          videoTrack.stop();
        }

        sender.replaceTrack(wasTrackEnabled ? videoTrack : null);
      }

      // let's update the local stream
      this.eventEmitter.emit('onVideoInputChange', stream);
      this.setLocalMediaStream(sessionId, stream);

      return stream;
    });
  }

  getAudioDeviceId(): ?string {
    // $FlowFixMe
    return this.audio && typeof this.audio === 'object' && 'deviceId' in this.audio
      ? this.audio.deviceId.exact : undefined;
  }

  getVideoDeviceId(): ?string {
    // $FlowFixMe
    return this.video && typeof this.video === 'object' && 'deviceId' in this.video
      ? this.video.deviceId.exact : undefined;
  }

  reinvite(sipSession: Session, newConstraints: ?Object = null, conference: boolean = false,
    audioOnly: boolean = false, iceRestart: boolean = false) {
    if (!sipSession) {
      return false;
    }

    if (sipSession.pendingReinvite) {
      return false;
    }

    const wasMuted = this.isAudioMuted(sipSession);
    const shouldDoVideo = newConstraints ? newConstraints.video : this.sessionWantsToDoVideo(sipSession);
    const shouldDoScreenSharing = newConstraints && newConstraints.screen;
    const desktop = newConstraints && newConstraints.desktop;

    logger.info('Sending reinvite', {
      id: this.getSipSessionId(sipSession),
      newConstraints,
      conference,
      audioOnly,
      wasMuted,
      shouldDoVideo,
      shouldDoScreenSharing,
      desktop,
    });

    // When upgrading to video, remove the `stripVideo` modifiers
    if (newConstraints && newConstraints.video) {
      const modifiers = sipSession.sessionDescriptionHandlerModifiersReInvite;
      sipSession.sessionDescriptionHandlerModifiersReInvite = modifiers.filter(modifier =>
        modifier !== stripVideo);
    }

    sipSession.sessionDescriptionHandlerOptionsReInvite = {
      ...sipSession.sessionDescriptionHandlerOptionsReInvite,
      conference,
      audioOnly,
    };

    // $FlowFixMe
    const { constraints } = this.getMediaConfiguration(shouldDoVideo, conference, newConstraints);

    return sipSession.invite({
      requestDelegate: {
        onAccept: (response: IncomingResponse) => {
          // Update the SDP body to be able to call sessionWantsToDoVideo correctly in `_setup[Local|Remote]Media`.
          // Can't set directly sipSession.body because it's a getter.
          if (sipSession instanceof Inviter) {
            sipSession.outgoingRequestMessage.body.body = response.message.body;
          } else {
            sipSession.incomingInviteRequest.message.body = response.message.body;
          }

          logger.info('on re-INVITE accepted', {
            id: this.getSipSessionId(sipSession),
            wasMuted,
            shouldDoScreenSharing,
          });

          this.updateRemoteStream(this.getSipSessionId(sipSession));

          if (wasMuted) {
            this.mute(sipSession);
          }

          this._onAccepted(sipSession, response.session, false);

          if (shouldDoScreenSharing) {
            this.eventEmitter.emit(ON_SCREEN_SHARING_REINVITE, sipSession, response, desktop);
          }

          return this.eventEmitter.emit(ON_REINVITE, sipSession, response);
        },
      },
      sessionDescriptionHandlerModifiers: [replaceLocalIpModifier],
      requestOptions: {
        extraHeaders: [`Subject: ${shouldDoScreenSharing ? 'screenshare' : 'upgrade-video'}`],
      },
      sessionDescriptionHandlerOptions: {
        constraints,
        conference,
        audioOnly,
        offerOptions: {
          iceRestart,
        },
      },
    });
  }

  async getUserMedia(constraints: Object) {
    const newConstraints = {
      audio: this._getAudioConstraints(),
      video: this._getVideoConstraints(constraints.video),
    };

    // $FlowFixMe
    return navigator.mediaDevices.getUserMedia(newConstraints);
  }

  getPeerConnection(sessionId: string) {
    const sipSession = this.sipSessions[sessionId];
    if (!sipSession) {
      return null;
    }

    return sipSession.sessionDescriptionHandler ? sipSession.sessionDescriptionHandler.peerConnection : null;
  }

  // Local streams
  getLocalStream(sessionId: string): ?MediaStream {
    const sipSession = this.sipSessions[sessionId];

    return sipSession && sipSession.sessionDescriptionHandler
      ? sipSession.sessionDescriptionHandler.localMediaStream : null;
  }

  getLocalTracks(sessionId: string): MediaStreamTrack[] {
    const localStream = this.getLocalStream(sessionId);
    if (!localStream) {
      return [];
    }

    return localStream.getTracks();
  }

  hasLocalVideo(sessionId: string): boolean {
    return this.getLocalTracks(sessionId).some(this._isVideoTrack);
  }

  // Check if we have at least one video track, even muted or not live
  hasALocalVideoTrack(sessionId: string): boolean {
    return this.getLocalTracks(sessionId).some(track => track.kind === 'video');
  }

  getLocalVideoStream(sessionId: string): ?MediaStream {
    return this.hasLocalVideo(sessionId) ? this.getLocalStream(sessionId) : null;
  }

  // Remote streams
  getRemoteStream(sessionId: string): ?MediaStream {
    const sipSession = this.sipSessions[sessionId];

    return sipSession && sipSession.sessionDescriptionHandler
      ? sipSession.sessionDescriptionHandler.remoteMediaStream : null;
  }

  getRemoteTracks(sessionId: string): MediaStreamTrack[] {
    const remoteStream = this.getRemoteStream(sessionId);
    if (!remoteStream) {
      return [];
    }

    return remoteStream.getTracks();
  }

  hasRemoteVideo(sessionId: string): boolean {
    return this.getRemoteTracks(sessionId).some(this._isVideoTrack);
  }

  // Check if we have at least one video track, even muted or not live
  hasARemoteVideoTrack(sessionId: string): boolean {
    return this.getRemoteTracks(sessionId).some(track => track.kind === 'video');
  }

  getRemoteVideoStream(sessionId: string): ?MediaStream {
    if (this.isVideoRemotelyHeld(sessionId)) {
      return null;
    }

    return this.hasRemoteVideo(sessionId) ? this.getRemoteStream(sessionId) : null;
  }

  //  Useful in a react-native environment when remoteMediaStream is not updated
  getRemoteVideoStreamFromPc(sessionId: string): ?MediaStream {
    const pc = this.getPeerConnection(sessionId);
    if (!pc) {
      return null;
    }

    return pc.getRemoteStreams().find(stream => !!stream.getVideoTracks().length);
  }

  hasVideo(sessionId: string): boolean {
    return this.hasLocalVideo(sessionId) || this.hasRemoteVideo(sessionId);
  }

  hasAVideoTrack(sessionId: string): boolean {
    return this.hasALocalVideoTrack(sessionId) || this.hasARemoteVideoTrack(sessionId);
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

  // eslint-disable-next-line no-unused-vars
  sessionWantsToDoVideo(session: Inviter) {
    if (!session) {
      return false;
    }
    const { body } = session.request || session;
    // Sometimes with InviteClientContext the body is in the body attribute ...
    const sdp = typeof body === 'object' && body ? body.body : body;

    return hasAnActiveVideo(sdp);
  }

  hasHeartbeat() {
    return this.heartbeat.hasHeartbeat;
  }

  startHeartbeat() {
    logger.info('sdk webrtc start heartbeat', { userAgent: !!this.userAgent });
    if (!this.userAgent) {
      this.heartbeat.stop();
      return;
    }

    this.eventEmitter.off(MESSAGE, this._boundOnHeartbeat);
    this.eventEmitter.on(MESSAGE, this._boundOnHeartbeat);

    this.heartbeat.start();
  }

  stopHeartbeat() {
    logger.info('sdk webrtc stop heartbeat');
    this.heartbeat.stop();
  }

  setOnHeartbeatTimeout(cb: Function) {
    this.heartbeatTimeoutCb = cb;
  }

  setOnHeartbeatCallback(cb: Function) {
    this.heartbeatCb = cb;
  }

  onCallEnded(session: Session) {
    this._cleanupMedia(session);
    delete this.sipSessions[this.getSipSessionId(session)];

    this._stopSendingStats(session);
    this.stopNetworkMonitoring(session);
  }

  attemptReconnection(): void {
    logger.info('attempt reconnection', { userAgent: !!this.userAgent });
    if (!this.userAgent) {
      return;
    }
    this.userAgent.attemptReconnection();
  }

  storeSipSession(session: Session) {
    this.sipSessions[this.getSipSessionId(session)] = session;
  }

  getSipSession(id: string): ?Session {
    return id in this.sipSessions ? this.sipSessions[id] : null;
  }

  getSipSessionIds(): string[] {
    return Object.keys(this.sipSessions);
  }

  setLocalMediaStream(sipSessionId: string, newStream: MediaStream) {
    const sipSession = this.sipSessions[sipSessionId];
    if (!sipSession) {
      return;
    }

    logger.info('setting local media stream', {
      sipSessionId,
      tracks: newStream ? newStream.getTracks() : null,
    });

    // eslint-disable-next-line no-underscore-dangle
    sipSession.sessionDescriptionHandler._localMediaStream = newStream;
  }

  updateLocalStream(sipSessionId: string, newStream: MediaStream) {
    const sipSession = this.sipSessions[sipSessionId];
    if (!sipSession) {
      return;
    }

    const oldStream = this.getLocalStream(sipSessionId);

    logger.info('updating local stream', {
      sipSessionId,
      oldStream: !!oldStream,
      tracks: newStream.getTracks(),
    });

    if (oldStream) {
      this._cleanupStream(oldStream);
    }

    this.setLocalMediaStream(sipSessionId, newStream);

    // Update the local video element
    this._setupMedias(sipSession, newStream);
  }

  updateRemoteStream(sessionId: string) {
    const remoteStream = this.getRemoteStream(sessionId);
    const pc = this.getPeerConnection(sessionId);

    logger.info('Updating remote stream', {
      sessionId,
      tracks: remoteStream ? remoteStream.getTracks() : null,
      receiverTracks: pc && pc.getReceivers ? pc.getReceivers().map(receiver => receiver.track) : null,
    });

    if (!pc || !remoteStream) {
      return;
    }

    remoteStream.getTracks().forEach(track => {
      remoteStream.removeTrack(track);
    });

    if (pc.getReceivers) {
      pc.getReceivers().forEach(receiver => {
        remoteStream.addTrack(receiver.track);
      });
    }
  }

  getMediaConfiguration(enableVideo: boolean, conference: boolean = false, constraints: ?Object = null): Object {
    const screenSharing = constraints && 'screen' in constraints ? constraints.screen : false;
    const isDesktop = constraints && 'desktop' in constraints ? constraints.desktop : false;
    const withAudio = constraints && 'audio' in constraints ? constraints.audio : true;
    const mandatoryVideo = constraints && typeof constraints.video === 'object' ? constraints.video.mandatory : {};

    logger.info('Retrieving media a configuration', { enableVideo, screenSharing, isDesktop, withAudio, constraints });

    return {
      constraints: {
        // Exact constraint are not supported with `getDisplayMedia` and we must have a video=false in desktop screenshare
        audio: screenSharing ? !isDesktop : (withAudio ? this._getAudioConstraints() : false),
        video: screenSharing ? (isDesktop
          ? ({ mandatory: { chromeMediaSource: 'desktop', ...(mandatoryVideo || {}) } }) : { cursor: 'always' })
          : this._getVideoConstraints(enableVideo),
        screen: screenSharing,
        desktop: isDesktop,
        conference,
      },
      enableVideo,
      conference,
      offerOptions: {
        OfferToReceiveAudio: this._hasAudio(),
        OfferToReceiveVideo: enableVideo,
        mandatory: {
          OfferToReceiveAudio: this._hasAudio(),
          OfferToReceiveVideo: enableVideo,
        },
      },
    };
  }

  isConference(sessionId: string) {
    return sessionId in this.conferences;
  }

  createAudioElementFor(sessionId: string) {
    const audio: any = document.createElement('audio');
    audio.setAttribute('id', `audio-${sessionId}`);

    if (audio.setSinkId && this.audioOutputDeviceId) {
      audio.setSinkId(this.audioOutputDeviceId);
    }

    if (document.body) {
      document.body.appendChild(audio);
    }
    this.audioElements[sessionId] = audio;

    audio.volume = this.audioOutputVolume;
    audio.autoplay = true;

    return audio;
  }

  _onTransportError() {
    logger.error('on transport error');
    this.eventEmitter.emit(TRANSPORT_ERROR);
    this.attemptReconnection();
  }

  _onHeartbeat(message: string | Object) {
    const body = message && typeof message === 'object' ? message.data : message;
    if (body && body.indexOf('200 OK') !== -1) {
      if (this.hasHeartbeat()) {
        logger.info('on heartbeat received from Asterisk', { hasHeartbeat: this.hasHeartbeat() });

        this.heartbeat.onHeartbeat();
        if (this.heartbeatCb) {
          this.heartbeatCb();
        }
      }
    }
  }

  async _onHeartbeatTimeout() {
    logger.warn('sdk webrtc heartbeat timed out', { userAgent: !!this.userAgent, cb: !!this.heartbeatTimeoutCb });

    if (this.heartbeatTimeoutCb) {
      this.heartbeatTimeoutCb();
    }

    if (this.userAgent && this.userAgent.transport) {
      // Disconnect from WS and triggers events, but do not trigger disconnect if already disconnecting...
      if (!this.userAgent.transport.transitioningState && !this.userAgent.transport.disconnectPromise) {
        try {
          await this.userAgent.transport.disconnect();
        } catch (e) {
          logger.error('Transport disconnection after heartbeat timeout, error', e);
        }
      }

      // We can invoke disconnect() with an error that can be catcher by `onDisconnect`, so we have to trigger it here.
      this._onTransportError();
    }
  }

  _isWeb() {
    return typeof window === 'object' && typeof document === 'object';
  }

  _isVideoTrack(track: MediaStreamTrack) {
    return track.kind === 'video' && track.readyState === 'live';
  }

  _hasAudio() {
    return this.hasAudio;
  }

  _getAudioConstraints() {
    return this.audio && this.audio.deviceId && this.audio.deviceId.exact ? this.audio : true;
  }

  _getVideoConstraints(video: boolean = false) {
    if (!video) {
      return false;
    }
    return this.video && this.video.deviceId && this.video.deviceId.exact ? this.video : true;
  }

  _connectIfNeeded(): Promise<void> {
    logger.info('connect if needed, checking', { connected: this.isConnected() });
    if (!this.userAgent) {
      logger.info('need to recreate User Agent');
      this.userAgent = this.createUserAgent(this.uaConfigOverrides);
    }

    if (this.isConnected()) {
      logger.info('webrtc sdk, already connected');
      return Promise.resolve();
    }

    if (this.isConnecting()) {
      logger.info('webrtc sdk, already connecting...');

      this.connectionPromise = this.userAgent.transport.connectPromise;
      return this.connectionPromise;
    }

    if (this.connectionPromise) {
      logger.info('webrtc sdk, connection promise connecting...');
      // $FlowFixMe
      return this.connectionPromise;
    }

    logger.info('WebRTC UA needs to connect');

    // Force UA to reconnect
    if (this.userAgent && this.userAgent.state !== UserAgentState.Stopped) {
      this.userAgent.transitionState(UserAgentState.Stopped);
    }
    if (this.userAgent.transport && this.userAgent.transport.state !== TransportState.Disconnected) {
      this.userAgent.transport.transitionState(TransportState.Disconnected);
    }
    this.connectionPromise = this.userAgent.start().catch(console.error);

    return this.connectionPromise;
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

  _createWebRTCConfiguration(configOverrides: Object = {}) {
    let { host } = this.config;
    let port = this.config.port || 443;

    if (this.config.websocketSip) {
      [host, port = 443] = this.config.websocketSip.split(':');
    }

    const config: Object = {
      authorizationUsername: this.config.authorizationUser,
      authorizationPassword: this.config.password,
      displayName: this.config.displayName,
      autoStart: true,
      hackIpInContact: true,
      contactParams: {
        transport: 'wss',
      },
      logBuiltinEnabled: this.config.log ? this.config.log.builtinEnabled : null,
      logLevel: this.config.log ? this.config.log.logLevel : null,
      logConnector: this.config.log ? this.config.log.connector : null,
      uri: this._makeURI(this.config.authorizationUser || ''),
      userAgentString: this.config.userAgentString || 'wazo-sdk',
      reconnectionAttempts: 10000,
      reconnectionDelay: 5,
      sessionDescriptionHandlerFactory: (session: Session, options: SessionDescriptionHandlerFactoryOptions = {}) => {
        const uaLogger = session.userAgent.getLogger('sip.WazoSessionDescriptionHandler');
        const isWeb = this._isWeb();
        const iceGatheringTimeout = 'peerConnectionOptions' in options
          ? options.peerConnectionOptions.iceGatheringTimeout || DEFAULT_ICE_TIMEOUT : DEFAULT_ICE_TIMEOUT;

        const sdhOptions: SessionDescriptionHandlerConfiguration = {
          ...options,
          iceGatheringTimeout,
          peerConnectionConfiguration: {
            ...defaultPeerConnectionConfiguration(),
            ...(options.peerConnectionConfiguration || {}),
          },
        };

        return new WazoSessionDescriptionHandler(uaLogger, wazoMediaStreamFactory, sdhOptions, isWeb, session);
      },
      transportOptions: {
        traceSip: configOverrides.traceSip || false,
        wsServers: `wss://${host}:${port}/api/asterisk/ws`,
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
          iceGatheringTimeout: this.config.iceCheckingTimeout || 1000,
          rtcConfiguration: {
            rtcpMuxPolicy: 'require',
            iceServers: WebRTCClient.getIceServers(this.config.host),
            ...this._getRtcOptions(),
            ...configOverrides.peerConnectionOptions || {},
          },
        },
        // Configuration used in SDH to create the PeerConnection
        peerConnectionConfiguration: {
          rtcpMuxPolicy: 'require',
          iceServers: WebRTCClient.getIceServers(this.config.host),
          ...configOverrides.peerConnectionOptions || {},
        },
      },
    };

    return { ...config, ...configOverrides };
  }

  // eslint-disable-next-line no-unused-vars
  _getRtcOptions() {
    return {
      mandatory: {
        OfferToReceiveAudio: this._hasAudio(),
        OfferToReceiveVideo: false,
      },
    };
  }

  // Invitation and Inviter extends Session
  _setupSession(session: Session) {
    const sipSessionId = this.getSipSessionId(session);

    // When receiving an Invitation, the delegate is not defined.
    if (!session.delegate) {
      session.delegate = {};
    }

    session.delegate.onSessionDescriptionHandler = (sdh: SessionDescriptionHandler) => {
      sdh.on('error', e => {
        this.eventEmitter.emit(ON_ERROR, e);
      });

      sdh.peerConnectionDelegate = {
        onicecandidateerror: (error: Object) => {
          logger.error('on icecandidate error', {
            address: error.address,
            port: error.port,
            errorCode: error.errorCode,
            errorText: error.errorText,
            url: error.url,
          });
        },
      };
    };

    const oldInviteRequest = session.onInviteRequest.bind(session);
    let hadRemoteVideo = false;

    // Monkey patch `onInviteRequest` to be able to know if there was a remote video stream before `onInvite` is called
    // Because when `onInvite` is called we already got the video track
    session.onInviteRequest = (request) => {
      hadRemoteVideo = this.hasARemoteVideoTrack(sipSessionId);

      oldInviteRequest(request);
    };

    session.delegate.onInvite = (request: IncomingRequestMessage) => {
      let updatedCalleeName = null;
      let updatedNumber = null;
      if (session.assertedIdentity) {
        updatedNumber = session.assertedIdentity.uri.normal.user;
        updatedCalleeName = session.assertedIdentity.displayName || updatedNumber;
      }
      logger.info('re-invite received', { updatedCalleeName, updatedNumber, hadRemoteVideo });

      // Useful to know if it's a video upgrade or an unhold from a remote peer with a video stream

      // Update SDP
      // Remote video is handled by the `track` event. Here we're dealing with video stream removal.
      if (session.incomingInviteRequest) {
        session.incomingInviteRequest.message.body = request.body;
      } else {
        session.outgoingInviteRequest.message.body.body = request.body;
      }

      this.updateRemoteStream(sipSessionId);

      this._setupMedias(session);

      return this.eventEmitter.emit(ON_REINVITE, session, request, updatedCalleeName, updatedNumber, hadRemoteVideo);
    };
  }

  _onEarlyProgress(session: SessionDialog) {
    this._setupMedias(session);

    const sessionId = this.getSipSessionId(session).substr(0, 20);
    this.updateRemoteStream(sessionId);

    logger.info('Early media progress progress received', { sessionId });

    this.eventEmitter.emit(ON_EARLY_MEDIA, session);
  }

  _onAccepted(session: Session, sessionDialog?: SessionDialog, withEvent: boolean = true) {
    logger.info('on call accepted', { id: session.id, remoteTag: session.remoteTag });

    this.storeSipSession(session);

    this._setupMedias(session);

    this.updateRemoteStream(this.getSipSessionId(session));

    const pc = session.sessionDescriptionHandler.peerConnection;
    const onTrack = (event: any) => {
      const isAudioOnly = this._isAudioOnly(session);
      const { kind, label, readyState, id, muted } = event.track;
      logger.info('on track event', { isAudioOnly, kind, label, readyState, id, muted });

      // Stop video track in audio only mode
      if (isAudioOnly && kind === 'video') {
        event.track.stop();
      }

      this.eventEmitter.emit(ON_TRACK, session, event);
    };

    if (session.sessionDescriptionHandler.peerConnection) {
      session.sessionDescriptionHandler.peerConnection.addEventListener('track', onTrack);
    }

    session.sessionDescriptionHandler.remoteMediaStream.onaddtrack = onTrack;

    if (pc) {
      pc.oniceconnectionstatechange = () => {
        logger.info('on ice connection state changed', { state: pc.iceConnectionState });
        if (pc.iceConnectionState === 'disconnected') {
          this.eventEmitter.emit(ON_DISCONNECTED);
        }
      };
    }

    if (withEvent) {
      this.eventEmitter.emit(ACCEPTED, session, sessionDialog);
    }

    this._startSendingStats(session);
  }

  _isAudioOnly(session: Session): boolean {
    return session.sessionDescriptionHandlerModifiersReInvite.find(modifier => modifier === stripVideo);
  }

  _setupMedias(session: Session, newStream: ?MediaStream) {
    // Safari hack, because you cannot call .play() from a non user action
    const sessionId = this.getSipSessionId(session);
    const isConference = this.isConference(sessionId);

    if (sessionId in this.audioElements) {
      logger.info('html element already exists for session', { sessionId });
      return;
    }

    if (this._hasAudio() && this._isWeb() && !(sessionId in this.audioElements)) {
      this.createAudioElementFor(sessionId);
    }

    const audioElement = this.audioElements[sessionId];
    const sipSession = this.sipSessions[session.callId];
    const removeStream = this.getRemoteStream(sessionId);
    const earlyStream = sipSession && sipSession.sessionDescriptionHandler
      ? sipSession.sessionDescriptionHandler.remoteMediaStream : null;
    const stream = newStream || removeStream || earlyStream;

    if (!this._isWeb() || !stream) {
      return;
    }

    if (isConference) {
      // Conference local stream is handled in Room
      return;
    }

    if (audioElement.currentTime > 0 && !audioElement.paused && !audioElement.ended && audioElement.readyState > 2) {
      audioElement.pause();
    }
    audioElement.srcObject = stream;
    audioElement.volume = this.audioOutputVolume;
    audioElement.play().catch(() => {});
  }

  _cleanupMedia(session: Session) {
    const sessionId = this.getSipSessionId(session);
    const localStream = this.getLocalStream(sessionId);
    if (localStream) {
      this._cleanupStream(localStream);
    }

    const cleanLocalElement = id => {
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
        cleanLocalElement(this.getSipSessionId(session));
      } else {
        Object.keys(this.audioElements).forEach(id => cleanLocalElement(id));
      }
    }
  }

  _cleanupStream(stream: MediaStream) {
    stream.getTracks().forEach(track => track.stop());
  }

  _toggleAudio(session: Inviter, muteAudio: boolean) {
    const pc = session.sessionDescriptionHandler ? session.sessionDescriptionHandler.peerConnection : null;
    if (!pc) {
      return;
    }

    if (pc.getSenders) {
      pc.getSenders().forEach(sender => {
        if (sender && sender.track && sender.track.kind === 'audio') {
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
        if (sender && sender.track && sender.track.kind === 'video') {
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

    if (pc && pc.getReceivers) {
      remoteStream = typeof global !== 'undefined' && global.window && global.window.MediaStream
        ? new global.window.MediaStream() : new window.MediaStream();
      pc.getReceivers().forEach(receiver => {
        const { track } = receiver;
        if (track) {
          remoteStream.addTrack(track);
        }
      });
    } else if (pc) {
      [remoteStream] = pc.getRemoteStreams();
    }

    return remoteStream;
  }

  _cleanupRegister() {
    if (this.registerer) {
      this.registerer.stateChange.removeAllListeners();
      this.registerer = null;
    }
  }

  _startSendingStats(session: Session) {
    const pc = session.sessionDescriptionHandler.peerConnection;
    if (!pc) {
      return;
    }
    const sessionId = this.getSipSessionId(session);

    getStats(pc, (result: Object) => {
      const { results, internal, nomore, ...stats } = result;
      this.statsIntervals[sessionId] = nomore;

      statsLogger.trace('stats', {
        sessionId,
        ...stats,
      });
    }, SEND_STATS_DELAY);
  }

  _stopSendingStats(session: Session) {
    const sessionId = this.getSipSessionId(session);
    logger.trace('Check for stopping stats', { sessionId, ids: Object.keys(this.statsIntervals) });

    if (sessionId in this.statsIntervals) {
      logger.trace('Stop sending stats for call', { sessionId });
      this.statsIntervals[sessionId]();
      delete this.statsIntervals[sessionId];
    }
  }

  _makeURI(target: string): URI {
    return UserAgent.makeURI(`sip:${target}@${this.config.host}`);
  }

  async _disconnectTransport(force: boolean = false) {
    if (force && this.userAgent && this.userAgent.transport) {
      // Bypass sip.js state machine that prevent to close WS with the state `Connecting`
      this.userAgent.transport.disconnectResolve = () => {};

      if (this.userAgent.transport._ws) {
        this.userAgent.transport._ws.close(1000);
      }

      return;
    }

    // Check if `disconnectPromise` is not present to avoid `Disconnect promise must not be defined` errors.
    if (this.userAgent && this.userAgent.transport && !this.userAgent.transport.disconnectPromise) {
      try {
        await this.userAgent.transport.disconnect();
      } catch (e) {
        logger.error('WebRTC transport disconnect, error', e);
      }
    }
  }

  async _fetchNetworkStats(sessionId: string) {
    const session = this.getSipSession(sessionId);

    const stats = session ? await this.getStats(session) : null;
    if (!stats || !(sessionId in this.sessionNetworkStats)) {
      return;
    }

    const networkStats: Object = {
      audioBytesSent: 0,
      videoBytesSent: 0,
      videoBytesReceived: 0,
      audioBytesReceived: 0,
    };
    const nbStats = this.sessionNetworkStats[sessionId].length;
    const lastNetworkStats = this.sessionNetworkStats[sessionId][nbStats - 1];
    const lastAudioSent = lastNetworkStats ? lastNetworkStats.audioBytesSent : 0;
    const lastAudioContentSent = lastNetworkStats ? lastNetworkStats.audioContentSent : 0;
    const lastVideoSent = lastNetworkStats ? lastNetworkStats.videoBytesSent : 0;
    const lastAudioReceived = lastNetworkStats ? lastNetworkStats.audioBytesReceived : 0;
    const lastAudioContentReceived = lastNetworkStats ? lastNetworkStats.audioContentReceived : 0;
    const lastVideoReceived = lastNetworkStats ? lastNetworkStats.videoBytesReceived : 0;
    const lastTransportSent = lastNetworkStats ? lastNetworkStats.transportSent : 0;
    const lastTransportReceived = lastNetworkStats ? lastNetworkStats.transportReceived : 0;
    let audioBytesSent = 0; // content + header
    let audioBytesReceived = 0; // content + header
    let audioContentSent = 0; // useful to detect blank call
    let audioContentReceived = 0;
    let videoBytesSent = 0;
    let videoBytesReceived = 0;
    let transportSent = 0;
    let transportReceived = 0;
    let packetsLost = 0;

    stats.forEach(report => {
      if (report.type === 'outbound-rtp' && report.kind === 'audio') {
        audioBytesSent += Number(report.bytesSent) + Number(report.headerBytesSent);
        audioContentSent += Number(report.bytesSent);
      }
      if (report.type === 'remote-outbound-rtp' && report.kind === 'audio') {
        audioBytesSent += Number(report.bytesSent);
      }
      if (report.type === 'outbound-rtp' && report.kind === 'video') {
        videoBytesSent += Number(report.bytesSent) + Number(report.headerBytesSent);
      }
      if (report.type === 'inbound-rtp' && report.kind === 'audio') {
        packetsLost += Number(report.packetsLost);
        networkStats.packetsReceived = Number(report.packetsReceived);
        audioBytesReceived += Number(report.bytesReceived) + Number(report.headerBytesReceived);
        audioContentReceived += Number(report.bytesReceived);
      }
      if (report.type === 'inbound-rtp' && report.kind === 'video') {
        videoBytesReceived += Number(report.bytesReceived) + Number(report.headerBytesReceived);
      }
      if (report.type === 'outbound-rtp' && report.kind === 'video') {
        if ('framesPerSecond' in report) {
          networkStats.framesPerSecond = Number(report.framesPerSecond);
        }
        if ('framerateMean' in report) {
          // framerateMean is only available in FF
          networkStats.framesPerSecond = Math.round(report.framerateMean);
        }
      }
      if (report.type === 'remote-inbound-rtp' && report.kind === 'audio') {
        packetsLost += Number(report.packetsLost);
        networkStats.roundTripTime = Number(report.roundTripTime);
        networkStats.jitter = Number(report.jitter);
      }
      if (report.type === 'remote-inbound-rtp' && report.kind === 'video') {
        packetsLost += Number(report.packetsLost);
      }
      if (report.type === 'transport') {
        transportSent += Number(report.bytesSent);
        transportReceived += Number(report.bytesReceived);
      }
    });

    networkStats.packetsLost = packetsLost;

    networkStats.totalAudioBytesSent = audioBytesSent;
    networkStats.audioBytesSent = audioBytesSent - lastAudioSent;
    networkStats.totalAudioBytesReceived = audioBytesReceived - lastAudioReceived;
    networkStats.audioBytesReceived = audioBytesReceived;

    networkStats.totalAudioContentSent = audioContentSent;
    networkStats.audioContentSent = audioContentSent - lastAudioContentSent;
    networkStats.totalAudioBytesReceived = audioContentReceived - lastAudioContentReceived;
    networkStats.audioContentReceived = audioContentReceived;

    networkStats.totalVideoBytesSent = videoBytesSent;
    networkStats.videoBytesSent = videoBytesSent - lastVideoSent;
    networkStats.totalVideoBytesReceived = videoBytesReceived;
    networkStats.videoBytesReceived = videoBytesReceived - lastVideoReceived;
    networkStats.totalTransportSent = transportSent - lastTransportSent;
    networkStats.transportSent = transportSent;
    networkStats.totalTransportReceived = transportReceived;
    networkStats.transportReceived = transportReceived - lastTransportReceived;

    networkStats.bandwidth = networkStats.audioBytesSent + networkStats.audioBytesReceived
      + networkStats.videoBytesSent + networkStats.videoBytesReceived + networkStats.transportReceived
      + networkStats.transportSent;

    this.eventEmitter.emit(ON_NETWORK_STATS, session, networkStats, this.sessionNetworkStats[sessionId]);
    this.sessionNetworkStats[sessionId].push(networkStats);
  }

}
