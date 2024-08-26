/* eslint-disable class-methods-use-this, no-param-reassign, max-classes-per-file, no-underscore-dangle */

/* global document, navigator */
import 'webrtc-adapter';
import type { InviterInviteOptions } from 'sip.js/lib/api/inviter-invite-options';
import type { InvitationRejectOptions } from 'sip.js/lib/api/invitation-reject-options';
import type { InviterCancelOptions } from 'sip.js/lib/api/inviter-cancel-options';
import type { SessionByeOptions } from 'sip.js/lib/api/session-bye-options';
import type { InvitationAcceptOptions } from 'sip.js/lib/api/invitation-accept-options';
import type { SessionDialog } from 'sip.js/lib/core/dialogs/session-dialog';
import type { IncomingRequestMessage } from 'sip.js/lib/core/messages/incoming-request-message';
import type { SessionDescriptionHandler } from 'sip.js/lib/platform/web/session-description-handler/session-description-handler';
import { UserAgentState } from 'sip.js/lib/api/user-agent-state';
import { Parser } from 'sip.js/lib/core/messages/parser';
import { C } from 'sip.js/lib/core/messages/methods/constants';
import { URI } from 'sip.js/lib/grammar/uri';
import { UserAgent } from 'sip.js/lib/api/user-agent';
import { holdModifier, stripVideo } from 'sip.js/lib/platform/web/modifiers/modifiers';

import { Messager } from 'sip.js/lib/api/messager';
import { RegistererState } from 'sip.js/lib/api/registerer-state';
import { SessionState } from 'sip.js/lib/api/session-state';
import { TransportState } from 'sip.js/lib/api/transport-state';
import getStats from 'getstats';

import { OutgoingByeRequest, OutgoingInviteRequest, OutgoingRequest } from 'sip.js/lib/core';
import { Inviter, Invitation, Registerer, SessionDescriptionHandlerOptions } from 'sip.js/lib/api';
import Emitter from './utils/Emitter';
import ApiClient from './api-client';
import IssueReporter from './service/IssueReporter';
import Heartbeat from './utils/Heartbeat';
import { getSipSessionId, makeURI, replaceLocalIpModifier, SIP_ID_LENGTH } from './utils/sdp';
import type { MediaConfig, UserAgentConfigOverrides, WebRtcConfig, IncomingResponse, PeerConnection, WazoSession, WazoTransport } from './domain/types';
import { cleanupStream, createUaOptions, fetchNetworkStats, getAudioConstraints, getLocalStream, getLocalTracks, getLocalVideoStream, getMediaConfiguration, getPeerConnection, getRemoteStream, getRemoteTracks, getRemoteVideoStream, getRemoteVideoStreamFromPc, getStreamFromConstraints, getVideoConstraints, hasALocalVideoTrack, hasARemoteVideoTrack, hasAVideoTrack, hasLocalVideo, hasRemoteVideo, hasVideoTrack, isAudioOnly, isVideoRemotelyHeld, isWeb, sessionWantsToDoVideo, setLocalMediaStream, toggleAudio, toggleVideo, updateRemoteStream } from './utils/webrtc';

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
const ON_PROGRESS = 'onProgress';
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

export default class WebRTCClient extends Emitter {
  clientId: number;

  config: WebRtcConfig;

  uaConfigOverrides?: UserAgentConfigOverrides;

  userAgent: UserAgent | null;

  registerer: Registerer | null;

  hasAudio: boolean;

  audio: MediaTrackConstraintSet | boolean | undefined;

  audioElements: Record<string, HTMLAudioElement>;

  video: MediaTrackConstraintSet | boolean | undefined;

  audioStreams: Record<string, any>;

  audioOutputDeviceId: string | null | undefined;

  audioOutputVolume: number;

  heldSessions: Record<string, any>;

  connectionPromise: Promise<void> | null | undefined;

  _boundOnHeartbeat: (...args: Array<any>) => any;

  heartbeat: Heartbeat;

  heartbeatTimeoutCb: ((...args: Array<any>) => any) | null | undefined;

  heartbeatCb: ((...args: Array<any>) => any) | null | undefined;

  statsIntervals: Record<string, any>;

  sipSessions: Record<string, WazoSession>;

  conferences: Record<string, boolean>;

  skipRegister: boolean;

  networkMonitoringInterval: Record<string, any>;

  sessionNetworkStats: Record<string, Record<string, any>>;

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

  ON_PROGRESS: string;

  ON_DISCONNECTED: string;

