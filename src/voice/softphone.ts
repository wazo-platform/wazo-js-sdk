/* eslint-disable no-underscore-dangle */
import { EventEmitter } from 'events';
import { createActor } from 'xstate';

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
import { assertCan, waitUntilState } from '../state-machine/utils';

export const EVENT_INCOMING = 'incoming';

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

    return this.client.register().then(() => {
      this._sendAction(Actions.REGISTER_DONE);
    }).catch(error => {
      // Avoid exception on `t.server.scheme` in sip transport when losing the webrtc socket connection
      logger.error('WebRTC register error', { message: error.message, stack: error.stack });

      this._sendAction(Actions.UNREGISTER);
    });
  }

  reconnect() {
    // @TODO
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
    // @TODO
  }

  stopHeartbeat() {
    // @TODO
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

  _bindEvents(): void {
    this.client.on(this.client.INVITE, (sipSession: SipCall) => {
      const call = new Call(sipSession, this);
      call._sendAction(CallActions.INCOMING_CALL);
      this.calls.push(call);

      this.eventEmitter.emit(EVENT_INCOMING, call);
    });
  }

  _sendAction(action: ActionTypes) {
    this.softphoneActor.send({ type: action });
  }
}

export default new Softphone();
