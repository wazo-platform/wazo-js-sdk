/* eslint-disable no-underscore-dangle */
import { EventEmitter } from 'events';
import { createActor } from 'xstate';
import type { Message } from 'sip.js/lib/api/message';
import type { IncomingRequestMessage } from 'sip.js/lib/core/messages/incoming-request-message';

import type Session from '../domain/Session';
import type SipLine from '../domain/SipLine';
import InvalidState from '../domain/InvalidState';

import Wazo from '..';
import softphoneStateMachine, { type SoftphoneActorRef, Actions, type StateTypes, States, ActionTypes } from '../state-machine/softphone-state-machine';
import { Actions as CallActions } from '../state-machine/call-state-machine';
import { WebRtcConfig, SipCall } from '../domain/types';
import WazoWebRTCClient from '../web-rtc-client';
import IssueReporter from '../service/IssueReporter';
import configureLogger from '../utils/sip-logger';
import Call from './call';
import { assertCan, can, getState, waitUntilState } from '../state-machine/utils';

export const EVENT_INCOMING = 'incoming';
export const EVENT_HEARTBEAT = 'heartbeat';
export const EVENT_HEARTBEAT_TIMEOUT = 'heartbeatTimeout';
export const EVENT_REGISTERED = 'registered';
export const EVENT_UNREGISTERED = 'unregistered';
export const EVENT_DISCONNECTED = 'disconnected';
export const EVENT_VIDEO_INPUT_CHANGE = 'videoInputChange';
export const EVENT_ON_MESSAGE = 'message';
export const EVENT_ON_CHAT = 'phone/ON_CHAT';
export const EVENT_ON_SIGNAL = 'phone/ON_SIGNAL';

export const MESSAGE_TYPE_CHAT = 'message/TYPE_CHAT';
export const MESSAGE_TYPE_SIGNAL = 'message/TYPE_SIGNAL';

export type CallOptions = {
  params: {
    To: string,
  },
  withCamera?: boolean,
  // If audioOnly is set to true, all video stream will be deactivated, even remotes ones.
  audioOnly?: boolean,
  conference?: boolean,
  sipLine?: SipLine,
};

const logger = IssueReporter.loggerFor('softphone');

export class Softphone extends EventEmitter {
  audioOutputDeviceId?: string;

  audioRingDeviceId?: string;

  audioOutputVolume: number;

  audioRingVolume: number;

  eventEmitter: EventEmitter;

  calls: Call[];

  client: WazoWebRTCClient;

  session: Session;

  sipLine: SipLine | null;

  softphoneActor: SoftphoneActorRef;

  options: Partial<WebRtcConfig>;

  shouldSendReinvite: boolean;

  constructor() {
    super();

    this.calls = [];

    this.softphoneActor = createActor(softphoneStateMachine);
    this.softphoneActor.start();
  }

  connect(options: Partial<WebRtcConfig> = {}) {
    this.calls = [];
    this.options = options;
    this.audioOutputVolume = 1;
    this.audioRingVolume = 1;

    const server = Wazo.Auth.getHost();
    const session = Wazo.Auth.getSession();

    if (!server || !session) {
      throw new Error('Please connect to the server using `Wazo.Auth.logIn` or `Wazo.Auth.authenticate` before using Room.connect().');
    }

    this.session = session;
    this.sipLine = this.getPrimaryWebRtcLine();

    if (!this.sipLine) {
      throw new Error('Sorry, no sip lines found for this user');
    }

    this.options.userUuid = session.uuid || '';

    return this.connectWithCredentials(server, this.sipLine, session.displayName(), options);
  }

  async disconnect() {
    assertCan(this.softphoneActor, Actions.UNREGISTER);
    if (!this.client) {
      return null;
    }

    // @TODO: call terminateAll here

    return this.client.unregister();
  }

  getPrimaryWebRtcLine(): SipLine | null {
    return this.session?.primaryWebRtcLine() || null;
  }

  async connectWithCredentials(
    server: string,
    sipLine: SipLine,
    displayName: string,
    rawOptions: Partial<WebRtcConfig> = {},
  ): Promise<void> {
    assertCan(this.softphoneActor, Actions.REGISTER);

    this.softphoneActor.send({ type: Actions.REGISTER });

    const [host, port = 443] = server.split(':');
    let options = { ...rawOptions };
    options.media = options.media || {
      audio: true,
      video: false,
    };
    options.uaConfigOverrides = options.uaConfigOverrides || {};

    if (IssueReporter.enabled) {
      options = configureLogger(options);
    }

    this.client = new WazoWebRTCClient({
      host,
      port: typeof port === 'string' ? parseInt(port, 10) : port,
      displayName,
      authorizationUser: sipLine.username,
      password: sipLine.secret,
      uri: `${sipLine.username}@${server}`,
      ...options,
    }, undefined, options.uaConfigOverrides);

    this._bindEvents();

    return this.client.register().catch(error => {
      // Avoid exception on `t.server.scheme` in sip transport when losing the webrtc socket connection
      logger.error('WebRTC register error', { message: error.message, stack: error.stack });

      this._sendAction(Actions.UNREGISTER);
    });
  }

