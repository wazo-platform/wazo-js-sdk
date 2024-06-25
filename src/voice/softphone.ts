import { EventEmitter } from 'events';
import { type ActorRefFrom, createActor } from 'xstate';

import type Session from '../domain/Session';
import type SipLine from '../domain/SipLine';
import InvalidStateError from '../domain/InvalidStateError';

import Wazo from '../index';
import softphoneStateMachine, { type ActionTypes, Actions } from '../state-machine/softphone-state-machine';
import { WebRtcConfig, SipCall } from '../domain/types';
import WazoWebRTCClient from '../web-rtc-client';
import IssueReporter from '../service/IssueReporter';
import configureLogger from '../utils/sip-logger';
import Call from './call';

export const EVENT_INCOMING = 'incoming';

type SoftphoneActorRef = ActorRefFrom<typeof softphoneStateMachine>;

const logger = IssueReporter.loggerFor('softphone');

class Softphone extends EventEmitter {
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
    if (!this.client || !this._can(Actions.ACTION_UNREGISTER)) {
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

    const [host, port = 443] = server.split(':');
    let options = rawOptions;
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
      const message = `Invlid state transition from ${currentState} to ${action}`;
      logger.warn(message);

      throw new InvalidStateError(message, action, currentState);
    }
  }

  _can(action: ActionTypes): boolean {
    return this.softphoneActor.getSnapshot().can({ type: action });
  }
}

export default new Softphone();