  constructor(config: WebRtcConfig, session?: WazoSession, uaConfigOverrides?: UserAgentConfigOverrides) {
    super();

    // For debug purpose
    this.clientId = Math.ceil(Math.random() * 1000);
    logger.info('sdk webrtc constructor', { clientId: this.clientId });

    this.uaConfigOverrides = uaConfigOverrides;
    this.config = config;
    this.skipRegister = config.skipRegister as boolean;

    this._buildConfig(config, session).then((newConfig: WebRtcConfig) => {
      this.config = newConfig;
      this.userAgent = this.createUserAgent(uaConfigOverrides);
    });

    this.audioOutputDeviceId = config.audioDeviceOutput;
    this.audioOutputVolume = config.audioOutputVolume || 1;

    if (config.media) {
      this.configureMedia(config.media);
      this.setMediaConstraints({
        audio: config.media.audio,
        video: config.media.video,
      });
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
    this.ON_PROGRESS = ON_PROGRESS;
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

  createUserAgent(uaConfigOverrides?: UserAgentConfigOverrides): UserAgent {
    const uaOptions = createUaOptions(this.config, uaConfigOverrides, this.audio, this.video);

    logger.info('sdk webrtc, creating UA', {
      uaOptions: { ...uaOptions, authorizationPassword: `${uaOptions?.authorizationPassword?.slice(0, 5)}xxxx` },
      clientId: this.clientId,
    });

    uaOptions.delegate = {
      onConnect: this.onConnect.bind(this),
      onDisconnect: this.onDisconnect.bind(this),
      onInvite: (invitation: Invitation) => {
        logger.info('sdk webrtc on invite', {
          method: 'delegate.onInvite',
          clientId: this.clientId,
          id: getSipSessionId(invitation),
          remoteURI: (invitation as any).remoteURI,
        });

        this._setupSession(invitation);

        const shouldAutoAnswer = !!invitation.request.getHeader('alert-info');
        this.eventEmitter.emit(INVITE, invitation, sessionWantsToDoVideo(invitation), shouldAutoAnswer);
      },
    };
    const ua = new UserAgent(uaOptions);
    ua.start();

    if (ua.transport && (ua.transport as WazoTransport).connectPromise) {
      (ua.transport as WazoTransport).connectPromise.catch((e: any) => {
        logger.warn('Transport connect error', e);
      });
    }

    ua.transport.onMessage = (rawMessage: string) => {
      const message = Parser.parseMessage(rawMessage, (ua.transport as any).logger);
      // We have to re-sent the message to the UA ...
      // @ts-ignore: private
      ua.onTransportMessage(rawMessage);
      // And now do what we want with the message
      this.eventEmitter.emit(MESSAGE, message);

      if (message && message.method === C.MESSAGE) {
        // We have to manually reply to MESSAGE with a 200 OK or Asterisk will hangup.
        ua.userAgentCore.replyStateless(message as any, {
          statusCode: 200,
        });
      }
    };

    return ua;
  }

  isConnected(): boolean {
    return Boolean(this.userAgent?.isConnected());
  }

  isConnecting(): boolean {
    return this.userAgent?.transport?.state === TransportState.Connecting;
  }

  isRegistered(): boolean {
    return Boolean(this.registerer && this.registerer.state === RegistererState.Registered);
  }

  onConnect() {
    logger.info('sdk webrtc connected', { method: 'delegate.onConnect', clientId: this.clientId });
    this.eventEmitter.emit(CONNECTED);

    // @ts-ignore: private
    if (!this.isRegistered() && this.registerer?.waiting) {
      // @ts-ignore: private
      this.registerer.waitingToggle(false);
    }

    return this.register();
  }

  async onDisconnect(error?: Error) {
    logger.info('sdk webrtc disconnected', { method: 'delegate.onConnect', clientId: this.clientId, error });
    this.connectionPromise = null;
    // The UA will attempt to reconnect automatically when an error occurred
    this.eventEmitter.emit(DISCONNECTED, error);

    if (this.isRegistered()) {
      await this.unregister();
      // @ts-ignore: private
      if (this.registerer?.waiting) {
        // @ts-ignore: private
        this.registerer.waitingToggle(false);
      }

      this.eventEmitter.emit(UNREGISTERED);
    }
  }

  async register(tries = 0): Promise<void> {
    const logInfo = {
      clientId: this.clientId,
      userAgent: !!this.userAgent,
      registered: this.isRegistered(),
      connectionPromise: !!this.connectionPromise,
      registerer: !!this.registerer,
      // @ts-ignore: private
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

    // @ts-ignore: private
    if (this.connectionPromise || this.registerer?.waiting) {
      logger.info('sdk webrtc registering aborted due to a registration in progress.', { clientId: this.clientId });
      return Promise.resolve();
    }

    const registerOptions = isWeb() ? {} : {
      extraContactHeaderParams: ['mobility=mobile'],
    };

    const onRegisterFailed = () => {
      logger.info('sdk webrtc registering failed', {
        tries,
        clientId: this.clientId,
        registerer: !!this.registerer,
        forceClosed: this.forceClosed,
      });

      if (this.forceClosed) {
        return;
      }

      this.connectionPromise = null;

      // @ts-ignore: private
      if (this.registerer && this.registerer.waiting) {
        // @ts-ignore: private
        this.registerer.waitingToggle(false);
      }

      if (tries <= MAX_REGISTER_TRIES) {
        logger.info('sdk webrtc registering, retrying...', { clientId: this.clientId, tries });
        setTimeout(() => this.register(tries + 1), 300);
      }
    };

    return this._connectIfNeeded().then(() => {
      // Avoid race condition with the close method called just before register and setting userAgent to null
      // during the resolution of the promise.
      if (!this.userAgent) {
        logger.info('sdk webrtc recreating User Agent after connection');
        this.userAgent = this.createUserAgent(this.uaConfigOverrides);
      }

      logger.info('sdk webrtc registering, transport connected', { registerOptions, ua: !!this.userAgent, clientId: this.clientId });
      this.registerer = new Registerer(this.userAgent, registerOptions);
      this.connectionPromise = null;

      this._monkeyPatchRegisterer(this.registerer);

      // Bind registerer events
      this.registerer.stateChange.addListener(newState => {
        logger.info('sdk webrtc registering, state changed', { newState, clientId: this.clientId });

        if (newState === RegistererState.Registered && this.registerer && this.registerer.state === RegistererState.Registered) {
          this.eventEmitter.emit(REGISTERED);
        } else if (newState === RegistererState.Unregistered) {
          this.eventEmitter.emit(UNREGISTERED);
        }
      });
      const options = {
        requestDelegate: {
          onReject: (response: any) => {
            logger.error('sdk webrtc registering, rejected', { clientId: this.clientId, response });
            onRegisterFailed();
          },
        },
      };
      return this.registerer.register(options).catch(e => {
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
  _monkeyPatchRegisterer(registerer: Registerer | null | undefined): void {
    if (!registerer) {
      return;
    }

    // @ts-ignore: private
    const oldWaitingToggle = registerer.waitingToggle.bind(registerer);
    // @ts-ignore: private
    const oldUnregistered = registerer.unregistered.bind(registerer);

    // @ts-ignore: private
    registerer.waitingToggle = (waiting: boolean) => {
      // @ts-ignore: private
      if (!registerer || registerer.waiting === waiting) {
        return;
      }

      oldWaitingToggle(waiting);
    };

    // @ts-ignore: private
    registerer.unregistered = () => {
      if (!registerer || registerer.state === RegistererState.Terminated) {
        return;
      }

      oldUnregistered();
    };
  }

  async unregister(): Promise<void> {
    logger.info('sdk webrtc unregistering..', {
      clientId: this.clientId,
      userAgent: !!this.userAgent,
      registerer: !!this.registerer,
    });

    try {
      return new Promise((resolve, reject) => {
        if (!this.registerer) {
          return resolve();
        }

        const onRegisterStateChange = (state: string) => {
          if (state === RegistererState.Unregistered) {
            logger.info('sdk webrtc unregistered', { clientId: this.clientId });
            if (this.registerer) {
              this.registerer.stateChange.addListener(onRegisterStateChange);
            }
            this._cleanupRegister();

            resolve();
          }
        };

        this.registerer.stateChange.addListener(onRegisterStateChange);

        this.registerer.unregister().then().catch(e => {
          logger.error('sdk webrtc unregistering, promise error', e);

          this._cleanupRegister();
          reject();
        });
      });
    } catch (e: any) {
      logger.error('sdk webrtc unregistering, error', e);

      // Avoid issue with `undefined is not an object (evaluating 'new.target.prototype')` when triggering a new
      // error when the registerer is in a bad state
      this._cleanupRegister();
    }
  }

  stop(): Promise<void> {
    logger.info('sdk webrtc stop', { clientId: this.clientId, userAgent: !!this.userAgent });

    if (!this.userAgent) {
      return Promise.resolve();
    }

    return this.userAgent.stop().then(() => {
      return this._cleanupRegister();
    }).catch(e => {
      logger.warn('sdk webrtc stop, error', {
        message: e.message,
        stack: e.stack,
      });
    });
  }

  call(number: string, enableVideo?: boolean, audioOnly = false, conference = false, options = {}): WazoSession | null {
    logger.info('sdk webrtc creating call', {
      clientId: this.clientId,
      number,
      enableVideo,
      audioOnly,
      conference,
      options,
    });
    const inviterOptions: Record<string, any> = {
      sessionDescriptionHandlerOptionsReInvite: {
        conference,
        audioOnly,
      },
      earlyMedia: true,
      ...options,
    };

    if (audioOnly) {
      inviterOptions.sessionDescriptionHandlerModifiersReInvite = [stripVideo];
    }

    const uri = makeURI(number, this.config.host);
    let session: WazoSession | null = null;

    if (uri) {
      session = this.userAgent ? new Inviter(this.userAgent, uri, inviterOptions) : null;
    } else {
      logger.error('Null URI');
    }

    if (session) {
      this.storeSipSession(session);

      this._setupSession(session);
    }

    if (conference) {
      this.conferences[getSipSessionId(session)] = true;
    }

    const inviteOptions: InviterInviteOptions = {
      requestDelegate: {
        onAccept: (response: IncomingResponse) => {
          if ((session?.sessionDescriptionHandler as any)?.peerConnection) {
            (session?.sessionDescriptionHandler as any).peerConnection.sfu = conference;
          }
          this._onAccepted(session as WazoSession, response.session, true);
        },
        onProgress: (payload: IncomingResponse) => {
          this._onProgress(payload.session, payload.message.statusCode === 183);
        },
        onReject: (response: IncomingResponse) => {
          logger.info('on call rejected', {
            id: getSipSessionId(session),
            // @ts-ignore: fromTag does not exist
            fromTag: session?.fromTag,
          });

          this._stopSendingStats(session as WazoSession);

          this.stopNetworkMonitoring(session as WazoSession);
          this.eventEmitter.emit(REJECTED, session, response);
        },
      },
      sessionDescriptionHandlerOptions: getMediaConfiguration(enableVideo || false, conference),
    };

    if (inviteOptions.sessionDescriptionHandlerOptions) {
      (inviteOptions.sessionDescriptionHandlerOptions as SessionDescriptionHandlerOptions & { audioOnly?: boolean }).audioOnly = audioOnly;
    }
    inviteOptions.sessionDescriptionHandlerModifiers = [replaceLocalIpModifier];

    if (audioOnly) {
      inviteOptions.sessionDescriptionHandlerModifiers.push(stripVideo);
    }

    if (session) {
      // Do not await invite here or we'll miss the Establishing state transition
      // @ts-ignore: Property 'invitePromise' does not exist
      session.invitePromise = session.invite(inviteOptions).catch((e: Error) => {
        logger.warn('sdk webrtc creating call, error', e);
      });
    }

    return session;
  }

  answer(session: Invitation, enableVideo?: boolean): Promise<void> {
    logger.info('sdk webrtc answer call', {
      clientId: this.clientId,
      id: getSipSessionId(session),
      enableVideo,
    });

    if (!session || !session.accept) {
      const error = 'No session to answer, or not an invitation';
      logger.warn(error);
      return Promise.reject(new Error(error));
    }

    const options = {
      sessionDescriptionHandlerOptions: getMediaConfiguration(enableVideo || false),
    };
    return this._accept(session, options).then(() => {
      // @ts-ignore: private
      if (session.isCanceled) {
        const message = 'accepted a canceled session (or was canceled during the accept phase).';
        logger.error(message, {
          id: getSipSessionId(session),
        });
        this.onCallEnded(session);
        throw new CanceledCallError(message);
      }

      logger.info('sdk webrtc answer, accepted.');

      this._onAccepted(session);
    }).catch(e => {
      logger.error(`answer call error for ${getSipSessionId(session)}`, e);
      throw e;
    });
  }

  async hangup(session: WazoSession): Promise<OutgoingByeRequest | null> {
    const { state, id } = session;
    logger.info('sdk webrtc hangup call', { clientId: this.clientId, id, state });

    try {
      this._stopSendingStats(session);

      this._cleanupMedia(session);

      delete this.sipSessions[getSipSessionId(session)];
      // Check if Invitation or Inviter (Invitation = incoming call)
      const isInviter = session instanceof Inviter;

      // @see github.com/onsip/SIP.js/blob/f11dfd584bc9788ccfc94e03034020672b738975/src/platform/web/simple-user/simple-user.ts#L1004
      const actions: Record<string, any> = {
        [SessionState.Initial]: isInviter ? this._cancel.bind(this, session) : this._reject.bind(this, session),
        [SessionState.Establishing]: isInviter ? this._cancel.bind(this, session) : this._reject.bind(this, session),
        [SessionState.Established]: this._bye.bind(this, session),
      };

      // Handle different session status
      if (actions[state]) {
        return await actions[state]();
      }

      return await this._bye(session);
    } catch (error: any) {
      logger.warn('sdk webrtc hangup, error', error);
    }

    return Promise.resolve(null);
  }

  // Fetch and emit an event at `interval` with session network stats
  startNetworkMonitoring(session: WazoSession, interval = 1000): void {
    const sessionId = getSipSessionId(session);
    logger.info('starting network inspection', {
      id: sessionId,
      clientId: this.clientId,
    });
    this.sessionNetworkStats[sessionId] = [];
    this.networkMonitoringInterval[sessionId] = setInterval(() => this._fetchNetworkStats(sessionId), interval);
  }

  stopNetworkMonitoring(session: WazoSession): void {
    const sessionId = getSipSessionId(session);
    const exists = (sessionId in this.networkMonitoringInterval);
    logger.info('stopping network inspection', {
      clientId: this.clientId,
      id: sessionId,
      exists,
    });

    if (exists) {
      clearInterval(this.networkMonitoringInterval[sessionId] as string);
      delete this.networkMonitoringInterval[sessionId];
      delete this.sessionNetworkStats[sessionId];
    }
  }

  async reject(session: WazoSession): Promise<void> {
    logger.info('sdk webrtc reject call', {
      clientId: this.clientId,
      id: getSipSessionId(session),
    });

    try {
      if (session instanceof Invitation) {
        return this._reject(session);
      }

      if (session instanceof Inviter) {
        return this._cancel(session);
      }
    } catch (e: any) {
      logger.warn('Error when rejecting call', e.message, e.stack);
    }
  }

  async close(force = false): Promise<void> {
    logger.info('sdk webrtc closing client', {
      clientId: this.clientId,
      userAgent: !!this.userAgent,
      force,
    });
    this.forceClosed = force;

    this._cleanupMedia();

    this.connectionPromise = null;
    (Object.values(this.audioElements) as any).forEach((audioElement: HTMLAudioElement) => {
      // eslint-disable-next-line
      audioElement.srcObject = null;
      audioElement.pause();
    });
    this.audioElements = {};

    if (!this.userAgent) {
      return;
    }

    this.stopHeartbeat();
    if (this.userAgent) {
      this.userAgent.delegate = undefined;
    }
    // @ts-ignore: removeAllListeners does not exist
    this.userAgent.stateChange.removeAllListeners();
    await this._disconnectTransport(force);

    this._cleanupRegister();

    try {
      // Prevent `Connect aborted.` error when disconnecting
      (this.userAgent.transport as WazoTransport & { connectReject: () => void }).connectReject = () => {};
      // Don't wait here, It can take ~30s to stop ...
      this.userAgent.stop().catch(console.error);
    } catch (_) { // Avoid to raise exception when trying to close with hanged-up sessions remaining
      // eg: "INVITE not rejectable in state Completed"
    }

    this.userAgent = null;
    logger.info('sdk webrtc client closed', { clientId: this.clientId });
  }

  mute(session: WazoSession): void {
    logger.info('sdk webrtc mute', {
      id: getSipSessionId(session),
    });

    toggleAudio(session, true);
  }

  unmute(session: WazoSession): void {
    logger.info('sdk webrtc unmute', {
      id: getSipSessionId(session),
    });

    toggleAudio(session, false);
  }

  isAudioMuted(session: WazoSession): boolean {
    if (!session || !session.sessionDescriptionHandler) {
      return false;
    }

    let muted = true;
    const pc = (session.sessionDescriptionHandler as SessionDescriptionHandler).peerConnection as PeerConnection;

    if (!pc) {
      return false;
    }

    if (pc.getSenders) {
      if (!pc.getSenders().length) {
        return false;
      }

      pc.getSenders().forEach((sender) => {
        if (sender && sender.track && sender.track.kind === 'audio') {
          muted = muted && !sender.track.enabled;
        }
      });
    } else {
      if (!pc.getLocalStreams().length) {
        return false;
      }

      pc.getLocalStreams().forEach((stream: MediaStream) => {
        stream.getAudioTracks().forEach(track => {
          muted = muted && !track.enabled;
        });
      });
    }

    return muted;
  }

  toggleCameraOn(session: WazoSession): void {
    logger.info('sdk webrtc toggle camera on', {
      id: getSipSessionId(session),
    });

    toggleVideo(session, false);
  }

  toggleCameraOff(session: WazoSession): void {
    logger.info('sdk webrtc toggle camera off', {
      id: getSipSessionId(session),
    });

    toggleVideo(session, true);
  }

  hold(session: WazoSession, isConference = false, hadVideo = false): Promise<OutgoingInviteRequest | void> {
    const sessionId = getSipSessionId(session);
    const hasVideo = hadVideo || this.hasLocalVideo(sessionId);
    logger.info('sdk webrtc hold', {
      sessionId,
      keys: Object.keys(this.heldSessions),
      // @ts-ignore: private
      pendingReinvite: !!session.pendingReinvite,
      isConference,
      hasVideo,
    });

    if (sessionId in this.heldSessions) {
      return Promise.resolve();
    }

    // @ts-ignore: private
    if (session.pendingReinvite) {
      return Promise.resolve();
    }

    this.heldSessions[sessionId] = {
      hasVideo,
      isConference,
    };

    // We should also mute the call, because when holding a call during a voicemail, the audio is still sent with the
    // `sendonly` direction
    this.mute(session);

    session.sessionDescriptionHandlerOptionsReInvite = {
      hold: true,
      conference: isConference,
    } as SessionDescriptionHandlerOptions;
    const options = getMediaConfiguration(false, isConference);

    if (!isWeb()) {
      options.sessionDescriptionHandlerModifiers = [holdModifier];
    }

    options.sessionDescriptionHandlerOptions = {
      constraints: options.constraints,
      hold: true,
      conference: isConference,
    };

    // Avoid sdh to create a new stream
    if (session.sessionDescriptionHandler) {
      // @ts-ignore: private
      (session.sessionDescriptionHandler as SessionDescriptionHandler).localMediaStreamConstraints = options.constraints;
    }

    // Send re-INVITE
    return session.invite(options).catch((e: Error) => {
      logger.warn('sdk webrtc re-invite during hold, error', e);
    });
  }

  unhold(session: WazoSession, isConference = false): Promise<OutgoingInviteRequest | void> {
    const sessionId = getSipSessionId(session);
    const hasVideo = sessionId in this.heldSessions && this.heldSessions[sessionId].hasVideo;
    logger.info('sdk webrtc unhold', {
      sessionId,
      keys: Object.keys(this.heldSessions),
      // @ts-ignore: private
      pendingReinvite: !!session.pendingReinvite,
      isConference,
      hasVideo,
    });

    // @ts-ignore: private
    if (session.pendingReinvite) {
      return Promise.resolve();
    }

    this.unmute(session);

    delete this.heldSessions[getSipSessionId(session)];
    session.sessionDescriptionHandlerOptionsReInvite = {
      hold: false,
      conference: isConference,
    } as SessionDescriptionHandlerOptions;
    const options = getMediaConfiguration(false, isConference);

    if (!isWeb()) {
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
    return session.invite(options).catch((e: Error) => {
      logger.warn('sdk webrtc re-invite during resume, error', e);
    });
  }

  getHeldSession(sessionId: string) {
    return this.heldSessions[sessionId];
  }

  isCallHeld(session: WazoSession): boolean {
    return getSipSessionId(session) in this.heldSessions;
  }

  isVideoRemotelyHeld(sessionId: string): boolean {
    return isVideoRemotelyHeld(this.heldSessions[sessionId]);
  }

  sendDTMF(session: WazoSession, tone: string): boolean {
    if (!session.sessionDescriptionHandler) {
      return false;
    }

    logger.info('Sending DTMF', {
      id: getSipSessionId(session),
      tone,
    });
    return session.sessionDescriptionHandler.sendDtmf(tone);
  }

  message(destination: string, message: string): void {
    const uri = makeURI(destination, this.config.host);
    if (!this.userAgent || !uri) {
      logger.warn('Null value on message', { uri, userAgent: this.userAgent });
      return;
    }
    const messager = new Messager(this.userAgent, uri, message);
    messager.message();
  }

  transfer(session: WazoSession, target: string): void {
    this.hold(session);
    logger.info('Transfering a session', {
      id: getSipSessionId(session),
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
      const uri = makeURI(target, this.config.host);
      if (!uri) {
        logger.warn('transfer timeout: null URI');
        return;
      }
      session.refer(uri, options);
    }, 50);
  }

  // check https://sipjs.com/api/0.12.0/refer/referClientContext/
  atxfer(session: WazoSession): Record<string, any> {
    this.hold(session);
    logger.info('webrtc transfer started', {
      id: getSipSessionId(session),
    });
    const result: Record<string, any> = {
      newSession: null,
      init: async (target: string) => {
        logger.info('webrtc transfer initialized', {
          id: getSipSessionId(session),
          target,
        });
        result.newSession = await this.call(target);
      },
      complete: () => {
        logger.info('webrtc transfer completed', {
          id: getSipSessionId(session),
          referId: getSipSessionId(result.newSession),
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

  // eslint-disable-next-line @typescript-eslint/default-param-last
  sendMessage(sipSession: WazoSession | null = null, body: string, contentType = 'text/plain'): void {
    if (!sipSession) {
      return;
    }

    logger.info('send WebRTC message', {
      sipId: getSipSessionId(sipSession),
      contentType,
    });

    try {
      sipSession.message({
        requestOptions: {
          body: {
            content: body,
            contentType,
            // @HEADSUP: contentDisposition is a required string, setting it to '' arbitrarily
            contentDisposition: '',
          },
        },
      });
    } catch (e: any) {
      console.warn(e);
    }
  }

  pingServer(): OutgoingRequest | void {
    if (!this.isConnected()) {
      return;
    }

    const core = this.userAgent?.userAgentCore;

    const fromURI = makeURI(this.config.authorizationUser || '', this.config.host);

    const toURI = new URI('sip', '', this.config.host);
    if (fromURI) {
      const message = core?.makeOutgoingRequestMessage('OPTIONS', toURI, fromURI, toURI, {});

      if (message) {
        return core?.request(message);
      }

      logger.warn('pingServer: null message');
    }
    logger.warn('pingServer: null fromURI');
  }

  getState(): UserAgentState {
    // @ts-ignore: something fishy here: `states` content doesn't match UserAgentState at all
    return this.userAgent ? states[this.userAgent.state] as UserAgentState : UserAgentState.Stopped;
  }

  getContactIdentifier(): string | null {
    return this.userAgent ? `${this.userAgent.configuration.contactName}/${this.userAgent.contact.uri}` : null;
  }

  changeAudioOutputVolume(volume: number): void {
    logger.info('Changing audio output volume', {
      volume,
    });
    Object.values(this.audioElements).forEach(audioElement => {
      if (audioElement instanceof HTMLAudioElement) {
        // eslint-disable-next-line no-param-reassign
        audioElement.volume = volume;
      }
    });
    this.audioOutputVolume = volume;
  }

  async changeAudioOutputDevice(id: string) {
    logger.info('Changing audio output device', {
      id,
    });
    this.audioOutputDeviceId = id;
    const promises: Promise<void>[] = [];
    Object.values(this.audioElements).forEach(audioElement => promises.push(audioElement.setSinkId(id)));
    await Promise.allSettled(promises);
  }

  async changeAudioInputDevice(id: string, session: WazoSession | null | undefined, force?: boolean): Promise<MediaStream | null> {
    const currentId = this.getAudioDeviceId();
    logger.info('setting audio input device', {
      id,
      currentId,
      session: !!session,
    });

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
      const sdh = session.sessionDescriptionHandler as SessionDescriptionHandler;
      const pc = sdh?.peerConnection;
      const constraints = {
        audio: {
          deviceId: {
            exact: deviceId,
          },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioTrack = stream.getAudioTracks()[0];
      const sender = pc && pc.getSenders && pc.getSenders().find((s) => audioTrack && s && s.track && s.track.kind === audioTrack.kind);

      if (sender) {
        if (sender.track) {
          audioTrack.enabled = sender.track.enabled;
        }

        sender.replaceTrack(audioTrack);
      }

      return stream;
    }

    return null;
  }

  async changeVideoInputDevice(id: string, session?: WazoSession): Promise<MediaStream | void> {
    this.setVideoInputDevice(id);

    if (session) {
      return this.changeSessionVideoInputDevice(id, session);
    }
  }

  setVideoInputDevice(id: string) {
    const currentId = this.getVideoDeviceId();
    logger.info('setting video input device', {
      id,
      currentId,
    });

    if (id === currentId) {
      return null;
    }

    // let's make sure we don't lose other video constraints settings -- width, height, frameRate...
    const videoObject = typeof this.video === 'object' ? this.video : {};
    this.video = { ...videoObject,
      deviceId: {
        exact: id,
      },
    };
  }

  changeSessionVideoInputDevice(id: string | null | undefined, session: WazoSession): Promise<MediaStream | void> {
    if (!sessionWantsToDoVideo(session)) {
      return Promise.resolve();
    }

    const sdh = session.sessionDescriptionHandler as SessionDescriptionHandler;
    const pc = sdh.peerConnection;
    const sessionId = getSipSessionId(session);
    const localStream = this.getLocalStream(sessionId);
    logger.info('changing video input device', {
      id,
      sessionId,
    });

    // Release old video stream
    if (localStream) {
      localStream.getVideoTracks()
        .filter((track: MediaStreamTrack) => track.enabled)
        .forEach((track: MediaStreamTrack) => track.stop());
    }

    const constraints = {
      video: id ? {
        deviceId: {
          exact: id,
        },
      } : true,
    };
    return navigator.mediaDevices.getUserMedia(constraints).then(async stream => {
      const videoTrack = stream.getVideoTracks()[0];
      let sender = pc && pc.getSenders && pc.getSenders().find((s) => videoTrack && s && s.track && s.track.kind === videoTrack.kind);
      let wasTrackEnabled = false;

      if (!sender) {
        sender = pc && pc.getSenders && pc.getSenders().find((s: any) => !s.track);
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
      setLocalMediaStream(this.sipSessions[sessionId], stream);
      return stream;
    });
  }

  getAudioDeviceId(): string | null | undefined {
    return this.audio && typeof this.audio === 'object' && 'deviceId' in this.audio ? (this.audio.deviceId as any)?.exact : undefined;
  }

  getVideoDeviceId(): string | null {
    return this.video && typeof this.video === 'object' && 'deviceId' in this.video ? (this.video.deviceId as any)?.exact : undefined;
  }

  reinvite(sipSession: WazoSession, newConstraints: Record<string, any> | null | undefined = null, conference = false, audioOnly = false, iceRestart = false): Promise<OutgoingInviteRequest | void> {
    if (!sipSession) {
      return Promise.resolve();
    }

    // @ts-ignore: private
    if (sipSession.pendingReinvite) {
      return Promise.resolve();
    }

    const wasMuted = this.isAudioMuted(sipSession);
    const shouldDoVideo = newConstraints ? newConstraints.video : sessionWantsToDoVideo(sipSession);
    const shouldDoScreenSharing = newConstraints && newConstraints.screen;
    const desktop = newConstraints && newConstraints.desktop;
    logger.info('Sending reinvite', {
      clientId: this.clientId,
      id: getSipSessionId(sipSession),
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
      sipSession.sessionDescriptionHandlerModifiersReInvite = modifiers.filter(modifier => modifier !== stripVideo);
    }

    sipSession.sessionDescriptionHandlerOptionsReInvite = { ...sipSession.sessionDescriptionHandlerOptionsReInvite,
      conference,
      audioOnly,
    } as SessionDescriptionHandlerOptions;
    const {
      constraints,
    } = getMediaConfiguration(shouldDoVideo, conference, newConstraints);
    return sipSession.invite({
      requestDelegate: {
        onAccept: (response: IncomingResponse) => {
          // Update the SDP body to be able to call sessionWantsToDoVideo correctly in `_setup[Local|Remote]Media`.
          // Can't set directly sipSession.body because it's a getter.
          // @ts-ignore: private
          if (sipSession instanceof Inviter && sipSession.outgoingRequestMessage.body) {
            // @ts-ignore: private
            sipSession.outgoingRequestMessage.body.body = response.message.body;
          } else if (sipSession instanceof Invitation) {
            // @ts-ignore: private
            sipSession.incomingInviteRequest.message.body = response.message.body;
          }

          logger.info('on re-INVITE accepted', {
            id: getSipSessionId(sipSession),
            wasMuted,
            shouldDoScreenSharing,
          });
          updateRemoteStream(sipSession, false);

          if (wasMuted) {
            this.mute(sipSession);
          }

          this._onAccepted(sipSession, response.session, false, false);

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
      } as SessionDescriptionHandlerOptions,
    });
  }

  async getUserMedia(constraints: Record<string, any>): Promise<MediaStream> {
    const newConstraints = {
      audio: this._getAudioConstraints(),
      video: this._getVideoConstraints(constraints.video),
    };
    return navigator.mediaDevices.getUserMedia(newConstraints);
  }

  getPeerConnection(sessionId: string) {
    return getPeerConnection(this.sipSessions[sessionId]);
  }

  // Local streams
  getLocalStream(sessionId: string): MediaStream | null {
    return getLocalStream(this.sipSessions[sessionId]);
  }

  getLocalTracks(sessionId: string): MediaStreamTrack[] {
    return getLocalTracks(this.sipSessions[sessionId]);
  }

  hasLocalVideo(sessionId: string): boolean {
    return hasLocalVideo(this.sipSessions[sessionId]);
  }

  // Check if we have at least one video track, even muted or not live
  hasALocalVideoTrack(sessionId: string): boolean {
    return hasALocalVideoTrack(this.sipSessions[sessionId]);
  }

  getLocalVideoStream(sessionId: string): MediaStream | null | undefined {
    return getLocalVideoStream(this.sipSessions[sessionId]);
  }

  // Remote streams
  getRemoteStream(sessionId: string): MediaStream | null {
    return getRemoteStream(this.sipSessions[sessionId]);
  }

  getRemoteTracks(sessionId: string): MediaStreamTrack[] {
    return getRemoteTracks(this.sipSessions[sessionId]);
  }

  hasRemoteVideo(sessionId: string): boolean {
    return hasRemoteVideo(this.sipSessions[sessionId]);
  }

  // Check if we have at least one video track, even muted or not live
  hasARemoteVideoTrack(sessionId: string): boolean {
    return hasARemoteVideoTrack(this.sipSessions[sessionId]);
  }

  getRemoteVideoStream(sessionId: string): MediaStream | null | undefined {
    return getRemoteVideoStream(this.sipSessions[sessionId]);
  }

  //  Useful in a react-native environment when remoteMediaStream is not updated
  getRemoteVideoStreamFromPc(sessionId: string): MediaStream | null | undefined {
    return getRemoteVideoStreamFromPc(this.sipSessions[sessionId]);
  }

  hasVideo(sessionId: string): boolean {
    return hasVideoTrack(this.sipSessions[sessionId]);
  }

  hasAVideoTrack(sessionId: string): boolean {
    return hasAVideoTrack(this.sipSessions[sessionId]);
  }

  async waitForRegister(): Promise<void> {
    return new Promise(resolve => this.on(REGISTERED, resolve));
  }

  hasHeartbeat(): boolean {
    return this.heartbeat.hasHeartbeat;
  }

  startHeartbeat(): void {
    logger.info('sdk webrtc start heartbeat', { userAgent: !!this.userAgent, clientId: this.clientId });

    if (!this.userAgent) {
      this.heartbeat.stop();
      return;
    }

    this.eventEmitter.off(MESSAGE, this._boundOnHeartbeat);
    this.eventEmitter.on(MESSAGE, this._boundOnHeartbeat);
    this.heartbeat.start();
  }

  stopHeartbeat(): void {
    logger.info('sdk webrtc stop heartbeat', { clientId: this.clientId });
    this.heartbeat.stop();
  }

  setOnHeartbeatTimeout(cb: (...args: Array<any>) => any): void {
    this.heartbeatTimeoutCb = cb;
  }

  setOnHeartbeatCallback(cb: (...args: Array<any>) => any): void {
    this.heartbeatCb = cb;
  }

  onCallEnded(session: WazoSession): void {
    this._cleanupMedia(session);

    delete this.sipSessions[getSipSessionId(session)];

    this._stopSendingStats(session);

    this.stopNetworkMonitoring(session);
  }

  attemptReconnection(): void {
    logger.info('attempt reconnection', { clientId: this.clientId, userAgent: !!this.userAgent });

    if (!this.userAgent) {
      return;
    }

    // @ts-ignore: private
    this.userAgent.attemptReconnection();
  }

  storeSipSession(session: WazoSession): void {
    const id = getSipSessionId(session);
    logger.info('storing sip session', { id, clientId: this.clientId });

    this.sipSessions[id] = session;
  }

  getSipSession(id: string): WazoSession | null | undefined {
    return id in this.sipSessions ? this.sipSessions[id] : null;
  }

  getSipSessionIds(): string[] {
    return Object.keys(this.sipSessions);
  }

  async updateLocalStream(sipSessionId: string, newStream: MediaStream): Promise<void> {
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
      cleanupStream(oldStream);
    }

    setLocalMediaStream(sipSession, newStream);

    // Update the local video element
    await this._setupMedias(sipSession, newStream);
  }

  isConference(sessionId: string): boolean {
    return sessionId in this.conferences;
  }

  async createAudioElementFor(sessionId: string): Promise<HTMLAudioElement> {
    const audio: HTMLAudioElement = document.createElement('audio');
    audio.setAttribute('id', `audio-${sessionId}`);

    logger.info('creating audio element', { sessionId, audioOutputDeviceId: this.audioOutputDeviceId });

    if (this.audioOutputDeviceId) {
      await audio.setSinkId(this.audioOutputDeviceId);
    }

    if (document.body) {
      document.body.appendChild(audio);
    }

    this.audioElements[sessionId] = audio;
    audio.volume = this.audioOutputVolume;
    audio.autoplay = true;
    return audio;
  }

  _onTransportError(): void {
    logger.error('on transport error');
    this.eventEmitter.emit(TRANSPORT_ERROR);
    this.attemptReconnection();
  }

  enableLogger(logConnector: (level: any, className: string, label: any, content: string) => void): void {
    if (!this.userAgent) {
      return;
    }

    if (this.userAgent?.transport) {
      (this.userAgent.transport as WazoTransport).configuration.traceSip = true;
    }

    // @ts-ignore: private
    this.userAgent.loggerFactory.builtinEnabled = true;
    // @ts-ignore: private
    this.userAgent.loggerFactory.level = 3; // debug
    // @ts-ignore: private
    this.userAgent.loggerFactory.connector = logConnector;
  }

  _onHeartbeat(message: string | Record<string, any>): void {
    const body = message && typeof message === 'object' ? message.data : message;

    if (body && body.indexOf('200 OK') !== -1) {
      if (this.hasHeartbeat()) {
        logger.info('on heartbeat received from Asterisk', {
          hasHeartbeat: this.hasHeartbeat(),
        });
        this.heartbeat.onHeartbeat();

        if (this.heartbeatCb) {
          this.heartbeatCb();
        }
      }
    }
  }

  async _onHeartbeatTimeout(): Promise<void> {
    logger.warn('sdk webrtc heartbeat timed out', {
      userAgent: !!this.userAgent,
      cb: !!this.heartbeatTimeoutCb,
    });

    if (this.heartbeatTimeoutCb) {
      this.heartbeatTimeoutCb();
    }

    if (this.userAgent && this.userAgent.transport) {
      // Disconnect from WS and triggers events, but do not trigger disconnect if already disconnecting...
      const transport = this.userAgent.transport as WazoTransport;
      // @HEADS UP
      if (!transport.transitioningState && !transport.disconnectPromise) {
        try {
          await this.userAgent.transport.disconnect();
        } catch (e: any) {
          logger.error('Transport disconnection after heartbeat timeout, error', e);
        }
      }

      // We can invoke disconnect() with an error that can be catcher by `onDisconnect`, so we have to trigger it here.
      this._onTransportError();
    }
  }

  _hasAudio(): boolean {
    return this.hasAudio;
  }

  _getAudioConstraints(): MediaTrackConstraints | boolean {
    return getAudioConstraints(this.audio);
  }

  _getVideoConstraints(video = false): MediaTrackConstraints | boolean {
    return getVideoConstraints(video && this.video);
  }

  _connectIfNeeded(): Promise<any> {
    logger.info('connect if needed, checking', { connected: this.isConnected(), clientId: this.clientId });

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
      this.connectionPromise = (this.userAgent.transport as WazoTransport).connectPromise;
      return Promise.resolve(this.connectionPromise);
    }

    if (this.connectionPromise) {
      logger.info('webrtc sdk, connection promise connecting...');
      return this.connectionPromise;
    }

    logger.info('WebRTC UA needs to connect');

    // Force UA to reconnect
    if (this.userAgent && this.userAgent.state !== UserAgentState.Stopped) {
      // @ts-ignore: private
      this.userAgent.transitionState(UserAgentState.Stopped);
    }

    if (this.userAgent.transport && this.userAgent.transport.state !== TransportState.Disconnected) {
      (this.userAgent.transport as WazoTransport).transitionState(TransportState.Disconnected);
    }

    this.connectionPromise = this.userAgent.start().catch(console.error);
    return this.connectionPromise;
  }

  _buildConfig(config: WebRtcConfig, session: WazoSession | null | undefined): Promise<WebRtcConfig> {
    // If no session provided, return the configuration directly
    if (!session) {
      return new Promise(resolve => resolve(config));
    }

    const client = new ApiClient({
      server: `${config.host}:${String(config.port || 443)}`,
    });
    client.setToken((session as any).token);
    client.setRefreshToken((session as any).refreshToken);

    return client.confd.getUserLineSipFromToken((session as any).uuid).then(sipLine => ({
      authorizationUser: sipLine.username,
      password: sipLine.secret,
      uri: `${sipLine.username}@${config.host}`,
      ...config,
    }));
  }

  // Invitation and Inviter extends Session
  _setupSession(session: WazoSession): void {
    const sipSessionId = getSipSessionId(session);

    // When receiving an Invitation, the delegate is not defined.
    if (!session.delegate) {
      session.delegate = {};
    }

    session.delegate.onSessionDescriptionHandler = (sdh: SessionDescriptionHandler & { on: (type: string, e: any) => void }) => {
      sdh.on('error', (e: any) => {
        this.eventEmitter.emit(ON_ERROR, e);
      });
      sdh.peerConnectionDelegate = {
        onicecandidateerror: (error: Record<string, any>) => {
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

    // @ts-ignore: protected
    const oldInviteRequest = session.onInviteRequest.bind(session);
    let hadRemoteVideo = false;

    // Monkey patch `onInviteRequest` to be able to know if there was a remote video stream before `onInvite` is called
    // Because when `onInvite` is called we already got the video track
    // @ts-ignore: protected
    session.onInviteRequest = request => {
      hadRemoteVideo = this.hasARemoteVideoTrack(sipSessionId);
      oldInviteRequest(request);
    };

    session.delegate.onInvite = async (request: IncomingRequestMessage) => {
      let updatedCalleeName: string | null = null;
      let updatedNumber = null;

      if (session.assertedIdentity) {
        // @ts-ignore: private
        updatedNumber = session.assertedIdentity.uri.normal.user;
        updatedCalleeName = session.assertedIdentity.displayName || updatedNumber;
      }

      logger.info('re-invite received', {
        updatedCalleeName,
        updatedNumber,
        hadRemoteVideo,
      });

      // Useful to know if it's a video upgrade or an unhold from a remote peer with a video stream
      // Update SDP
      // Remote video is handled by the `track` event. Here we're dealing with video stream removal.
      if (session instanceof Invitation) {
        // @ts-ignore: private
        session.incomingInviteRequest.message.body = request.body;
        // @ts-ignore: private
      } else if (session instanceof Inviter && session.outgoingInviteRequest.message.body) {
        // @ts-ignore: private
        session.outgoingInviteRequest.message.body.body = request.body;
      }

      updateRemoteStream(this.sipSessions[sipSessionId], false);

      await this._setupMedias(session);

      return this.eventEmitter.emit(ON_REINVITE, session, request, updatedCalleeName, updatedNumber, hadRemoteVideo);
    };
  }

  async _onProgress(session: WazoSession, early = false): Promise<void> {
    await this._setupMedias(session);

    const sessionId = getSipSessionId(session);
    updateRemoteStream(session);

    logger.info('progress received', { sessionId, early });
    this.eventEmitter.emit(early ? ON_EARLY_MEDIA : ON_PROGRESS, session);
  }

  async _onAccepted(session: WazoSession, sessionDialog?: SessionDialog, withEvent = true, initAllTracks = true): Promise<void> {
    logger.info('on call accepted', {
      id: getSipSessionId(session),
      clientId: this.clientId,
      remoteTag: session.remoteTag,
    });
    this.storeSipSession(session);

    await this._setupMedias(session);

    updateRemoteStream(session, initAllTracks);
    const pc = getPeerConnection(session);

    const onTrack = (event: RTCTrackEvent | MediaStreamTrackEvent) => {
      const audioOnly = isAudioOnly(session);
      const { kind, label, readyState, id, muted } = event.track;
      logger.info('on track event', { audioOnly, kind, label, readyState, id, muted });

      // Stop video track in audio only mode
      if (audioOnly && kind === 'video') {
        event.track.stop();
      }

      this.eventEmitter.emit(ON_TRACK, session, event);
    };

    const sessionDescriptionHandler = session.sessionDescriptionHandler as SessionDescriptionHandler;
    if (sessionDescriptionHandler?.peerConnection) {
      sessionDescriptionHandler.peerConnection.addEventListener('track', onTrack);
    }

    sessionDescriptionHandler.remoteMediaStream.onaddtrack = onTrack;

    if (pc) {
      pc.oniceconnectionstatechange = () => {
        logger.info('on ice connection state changed', {
          state: pc.iceConnectionState,
        });

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

  async _setupMedias(session: WazoSession, newStream: MediaStream | null | undefined = null): Promise<void> {
    if (!isWeb()) {
      logger.info('Setup media on mobile, no need to setup html element, bailing');
      return;
    }

    // Safari hack, because you cannot call .play() from a non user action
    const sessionId = getSipSessionId(session);
    const isConference = this.isConference(sessionId);

    if (sessionId in this.audioElements) {
      logger.info('html element already exists for session', {
        sessionId,
      });
      return;
    }

    if (this._hasAudio() && isWeb() && !(sessionId in this.audioElements)) {
      await this.createAudioElementFor(sessionId);
    }

    const audioElement = this.audioElements[sessionId];
    const sipSession = this.sipSessions[session.callId as string];
    const removeStream = this.getRemoteStream(sessionId);
    const sdh = sipSession?.sessionDescriptionHandler as SessionDescriptionHandler;
    const earlyStream = sdh ? sdh.remoteMediaStream : null;
    const stream = newStream || removeStream || earlyStream;

    if (!stream) {
      logger.info('Setup media no stream to attach, bailing');
      return;
    }

    const shouldPause = audioElement.currentTime > 0 && !audioElement.paused && !audioElement.ended && audioElement.readyState > 2;

    logger.info('setting up media', {
      sessionId,
      streams: {
        new: !!newStream,
        remove: !!removeStream,
        early: !!earlyStream,
      },
      hasAudio: this._hasAudio(),
      isConference,
      shouldPause,
    });

    if (isConference) {
      // Conference local stream is handled in Room
      return;
    }

    if (shouldPause) {
      audioElement.pause();
    }

    audioElement.srcObject = stream;
    audioElement.volume = this.audioOutputVolume;
    audioElement.play().catch(() => {});
  }

  _cleanupMedia(session?: WazoSession): void {
    const sessionId = getSipSessionId(session);
    const localStream = this.getLocalStream(sessionId);

    if (localStream) {
      cleanupStream(localStream);
    }

    const cleanLocalElement = (id: string) => {
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

    if (this._hasAudio() && isWeb()) {
      if (session) {
        cleanLocalElement(getSipSessionId(session));
      } else {
        Object.keys(this.audioElements).forEach(id => cleanLocalElement(id));
      }
    }
  }

  _cleanupRegister(): void {
    if (this.registerer) {
      // @ts-ignore: removeAllListeners does not exist
      this.registerer.stateChange.removeAllListeners();
      this.registerer = null;
    }
  }

  _startSendingStats(session: WazoSession): void {
    const sdh = session.sessionDescriptionHandler as SessionDescriptionHandler;
    const pc = sdh.peerConnection;

    if (!pc) {
      return;
    }

    const sessionId = getSipSessionId(session);
    getStats(pc, (result: Record<string, any>) => {
      const {
        results,
        internal,
        nomore,
        ...stats
      } = result;
      this.statsIntervals[sessionId] = nomore;
      statsLogger.trace('stats', {
        sessionId,
        ...stats,
      });
    }, SEND_STATS_DELAY);
  }

  _stopSendingStats(session: WazoSession): void {
    const sessionId = getSipSessionId(session);
    logger.trace('Check for stopping stats', {
      sessionId,
      ids: Object.keys(this.statsIntervals),
    });

    if (sessionId in this.statsIntervals) {
      logger.trace('Stop sending stats for call', {
        sessionId,
      });
      this.statsIntervals[sessionId]();
      delete this.statsIntervals[sessionId];
    }
  }

  async _disconnectTransport(force = false) {
    const transport = this.userAgent?.transport as WazoTransport;

    if (force && transport) {
      // Bypass sip.js state machine that prevent to close WS with the state `Connecting`
      transport.disconnectResolve = () => {};

      if (transport._ws) {
        transport._ws.close(1000);
      }

      return;
    }

    // Check if `disconnectPromise` is not present to avoid `Disconnect promise must not be defined` errors.
    if (transport && !transport.disconnectPromise) {
      try {
        await transport.disconnect();
      } catch (e: any) {
        logger.error('WebRTC transport disconnect, error', e);
      }
    }
  }

  async _fetchNetworkStats(sessionId: string): Promise<Record<string, any> | null | undefined> {
    const session = this.sipSessions[sessionId];
    if (!(sessionId in this.sessionNetworkStats)) {
      return Promise.resolve(null);
    }

    const nbStats = this.sessionNetworkStats[sessionId].length;
    const lastNetworkStats = this.sessionNetworkStats[sessionId][nbStats - 1];
    const networkStats = await fetchNetworkStats(session, lastNetworkStats);

    if (this.sessionNetworkStats[sessionId]) {
      this.eventEmitter.emit(ON_NETWORK_STATS, session, networkStats, this.sessionNetworkStats[sessionId]);
      if (sessionId in this.sessionNetworkStats) {
        this.sessionNetworkStats[sessionId].push(networkStats);
      }
    }
  }

  async _accept(session: Invitation, options: InvitationAcceptOptions = {}) {
    if (session.state === SessionState.Terminated || session.state === SessionState.Terminating) {
      const error = 'Trying to accept a terminated sipSession.';
      logger.warn(error, { state: session.state, sessionId: getSipSessionId(session) });
      throw new Error(error);
    }

    if (session.state !== SessionState.Initial) {
      const error = 'Trying to accept a non Initial sipSession.';
      logger.warn(error, { state: session.state, sessionId: getSipSessionId(session) });
      throw new Error(error);
    }

    // @ts-ignore: private
    if (!session.incomingInviteRequest.acceptable) {
      const error = 'Trying to reject a non `acceptable` session';
      logger.warn(error, { state: session.state, sessionId: getSipSessionId(session) });
      throw new Error(error);
    }

    try {
      return await session.accept(options);
    } catch (e) {
      logger.warn('Session accept, error', e);
    }
  }

  async _reject(session: Invitation, options: InvitationRejectOptions = {}) {
    if (session.state !== SessionState.Initial && session.state !== SessionState.Establishing) {
      logger.warn('Trying to reject a session in a wrong state', { state: session.state, sessionId: getSipSessionId(session) });
      return;
    }

    // @ts-ignore: private
    if (!session.incomingInviteRequest.rejectable) {
      logger.warn('Trying to reject a non `rejectable` session', { state: session.state, sessionId: getSipSessionId(session) });
      return;
    }

    try {
      return await session.reject(options);
    } catch (e) {
      logger.warn('Session reject, error', e);
    }
  }

  async _cancel(session: Inviter, options: InviterCancelOptions = {}) {
    if (session.state !== SessionState.Initial && session.state !== SessionState.Establishing) {
      logger.warn('Trying to cancel a session in a wrong state', { state: session.state, sessionId: getSipSessionId(session) });
      return;
    }

    try {
      return await session.cancel(options);
    } catch (e) {
      logger.warn('Session cancel, error', e);
    }
  }

  async _bye(session: WazoSession, options: SessionByeOptions = {}) {
    if (session.state !== SessionState.Established) {
      logger.warn('Trying to end a session in a wrong state', { state: session.state, sessionId: getSipSessionId(session) });
      return null;
    }

    try {
      return await session.bye(options);
    } catch (e) {
      logger.warn('Session bye, error', e);
    }

    return null;
  }
}