  reconnect() {
    logger.info('Softphone - reconnect', { client: !!this.client });
    if (!this.client) {
      return;
    }

    this.client.attemptReconnection();
  }

  async call(options: CallOptions): Promise<Call | null> {
    logger.info('Calling from softphone', options);

    if (!options.params.To) {
      logger.warn('Calling from softphone with empty number, bailing.');

      return Promise.resolve(null);
    }

    if (this.getState() !== States.UNREGISTERED) {
      throw new InvalidState(`Invalid state ${States.UNREGISTERED}`, States.UNREGISTERED);
    }

    if (this.getState() !== States.REGISTERING) {
      logger.info('Calling when registering, waiting for Softphone to be registered ...');

      await waitUntilState(this.softphoneActor, States.REGISTERED);
    }

    // Hold other calls
    this.holdAllCalls();

    let sipCall: SipCall;

    try {
      sipCall = this.client.call(options.params.To, options.withCamera, options.audioOnly, options.conference, options) as SipCall;
      const call = new Call(sipCall, this);

      return call;
    } catch (error: any) {
      logger.warn('Calling with softphone, error', { message: error.message, stack: error.stack });
      return Promise.resolve(null);
    }
  }

  removeCall(callToRemove: Call) {
    this.calls = this.calls.filter((call: Call) => call.id !== callToRemove.id);
  }

  holdAllCalls(exceptCall: Call | null = null) {
    this.calls.filter(call => !call.isHeld() && call.id === exceptCall?.id).forEach(call => call.hold());
  }

  startHeartbeat() {
    logger.info('WebRTC phone - start heartbeat', { client: !!this.client, hasHeartbeat: this.client.hasHeartbeat() });
    if (!this.client || this.client.hasHeartbeat()) {
      return;
    }

    this.client.startHeartbeat();
  }

  stopHeartbeat() {
    logger.info('WebRTC phone - stopHeartbeat', { client: !!this.client });
    if (!this.client) {
      return;
    }

    this.client.stopHeartbeat();
  }

  changeAudioOutputDevice() {
    // @TODO
  }

  changeAudioInputDevice() {
    // @TODO
  }

  changeVideoInputDevice() {
    // @TODO
  }

  changeRingDevice() {
    // @TODO
  }

  changeAudioVolume() {
    // @TODO
  }

  changeRingVolume() {
    // @TODO
  }

  getCalls(): Call[] {
    return this.calls;
  }

  getState(): StateTypes {
    return this.softphoneActor.getSnapshot().value;
  }

  getUserAgent() {
    return this.client?.config?.userAgentString || 'softphone';
  }

