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
import { WebRtcConfig, SipCall } from '../domain/types';
import WazoWebRTCClient from '../web-rtc-client';
import IssueReporter from '../service/IssueReporter';
import configureLogger from '../utils/sip-logger';
import Call from './call';
import { assertCan, can, getState, waitUntilState } from '../state-machine/utils';
import { getSipCallId } from '../utils/sdp';

export const EVENT_INCOMING = 'incoming';
export const EVENT_OUTGOING = 'outgoing';
export const EVENT_HEARTBEAT = 'heartbeat';
export const EVENT_HEARTBEAT_TIMEOUT = 'heartbeatTimeout';
export const EVENT_REGISTERED = 'registered';
export const EVENT_UNREGISTERED = 'unregistered';
export const EVENT_DISCONNECTED = 'disconnected';
export const EVENT_VIDEO_INPUT_CHANGE = 'videoInputChange';
export const EVENT_TERMINATE_SOUND = 'terminateSound';
export const EVENT_PLAY_HANGUP_SOUND = 'playHangupSound';
export const EVENT_PLAY_RING_SOUND = 'playRingSound';
export const EVENT_PLAY_INBOUND_CALL_SOUND = 'playInboundCallSound';
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
  extraHeaders?: Record<string, any>,
};

const logger = IssueReporter.loggerFor('softphone');

export class Softphone extends EventEmitter {
  audioOutputDeviceId?: string;

  audioRingDeviceId?: string;

  audioOutputVolume: number;

  audioRingVolume: number;

  calls: Call[];

  client: WazoWebRTCClient;

  session: Session;

  sipLine: SipLine | null;

  softphoneActor: SoftphoneActorRef;

  options: Partial<WebRtcConfig>;

  shouldSendReinvite: boolean;

  ringingEnabled = true;

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

  async hangupAllCalls() {
    return Promise.all(this.calls.map(call => call.hangup()));
  }

