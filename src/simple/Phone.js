// @flow
import type Inviter from 'sip.js/lib/api/inviter';
import type Invitation from 'sip.js/lib/api/invitation';
import type { Message } from 'sip.js/lib/api/message';
import { SessionState } from 'sip.js/lib/api/session-state';

import type SipLine from '../domain/SipLine';
import type Session from '../domain/Session';
import type CallSession from '../domain/CallSession';
import AdHocAPIConference from '../domain/AdHocAPIConference';
import WebRTCPhone, * as PHONE_EVENTS from '../domain/Phone/WebRTCPhone';
import WazoWebRTCClient, { events as clientEvents, transportEvents } from '../web-rtc-client';
import Emitter from '../utils/Emitter';
import Wazo from './index';

const MESSAGE_TYPE_CHAT = 'message/TYPE_CHAT';
const MESSAGE_TYPE_SIGNAL = 'message/TYPE_SIGNAL';

class Phone extends Emitter {
  client: WazoWebRTCClient;
  phone: ?WebRTCPhone;
  session: Session;
  sipLine: SipLine;

  ON_CHAT: string;
  ON_SIGNAL: string;
  SessionState: Object;

  constructor() {
    super();

    // Sugar syntax for `Wazo.Phone.EVENT_NAME`
    Object.keys(PHONE_EVENTS).forEach(key => {
      // $FlowFixMe
      this[key] = PHONE_EVENTS[key];
    });

    this.ON_CHAT = 'phone/ON_CHAT';
    this.ON_SIGNAL = 'phone/ON_SIGNAL';
    this.SessionState = SessionState;
  }

  async connect(rawOptions: Object = {}, sipLine: ?SipLine = null) {
    const options = rawOptions;
    if (this.phone) {
      // Already connected

      // let's update media constraints if they're being fed
      if (rawOptions.media) {
        this.phone.setMediaConstraints(rawOptions.media);
      }

      return;
    }

    const server = Wazo.Auth.getHost();
    const session = Wazo.Auth.getSession();
    if (!server || !session) {
      throw new Error('Please connect to the server using `Wazo.Auth.logIn` or `Wazo.Auth.authenticate` '
        + 'before using Room.connect().');
    }

    this.session = session;
    this.sipLine = sipLine || this.getPrimaryWebRtcLine();

    if (!this.sipLine) {
      throw new Error('Sorry, no sip lines found for this user');
    }

    const [host, port = 443] = server.split(':');

    options.media = options.media || { audio: true, video: false };

    this.client = new WazoWebRTCClient({
      host,
      port,
      displayName: session.displayName(),
      authorizationUser: this.sipLine.username,
      password: this.sipLine.secret,
      uri: `${this.sipLine.username}@${server}`,
      ...options,
    }, null, options.uaConfigOverrides);

    this.phone = new WebRTCPhone(this.client, options.audioDeviceOutput, true, options.audioDeviceRing);

    this._transferEvents();
  }

  disconnect() {
    if (this.phone) {
      if (this.phone.hasAnActiveCall()) {
        // $FlowFixMe
        this.phone.hangup();
      }
      // $FlowFixMe
      this.phone.close();
    }

    this.phone = null;
  }

  async call(extension: string, withCamera: boolean = false, rawSipLine: ?SipLine = null) {
    if (!this.phone) {
      return;
    }
    const sipLine = rawSipLine || this.getPrimaryWebRtcLine();

    return this.phone.makeCall(extension, sipLine, withCamera);
  }

  async hangup(callSession: CallSession) {
    return this.phone && this.phone.hangup(callSession);
  }

  async accept(callSession: CallSession, cameraEnabled?: boolean) {
    return this.phone && this.phone.accept(callSession, cameraEnabled);
  }

  async startConference(host: CallSession, otherCalls: CallSession[]): Promise<AdHocAPIConference> {
    const participants = [host, ...otherCalls].reduce((acc: Object, participant: CallSession) => {
      acc[participant.getTalkingToIds()[0]] = participant;
      return acc;
    }, {});

    if (!this.phone) {
      return Promise.reject();
    }

    const adHocConference = new AdHocAPIConference({ phone: this.phone, host, participants });

    return adHocConference.start();
  }

  mute(callSession: CallSession) {
    return this.phone && this.phone.mute(callSession);
  }

  unmute(callSession: CallSession) {
    return this.phone && this.phone.unmute(callSession);
  }

  hold(callSession: CallSession) {
    return this.phone && this.phone.hold(callSession);
  }

  unhold(callSession: CallSession) {
    return this.phone && this.phone.unhold(callSession);
  }

  reject(callSession: CallSession) {
    return this.phone && this.phone.reject(callSession);
  }