  _bindEvents(): void {
    this.client.on(this.client.INVITE, (sipSession: SipCall) => {
      const call = new Call(sipSession, this);
      call._sendAction(CallActions.INCOMING_CALL);
      this.calls.push(call);

      this.eventEmitter.emit(EVENT_INCOMING, call);
    });

    this.client.on(this.client.ON_REINVITE, (sipCall: SipCall, request: IncomingRequestMessage, updatedCalleeName: string, updatedNumber: string, hadRemoteVideo: boolean) => {
      logger.info('Softphone on reinvite', {
        callId: sipCall.id,
        inviteId: request.callId,
        updatedCalleeName,
        updatedNumber,
        hadRemoteVideo,
      });

      this._onCallEvent(sipCall, 'onReinvite', request, updatedCalleeName, updatedNumber, hadRemoteVideo);
    });

    this.client.on(this.client.ACCEPTED, async (sipCall: SipCall) => {
      this._onCallEvent(sipCall, 'onAccepted');

      if (this.audioOutputDeviceId) {
        await this.client.changeAudioOutputDevice(this.audioOutputDeviceId);
      }
    });

    this.client.on(this.client.ON_ERROR, (e, sipCall: SipCall) => {
      this._onCallEvent(sipCall, 'onError', e);
    });

    this.client.on(this.client.REJECTED, (sipCall: SipCall) => {
      this._onCallEvent(sipCall, 'onRejected');
    });

    this.client.on(this.client.ON_PROGRESS, (sipCall: SipCall) => {
      this._onCallEvent(sipCall, 'onProgress');
    });

    this.client.on(this.client.ON_EARLY_MEDIA, (sipCall: SipCall) => {
      this._onCallEvent(sipCall, 'onEarlyMedia');
    });

    this.client.on(this.client.ON_TRACK, (sipCall: SipCall, event: RTCTrackEvent | MediaStreamTrackEvent) => {
      this._onCallEvent(sipCall, 'onTrack', event);
    });

    this.client.on(this.client.ON_NETWORK_STATS, (sipCall: SipCall, stats: Record<string, any>, previousStats: Record<string, any>) => {
      this._onCallEvent(sipCall, 'onNetworkStats', stats, previousStats);
    });

    // Used when upgrading directly in screenshare mode
    this.client.on(this.client.ON_SCREEN_SHARING_REINVITE, (sipCall: SipCall, response: any, desktop: boolean) => {
      this._onCallEvent(sipCall, 'onScreenshareReinvite', response, desktop);
    });

    this.client.on(this.client.UNREGISTERED, () => {
      logger.info('Softphone unregistered');
      this.eventEmitter.emit(EVENT_UNREGISTERED);

      this._sendAction(Actions.UNREGISTERED);
    });

    this.client.on(this.client.ON_DISCONNECTED, () => {
      logger.info('Softphone disconnected');
      this.eventEmitter.emit(EVENT_DISCONNECTED);

      this._sendAction(Actions.TRANSPORT_CLOSED);
    });

    this.client.on(this.client.REGISTERED, () => {
      logger.info('Softphone registered', { state: getState(this.softphoneActor) });
      if (!can(this.softphoneActor, Actions.REGISTER_DONE)) {
        logger.warn('Softphone registered but not in REGISTERING state', { state: getState(this.softphoneActor) });
        return;
      }

      this.stopHeartbeat();
      this._sendAction(Actions.REGISTER_DONE);

      this.eventEmitter.emit(EVENT_REGISTERED);

      // If the phone registered with a current callSession (eg: when switching network):
      // send a reinvite to renegociate ICE with new IP
      if (this.shouldSendReinvite) {
        this.shouldSendReinvite = false;

        // Send reinvite for all active calls
        this.calls.filter(call => call.isEstablished())
          .forEach(call => { call.sendReinvite({ conference: call.isConference(), iceRestart: true }); });
      }
    });

    this.client.on(this.client.CONNECTED, () => {
      logger.info('WebRTC client connected');
      this.stopHeartbeat();
    });

    this.client.on(this.client.DISCONNECTED, () => {
      logger.info('WebRTC client disconnected');
      this.eventEmitter.emit(EVENT_DISCONNECTED);

      // Do not trigger heartbeat if already running
      if (!this.client.hasHeartbeat()) {
        this.startHeartbeat();
      }

      // Tell to send reinvite when reconnecting
      this.shouldSendReinvite = this.calls.length > 0;
    });

    this.client.on('onVideoInputChange', stream => {
      this.eventEmitter.emit(EVENT_VIDEO_INPUT_CHANGE, stream);
    });

    this.client.on(this.client.MESSAGE, (message: Message) => {
      this._onMessage(message);

      this.eventEmitter.emit(EVENT_ON_MESSAGE, message);
    });

    this.client.setOnHeartbeatTimeout(() => {
      this.eventEmitter.emit(EVENT_HEARTBEAT_TIMEOUT);
    });

    this.client.setOnHeartbeatCallback(() => {
      this.eventEmitter.emit(EVENT_HEARTBEAT);
    });
  }

  _sendAction(action: ActionTypes) {
    this.softphoneActor.send({ type: action });
  }

  _getCall(sipCall: SipCall): Call | undefined {
    return this.calls.find(call => call.id === sipCall.id);
  }

  _onCallEvent(sipCall: SipCall, eventName: string, ...args: any[]) {
    logger.warn('Softphone - received call event', { eventName, sipId: sipCall.id });

    const call = this._getCall(sipCall);
    if (!call) {
      logger.warn('Softphone - no call found to send the event', { eventName, sipId: sipCall.id });
      return;
    }

    // @ts-ignore
    call[eventName](...args);
  }

  _onMessage(message: Message & { method?: string, body?: string }): void {
    if (!message || message.method !== 'MESSAGE') {
      return;
    }

    let body;

    try {
      body = JSON.parse(message.body || '');
    } catch (e: any) {
      return;
    }

    const {
      type,
      content,
    } = body;

    switch (type) {
      case MESSAGE_TYPE_CHAT:
        this.eventEmitter.emit(EVENT_ON_CHAT, content);
        break;

      case MESSAGE_TYPE_SIGNAL:
      {
        this.eventEmitter.emit(EVENT_ON_SIGNAL, content);
        break;
      }

      default:
    }
  }

}

export default new Softphone();
