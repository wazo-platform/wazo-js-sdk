import { EventEmitter } from 'events';
import { type ActorRefFrom, createActor } from 'xstate';

import type Session from '../domain/Session';
import type SipLine from '../domain/SipLine';
import InvalidStateTransition from '../domain/InvalidStateTransition';
import InvalidState from '../domain/InvalidState';

import Wazo from '..';
import softphoneStateMachine, { type ActionTypes, Actions, type StateTypes, States } from '../state-machine/softphone-state-machine';
import { WebRtcConfig, SipCall } from '../domain/types';
import WazoWebRTCClient from '../web-rtc-client';
import IssueReporter from '../service/IssueReporter';
import configureLogger from '../utils/sip-logger';
import Call from './call';

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

type SoftphoneActorRef = ActorRefFrom<typeof softphoneStateMachine>;

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

    this.connectWithCredentials(server, this.sipLine, session.displayName(), options);
  }

  disconnect() {
    this._assertCan(Actions.ACTION_UNREGISTER);
    if (!this.client) {
      return null;
    }

    // @TODO: call terminateAll here

    return this.client.unregister();
  }

  getPrimaryWebRtcLine(): SipLine | null {
    return this.session?.primaryWebRtcLine() || null;
  }

  connectWithCredentials(
    server: string,
    sipLine: SipLine,
    displayName: string,
    rawOptions: Partial<WebRtcConfig> = {},
  ): void {
    this._assertCan(Actions.ACTION_REGISTER);

    this.softphoneActor.send({ type: Actions.ACTION_REGISTER });

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

    this.client.register().then(() => {
      this.softphoneActor.send({ type: Actions.ACTION_REGISTER_DONE });
    }).catch(error => {
      // Avoid exception on `t.server.scheme` in sip transport when losing the webrtc socket connection
      logger.error('WebRTC register error', { message: error.message, stack: error.stack });

      this.softphoneActor.send({ type: Actions.ACTION_UNREGISTER });
    });
  }

  reconnect() {
    // @TODO
  }

  call(options: CallOptions): Call {
    this._assertState(States.STATE_REGISTERED);

    // @TODO
    return new Call({} as any);
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
      const call = new Call(sipSession);
      this.calls.push(call);

      this.eventEmitter.emit(EVENT_INCOMING, call);
    });
  }

  _assertCan(action: ActionTypes): void {
    if (!this._can(action)) {
      const currentState = this.softphoneActor.getSnapshot().value;
      const message = `Invalid state transition from ${currentState} with action ${action}`;
      logger.warn(message);

      throw new InvalidStateTransition(message, action, currentState);
    }
  }

  _assertState(state: StateTypes): void {
    if (!this._hasState(state)) {
      const message = `Invalid state ${state}`;
      logger.warn(message);

      throw new InvalidState(message, state);
    }
  }

  _hasState(state: StateTypes): boolean {
    return this.getState() === state;
  }

  _can(action: ActionTypes): boolean {
    return this.softphoneActor.getSnapshot().can({ type: action });
  }
}

export default new Softphone();
