// @flow
import type SipLine from '../domain/SipLine';
import type Session from '../domain/Session';
import type CallSession from '../domain/CallSession';
import getApiClient from '../service/getApiClient';
import WebRTCPhone, * as PHONE_EVENTS from '../domain/Phone/WebRTCPhone';
import WazoWebRTCClient, { events as clientEvents, transportEvents } from '../web-rtc-client';
import Emitter from '../utils/Emitter';
import SIP from '../sip';
import Wazo from './index';

class Phone extends Emitter {
  client: WazoWebRTCClient;
  phone: ?WebRTCPhone;
  session: Session;
  sipLine: SipLine;

  constructor() {
    super();

    // Sugar syntax for `Wazo.Phone.EVENT_NAME`
    Object.keys(PHONE_EVENTS).forEach(key => {
      // $FlowFixMe
      this[key] = PHONE_EVENTS[key];
    });
  }

  async connect(rawOptions: Object = {}, sipLine: ?SipLine = null) {
    const options = rawOptions;
    if (this.phone) {
      // Already connected
      return;
    }

    const server = Wazo.Auth.getHost();
    const session = Wazo.Auth.getSession();
    if (!server || !session) {
      throw new Error('Please connect to the server using `Wazo.Auth.logIn` or `Wazo.Auth.authenticate` '
        + 'before using Room.connect().');
    }

    this.session = session;
    this.sipLine = sipLine || await this._getWebRtcLine();

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
    });

    this.phone = new WebRTCPhone(this.client, null, true);

    await this.client.waitForRegister();

    this._transferEvents();
  }

  disconnect() {
    if (this.phone) {
      this.phone.close();
    }

    this.phone = null;
  }

  async call(extension: string, withCamera: boolean = false, rawSipLine: ?SipLine = null) {
    if (!this.phone) {
      return;
    }
    const sipLine = rawSipLine || await this._getWebRtcLine();

    return this.phone.makeCall(extension, sipLine, withCamera);
  }

  async hangup(callSession: CallSession) {
    return this.phone && this.phone.hangup(callSession);
  }

  mute(callSession: CallSession) {
    return this.phone && this.phone.mute(callSession);
  }

  unmute(callSession: CallSession) {
    return this.phone && this.phone.unmute(callSession);
  }

  sendMessage(body: string, sipSession: SIP.sessionDescriptionHandler = null) {
    const toSipSession = sipSession || (this.phone ? this.phone.currentSipSession : null);
    if (!toSipSession || !this.phone) {
      return null;
    }

    return this.phone.sendMessage(toSipSession, body);
  }

  turnCameraOff(callSession: CallSession) {
    return this.phone && this.phone.turnCameraOff(callSession);
  }

  turnCameraOn(callSession: CallSession) {
    return this.phone && this.phone.turnCameraOn(callSession);
  }

  async startScreenSharing(constraints: Object) {
    return this.phone && this.phone.startScreenSharing(constraints);
  }

  stopScreenSharing() {
    return this.phone && this.phone.stopScreenSharing();
  }

  getLocalVideoStream(callSession: CallSession) {
    if (!this.phone || !this.phone.client) {
      return;
    }
    const stream = this.phone.client.videoSessions[callSession.getId()];

    return stream ? stream.local : null;
  }

  _transferEvents() {
    this.unbind();
    [...clientEvents, ...transportEvents].forEach(event => {
      this.client.on(event, (...args) =>
        this.eventEmitter.emit.apply(this.eventEmitter.emit, [`client-${event}`, ...args]));
    });

    Object.values(PHONE_EVENTS).forEach(event => {
      if (typeof event !== 'string' || !this.phone) {
        return;
      }
      this.phone.on(event, (...args) => this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args]));
    });
  }

  async _getWebRtcLine() {
    const lines: any = await this._getSipLines();
    return lines.find(sipLine => sipLine.isWebRtc());
  }

  checkSfu() {
    const hasSfu = this.sipLine.options.some(option =>
      option[0] === 'max_audio_streams' || option[0] === 'max_video_streams');
    if (!hasSfu) {
      throw new Error('Sorry your user is not configured to support video conference');
    }
  }

  async _getSipLines() {
    if (!this.session) {
      return;
    }
    const lines = this.session.profile ? this.session.profile.lines : [];
    return getApiClient().confd.getUserLinesSip(this.session.uuid, lines.map(line => line.id));
  }
}

if (!global.wazoTelephonyInstance) {
  global.wazoTelephonyInstance = new Phone();
}

export default global.wazoTelephonyInstance;