  transfer(callSession: CallSession, target: string) {
    return this.phone && this.phone.transfer(callSession, target);
  }

  atxfer(sipSession: Inviter | Invitation) {
    return this.phone && this.phone.atxfer(sipSession);
  }

  sendMessage(body: string, sipSession: Inviter | Invitation = null, contentType: string = 'text/plain') {
    const toSipSession = sipSession || this.getCurrentSipSession();
    if (!toSipSession || !this.phone) {
      return null;
    }

    return this.phone.sendMessage(toSipSession, body, contentType);
  }

  sendChat(content: string, sipSession: Inviter | Invitation = null) {
    return this.sendMessage(
      JSON.stringify({ type: MESSAGE_TYPE_CHAT, content }),
      sipSession,
      'application/json',
    );
  }

  sendSignal(content: any, sipSession: Inviter | Invitation = null) {
    return this.sendMessage(
      JSON.stringify({ type: MESSAGE_TYPE_SIGNAL, content }),
      sipSession,
      'application/json',
    );
  }

  turnCameraOff(callSession: CallSession) {
    return this.phone && this.phone.turnCameraOff(callSession);
  }

  turnCameraOn(callSession: CallSession) {
    return this.phone && this.phone.turnCameraOn(callSession);
  }

  async startScreenSharing(constraints: Object, callSession?: CallSession) {
    return this.phone && this.phone.startScreenSharing(constraints, callSession);
  }

  stopScreenSharing(callSession?: CallSession) {
    return this.phone && this.phone.stopScreenSharing(false, callSession);
  }

  sendDTMF(tone: string, callSession: CallSession) {
    return this.phone && this.phone.sendKey(callSession, tone);
  }

  getLocalVideoStream(callSession: CallSession) {
    if (!this.phone || !this.phone.client) {
      return;
    }
    const stream = this.phone.client.videoSessions[callSession.getId()];

    return stream ? stream.local : null;
  }

  getLocalMediaStream(callSession: CallSession) {
    return this.phone && this.phone.getLocalMediaStream(callSession);
  }

  getRemoteStreamForCall(callSession: CallSession) {
    return this.phone && this.phone.getRemoteStreamForCall(callSession);
  }

  getCurrentSipSession() {
    return this.phone ? this.phone.currentSipSession : null;
  }

  getPrimaryWebRtcLine() {
    const session = Wazo.Auth.getSession();
    return session.primaryWebRtcLine();
  }

  getOutputDevice() {
    return this.phone ? this.phone.audioOutputDeviceId : null;
  }

  getPrimaryLine() {
    const session = Wazo.Auth.getSession();
    return session.primarySipLine();
  }

  getLineById(lineId: string) {
    return this.getSipLines().find(line => line && line.id === lineId);
  }

  getSipLines() {
    const session = Wazo.Auth.getSession();
    if (!session) {
      return [];
    }

    return session.profile ? session.profile.sipLines : [];
  }

  _transferEvents() {
    this.unbind();
    [...clientEvents, ...transportEvents].forEach(event => {
      this.client.on(event, (...args) =>
        this.eventEmitter.emit.apply(this.eventEmitter.emit, [`client-${event}`, ...args]));
    });

    Object.values(PHONE_EVENTS).forEach(event => {
      if (typeof event !== 'string' || !this.phone || event === PHONE_EVENTS.ON_MESSAGE) {
        return;
      }
      this.phone.on(event, (...args) => this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args]));
    });

    if (!this.phone) {
      return;
    }

    this.phone.on(PHONE_EVENTS.ON_MESSAGE, args => {
      this._onMessage(args);
      this.eventEmitter.emit(PHONE_EVENTS.ON_MESSAGE, args);
    });
  }

  hasSfu() {
    return this.sipLine && this.sipLine.hasVideoConference();
  }

  checkSfu() {
    if (!this.hasSfu()) {
      throw new Error('Sorry your user is not configured to support video conference');
    }
  }

  _onMessage(message: Message) {
    if (message.method !== 'MESSAGE') {
      return;
    }

    let body;

    try {
      body = JSON.parse(message.body);
    } catch (e) {
      return;
    }

    switch (body.type) {
      case MESSAGE_TYPE_CHAT:
        this.eventEmitter.emit(this.ON_CHAT, body.content);
        break;

      case MESSAGE_TYPE_SIGNAL: {
        this.eventEmitter.emit(this.ON_SIGNAL, body.content);
        break;
      }

      default:
    }

    this.eventEmitter.emit(PHONE_EVENTS.ON_MESSAGE, message);
  }
}

if (!global.wazoTelephonyInstance) {
  global.wazoTelephonyInstance = new Phone();
}

export default global.wazoTelephonyInstance;