  async disconnect() {
    assertCan(this.softphoneActor, Actions.UNREGISTER);
    if (!this.client) {
      return null;
    }

    // Terminate all calls
    await this.hangupAllCalls();

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
      logger.error('softphone - register error', { message: error.message, stack: error.stack });

      this._sendAction(Actions.UNREGISTER);
    });
  }

  reconnect() {
    logger.info('softphone - reconnect', { client: !!this.client });
    if (!this.client) {
      return;
    }

    this.client.attemptReconnection();
  }

  async call(options: CallOptions): Promise<Call | null> {
    logger.info('softphone - call', options);

    if (!options.params.To) {
      logger.warn('softphone -  calling with empty number, bailing.');

      return Promise.resolve(null);
    }

    if (this.state === States.REGISTERING) {
      logger.info('softphone - calling when registering, waiting for Softphone to be registered ...');

      await waitUntilState(this.softphoneActor, States.REGISTERED);
    }

    if (this.state !== States.REGISTERED) {
      throw new InvalidState(`Invalid state ${States.UNREGISTERED}`, States.UNREGISTERED);
    }

    // Hold other calls
    this.holdAllCalls();

    let sipCall: SipCall;

    try {
      sipCall = this.client.call(options.params.To, options.withCamera, options.audioOnly, options.conference, options) as SipCall;
      const call = new Call(sipCall, this);

      this.calls.push(call);
      this.emit(EVENT_OUTGOING, call);

      return call;
    } catch (error: any) {
      logger.warn('softphone - call, error', { message: error.message, stack: error.stack });
      return Promise.resolve(null);
    }
  }

  removeCall(callToRemove: Call) {
    this.calls = this.calls.filter((call: Call) => call.id !== callToRemove.id);
  }

  onCallTerminated(call: Call) {
    logger.info('softphone - on call terminated', { id: call.id });

    const currentCall = this.getCurrentCall();
    const isCurrentCall = currentCall?.id === call.id;
    const isRinging = call.isRinging();
    const isCurrentIncomingCall = isCurrentCall && isRinging;
    const incomingCalls = this.getIncomingCalls();
    const nbIncomingCalls = incomingCalls.length;

    // Send an event to terminate ringing sound
    if (isCurrentIncomingCall) {
      setTimeout(() => {
        // Avoid race condition when the other is calling and hanging up immediately
        this.emit(EVENT_TERMINATE_SOUND, call, 'call terminated');
      }, 5);
    }

    // If the terminated call was an incoming call, we have to re-trigger if it's was the first incoming call
    // Otherwise, we have to re-trigger an incoming call event if another call is incoming
    const shouldRetrigger = isCurrentCall ? nbIncomingCalls : isCurrentIncomingCall;

    // Re-trigger incoming call event for remaining incoming calls
    logger.info('Softphone - check to re-trigger incoming call', { shouldRetrigger, nbIncomingCalls });

    if (shouldRetrigger && nbIncomingCalls > 1) {
      const nextCall = incomingCalls.find(c => c.id !== call.id);
      // Avoid race condition
      setTimeout(() => {
        if (this.ringingEnabled) {
          if (currentCall) {
            this.emit(EVENT_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, nextCall);
          } else {
            this.emit(EVENT_PLAY_INBOUND_CALL_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, nextCall);
          }
        }

        this.emit(EVENT_INCOMING, nextCall);
      }, 100);
    }

    // @ts-ignore: does not exist
    if (!call.sipCall.isCanceled) {
      setTimeout(() => {
        this.emit(EVENT_PLAY_HANGUP_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, call);
      }, 10);
    }

    this.client.onCallEnded(call.sipCall);

    this.removeCall(call);
  }

  enableRinging(): Promise<void> | void {
    logger.info('softphone - enable ringing');
    this.ringingEnabled = true;
  }

  disableRinging(): Promise<void> | void {
    logger.info('softphone - disable ringing');
    this.ringingEnabled = false;
  }

  holdAllCalls(exceptCall: Call | null = null) {
    this.calls.filter(call => !call.isHeld() && call.id === exceptCall?.id).forEach(call => call.hold());
  }

  startHeartbeat() {
    logger.info('softphone - start heartbeat', { client: !!this.client, hasHeartbeat: this.client.hasHeartbeat() });
    if (!this.client || this.client.hasHeartbeat()) {
      return;
    }

    this.client.startHeartbeat();
  }

  stopHeartbeat() {
    logger.info('softphone - stop heartbeat', { client: !!this.client });
    if (!this.client) {
      return;
    }

    this.client.stopHeartbeat();
  }

  setMediaConstraints(media: MediaStreamConstraints): void {
    this.client.setMediaConstraints(media);
  }

  changeAudioOutputDevice(id: string) {
    logger.info('softphone - change audio device', { deviceId: id });

    this.audioOutputDeviceId = id;
    return this.client.changeAudioOutputDevice(id);
  }

  changeAudioInputDevice(id: string, force?: boolean) {
    logger.info('softphone - changeAudio input device', { deviceId: id });

    const currentCall = this.getCurrentCall();
    return this.client.changeAudioInputDevice(id, currentCall?.sipCall, force);
  }

  changeVideoInputDevice(id: string): Promise<void | MediaStream | null | undefined> {
    logger.info('softphone - change video input device', { deviceId: id });

    const currentCall = this.getCurrentCall();
    return this.client.changeVideoInputDevice(id, currentCall?.sipCall);
  }

  changeRingDevice(id: string) {
    logger.info('softphone - changing ring device', { id });
    this.audioRingDeviceId = id;
  }

  hasSfu(): boolean {
    return this.sipLine?.hasVideoConference() || false;
  }

  // volume is a value between 0 and 1
  changeAudioVolume(volume: number) {
    logger.info('softphone - changing audio volume', { volume });
    this.audioOutputVolume = volume;
    this.client.changeAudioOutputVolume(volume);
  }

  // volume is a value between 0 and 1
  changeRingVolume(volume: number) {
    logger.info('softphone - changing ring volume', { volume });
    this.audioRingVolume = volume;
  }

  getCurrentCall(): Call | undefined {
    return this.getActiveCalls()[0];
  }

  getActiveCalls(): Call[] {
    return this.calls.filter(call => call.isEstablished());
  }

  getIncomingCalls(): Call[] {
    return this.calls.filter(call => call.isRinging());
  }

  get state(): StateTypes {
    return getState(this.softphoneActor) as StateTypes;
  }

  get user() {
    return this.client?.userAgent?.contact?.uri?.user;
  }

  getUserAgent() {
    return this.client?.config?.userAgentString || 'softphone';
  }

  isRegistered() {
    return this.state === States.REGISTERED;
  }

  _bindEvents(): void {
    this.client.on(this.client.INVITE, (sipSession: SipCall) => {
      const call = new Call(sipSession, this);
      logger.info('softphone - on invite', { callId: call.id, number: call.number });

      call.onCallIncoming();
      this.calls.push(call);

      this.emit(EVENT_INCOMING, call);

      if (!this.getCurrentCall()) {
        if (this.ringingEnabled) {
          this.emit(EVENT_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, call);
        }
      } else {
        this.emit(EVENT_PLAY_INBOUND_CALL_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, call);
      }
    });

    this.client.on(this.client.ON_REINVITE, (sipCall: SipCall, request: IncomingRequestMessage, updatedCalleeName: string, updatedNumber: string, hadRemoteVideo: boolean) => {
      logger.info('softphone - on reinvite', {
        callId: getSipCallId(sipCall),
        inviteId: request.callId,
        updatedCalleeName,
        updatedNumber,
        hadRemoteVideo,
      });

      this._onCallEvent(sipCall, 'onReinvite', request, updatedCalleeName, updatedNumber, hadRemoteVideo);
    });

    this.client.on(this.client.ACCEPTED, async (sipCall: SipCall) => {
      const call = this._getCall(sipCall);
      this.emit(EVENT_TERMINATE_SOUND, call, 'call accepted');

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
      logger.info('softphone - unregistered');
      this.emit(EVENT_UNREGISTERED);

      this._sendAction(Actions.UNREGISTERED);
    });

    this.client.on(this.client.ON_DISCONNECTED, () => {
      logger.info('softphone - disconnected');
      this.emit(EVENT_DISCONNECTED);

      this._sendAction(Actions.TRANSPORT_CLOSED);
    });

    this.client.on(this.client.REGISTERED, () => {
      logger.info('softphone - registered', { state: getState(this.softphoneActor) });
      if (!can(this.softphoneActor, Actions.REGISTER_DONE)) {
        logger.warn('softphone - registered but not in REGISTERING state', { state: getState(this.softphoneActor) });
        return;
      }

      this.stopHeartbeat();
      this._sendAction(Actions.REGISTER_DONE);

      this.emit(EVENT_REGISTERED);

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
      logger.info('softphone - connected');
      this.stopHeartbeat();
    });

    this.client.on(this.client.DISCONNECTED, () => {
      logger.info('softphone - disconnected');
      this.emit(EVENT_DISCONNECTED);

      // Do not trigger heartbeat if already running
      if (!this.client.hasHeartbeat()) {
        this.startHeartbeat();
      }

      // Tell to send reinvite when reconnecting
      this.shouldSendReinvite = this.calls.length > 0;
    });

    this.client.on('onVideoInputChange', stream => {
      this.emit(EVENT_VIDEO_INPUT_CHANGE, stream);
    });

    this.client.on(this.client.MESSAGE, (message: Message) => {
      this._onMessage(message);

      this.emit(EVENT_ON_MESSAGE, message);
    });

    this.client.setOnHeartbeatTimeout(() => {
      this.emit(EVENT_HEARTBEAT_TIMEOUT);
    });

    this.client.setOnHeartbeatCallback(() => {
      this.emit(EVENT_HEARTBEAT);
    });
  }

  private _sendAction(action: ActionTypes) {
    this.softphoneActor.send({ type: action });
  }

  private _getCall(sipCall: SipCall): Call | undefined {
    return this.calls.find(call => call.id === getSipCallId(sipCall));
  }

  private _getCallIds(): string[] {
    return this.calls.map(call => call.id);
  }

  private _onCallEvent(sipCall: SipCall, eventName: string, ...args: any[]) {
    logger.info('softphone - received call event', { eventName, sipId: getSipCallId(sipCall) });

    const call = this._getCall(sipCall);
    if (!call) {
      logger.warn('softphone - no call found to send the event', { eventName, sipId: getSipCallId(sipCall), ids: this._getCallIds() });
      return;
    }

    // @ts-ignore
    call[eventName](...args);
  }

  private _onMessage(message: Message & { method?: string, body?: string }): void {
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
        this.emit(EVENT_ON_CHAT, content);
        break;

      case MESSAGE_TYPE_SIGNAL:
      {
        this.emit(EVENT_ON_SIGNAL, content);
        break;
      }

      default:
    }
  }

}

export default new Softphone();
