import { SessionState } from 'sip.js/lib/api/session-state';
import { Inviter, Invitation } from 'sip.js/lib/api';
import { OutgoingInviteRequest } from 'sip.js/lib/core';
import type SipLine from '../domain/SipLine';
import type Session from '../domain/Session';
import type CallSession from '../domain/CallSession';
import AdHocAPIConference from '../domain/AdHocAPIConference';
import WebRTCPhone, * as PHONE_EVENTS from '../domain/Phone/WebRTCPhone';
import { MESSAGE_TYPE_CHAT, MESSAGE_TYPE_SIGNAL } from '../domain/Phone/WebRTCPhone';
import WazoWebRTCClient, { events as clientEvents, transportEvents } from '../web-rtc-client';
import IssueReporter from '../service/IssueReporter';
import Emitter, { IEmitter } from '../utils/Emitter';
import Wazo from './index';
import SFUNotAvailableError from '../domain/SFUNotAvailableError';

const logger = IssueReporter.loggerFor('simple-phone');
const sipLogger = IssueReporter.loggerFor('sip.js');
const protocolLogger = IssueReporter.loggerFor('sip');
const protocolDebugMessages = ['Received WebSocket text message:', 'Sending WebSocket message:'];

export interface IPhone extends IEmitter {
  client: WazoWebRTCClient;
  phone: WebRTCPhone | null | undefined;
  session: Session;
  sipLine: SipLine | null | undefined;
  SessionState: Record<string, any>;

  ON_USER_AGENT: string;
  ON_REGISTERED: string;
  ON_UNREGISTERED: string;
  ON_PROGRESS: string;
  ON_CALL_ACCEPTED: string;
  ON_CALL_ANSWERED: string;
  ON_CALL_INCOMING: string;
  ON_CALL_OUTGOING: string;
  ON_CALL_MUTED: string;
  ON_CALL_UNMUTED: string;
  ON_CALL_RESUMED: string;
  ON_CALL_HELD: string;
  ON_CALL_UNHELD: string;
  ON_CAMERA_DISABLED: string;
  ON_CAMERA_RESUMED: string;
  ON_CALL_CANCELED: string;
  ON_CALL_FAILED: string;
  ON_CALL_REJECTED: string;
  ON_CALL_ENDED: string;
  ON_CALL_ENDING: string;
  ON_MESSAGE: string;
  ON_REINVITE: string;
  ON_TRACK: string;
  ON_AUDIO_STREAM: string;
  ON_VIDEO_STREAM: string;
  ON_REMOVE_STREAM: string;
  ON_SHARE_SCREEN_STARTED: string;
  ON_SHARE_SCREEN_ENDING: string;
  ON_SHARE_SCREEN_ENDED: string;
  ON_TERMINATE_SOUND: string;
  ON_PLAY_RING_SOUND: string;
  ON_PLAY_INBOUND_CALL_SIGNAL_SOUND: string;
  ON_PLAY_HANGUP_SOUND: string;
  ON_PLAY_PROGRESS_SOUND: string;
  ON_VIDEO_INPUT_CHANGE: string;
  ON_CALL_ERROR: string;
  ON_MESSAGE_TRACK_UPDATED: string;
  ON_NETWORK_STATS: string;
  ON_CHAT: string;
  ON_SIGNAL: string;
  ON_DISCONNECTED: string;
  ON_EARLY_MEDIA: string;
  MESSAGE_TYPE_CHAT: string;
  MESSAGE_TYPE_SIGNAL: string;

  connect: (options: Record<string, any>, sipLine?: SipLine | null | undefined) => Promise<void>;
  connectWithCredentials: (server: string, sipLine: SipLine, displayName: string, rawOptions: Record<string, any>) => void;
  disconnect: () => Promise<void>;
  call: (extension: string, withCamera, rawSipLine: SipLine | null | undefined, audioOnly, conference) => Promise<CallSession | null | undefined>;
  hangup: (callSession: CallSession) => Promise<boolean> ;
  startConference: (host: CallSession, otherCalls: CallSession[]) => Promise<AdHocAPIConference>;
  mute: (callSession: CallSession, withApi?: boolean) => void;
  unmute: (callSession: CallSession, withApi?: boolean) => void;
  muteViaAPI: (callSession: CallSession) => void;
  unmuteViaAPI: (callSession: CallSession) => void;
  hold: (callSession: CallSession) => Promise<void | OutgoingInviteRequest> | null | undefined;
  unhold: (callSession: CallSession) => Promise<MediaStream | void | null | undefined>;
  resume: (callSession: CallSession) => Promise<MediaStream | null | void>;
  reject: (callSession: CallSession) => Promise<void> | undefined;
  transfer: (callSession: CallSession, target: string) => void;
  atxfer: (callSession: CallSession) => Record<string, any> | null;
  reinvite: (callSession: CallSession, constraints: (Record<string, any> | null), conference) => Promise<OutgoingInviteRequest | void | null>;
  getStats: (callSession: CallSession) => Promise<RTCStatsReport | null | undefined>;
  startNetworkMonitoring: (callSession: CallSession, interval) => void;
  stopNetworkMonitoring: (callSession: CallSession) => void;
  getSipSessionId: (sipSession: Invitation | Inviter) => string | null | undefined;
  sendMessage: (body: string, sipSession?: Inviter | Invitation, contentType?: string) => void;
  sendChat: (content: string, sipSession?: Inviter | Invitation) => void;
  sendSignal: (content: any, sipSession?: Inviter | Invitation) => void ;
  turnCameraOff: (callSession: CallSession) => void;
  turnCameraOn: (callSession: CallSession) => void;
  startScreenSharing: (constraints: Record<string, any>, callSession?: CallSession) => Promise<MediaStream | null>;
  stopScreenSharing: (callSession?: CallSession, restoreLocalStream?: boolean) => Promise<OutgoingInviteRequest | void>;
  sendDTMF: (tone: string, callSession: CallSession) => void;
  getLocalStream: (callSession: CallSession) => MediaStream | null | undefined ;
  hasLocalVideo: (callSession: CallSession) => boolean;
  hasALocalVideoTrack: (callSession: CallSession) => boolean;
  getLocalMediaStream: (callSession: CallSession) => MediaStream | null | undefined;
  getLocalVideoStream: (callSession: CallSession) => MediaStream | null;
  getRemoteStream: (callSession: CallSession) => MediaStream | null;
  getRemoteVideoStream: (callSession: CallSession) => MediaStream | null ;
  isVideoRemotelyHeld: (callSession: CallSession) => boolean;
  getRemoteStreamForCall: (callSession: CallSession) => MediaStream | null;
  getRemoteStreamsForCall: (callSession: CallSession) => MediaStream | null;
  getRemoteVideoStreamForCall: (callSession: CallSession) => MediaStream | null;
  getRemoteVideoStreamFromPc: (callSession: CallSession) => MediaStream | null;
  hasVideo: (callSession: CallSession) => boolean;
  hasAVideoTrack: (callSession: CallSession) => boolean;
  getCurrentSipSession: () => Invitation | Inviter | null;
  getPrimaryWebRtcLine: () => SipLine | null;
  getOutputDevice: () => string | null ;
  getPrimaryLine: () => SipLine | null;
  getLineById: (lineId: string) => SipLine | null;
  getSipLines: () => SipLine[];
  hasSfu: () => boolean;
  checkSfu: () => void;
  _transferEvents: () => void;
}

class Phone extends Emitter implements IPhone {
  client: WazoWebRTCClient;

  phone: WebRTCPhone | null | undefined;

  session: Session;

  sipLine: SipLine | null | undefined;

  SessionState: Record<string, any>;

  ON_USER_AGENT: string;

  ON_REGISTERED: string;

  ON_UNREGISTERED: string;

  ON_PROGRESS: string;

  ON_CALL_ACCEPTED: string;

  ON_CALL_ANSWERED: string;

  ON_CALL_INCOMING: string;

  ON_CALL_OUTGOING: string;

  ON_CALL_MUTED: string;

  ON_CALL_UNMUTED: string;

  ON_CALL_RESUMED: string;

  ON_CALL_HELD: string;

  ON_CALL_UNHELD: string;

  ON_CAMERA_DISABLED: string;

  ON_CAMERA_RESUMED: string;

  ON_CALL_CANCELED: string;

  ON_CALL_FAILED: string;

  ON_CALL_REJECTED: string;

  ON_CALL_ENDED: string;

  ON_CALL_ENDING: string;

  ON_MESSAGE: string;

  ON_REINVITE: string;

  ON_TRACK: string;

  ON_AUDIO_STREAM: string;

  ON_VIDEO_STREAM: string;

  ON_REMOVE_STREAM: string;

  ON_SHARE_SCREEN_STARTED: string;

  ON_SHARE_SCREEN_ENDING: string;

  ON_SHARE_SCREEN_ENDED: string;

  ON_TERMINATE_SOUND: string;

  ON_PLAY_RING_SOUND: string;

  ON_PLAY_INBOUND_CALL_SIGNAL_SOUND: string;

  ON_PLAY_HANGUP_SOUND: string;

  ON_PLAY_PROGRESS_SOUND: string;

  ON_VIDEO_INPUT_CHANGE: string;

  ON_CALL_ERROR: string;

  ON_MESSAGE_TRACK_UPDATED: string;

  ON_NETWORK_STATS: string;

  ON_CHAT: string;

  ON_SIGNAL: string;

  ON_DISCONNECTED: string;

  ON_EARLY_MEDIA: string;

  MESSAGE_TYPE_CHAT: string;

  MESSAGE_TYPE_SIGNAL: string;

  constructor() {
    super();
    // Sugar syntax for `Wazo.Phone.EVENT_NAME`
    Object.keys(PHONE_EVENTS).forEach(key => {
      this[key] = PHONE_EVENTS[key];
    });
    this.SessionState = SessionState;
  }

  async connect(options: Record<string, any> = {}, sipLine: SipLine | null | undefined = null): Promise<void> {
    if (this.phone) {
      // Already connected
      // let's update media constraints if they're being fed
      if (options.media) {
        this.phone.setMediaConstraints(options.media);
      }

      return;
    }

    const server = Wazo.Auth.getHost();
    const session = Wazo.Auth.getSession();

    if (!server || !session) {
      throw new Error('Please connect to the server using `Wazo.Auth.logIn` or `Wazo.Auth.authenticate` before using Room.connect().');
    }

    this.session = session;
    this.sipLine = sipLine || this.getPrimaryWebRtcLine();

    if (!this.sipLine) {
      throw new Error('Sorry, no sip lines found for this user');
    }

    this.connectWithCredentials(server, this.sipLine, session.displayName(), options);
  }

  connectWithCredentials(server: string, sipLine: SipLine, displayName: string, rawOptions: Record<string, any> = {}): void {
    if (this.phone) {
      // Already connected
      return;
    }

    const [host, port = 443] = server.split(':');
    const options = rawOptions;
    options.media = options.media || {
      audio: true,
      video: false,
    };
    options.uaConfigOverrides = options.uaConfigOverrides || {};

    if (IssueReporter.enabled) {
      options.uaConfigOverrides.traceSip = true;
      options.log = options.log || {};
      options.log.builtinEnabled = false;
      options.log.logLevel = 'debug';

      options.log.connector = (level, className, label, content) => {
        const protocolIndex = content && content.indexOf ? protocolDebugMessages.findIndex(prefix => content.indexOf(prefix) !== -1) : -1;

        if (className === 'sip.Transport' && protocolIndex !== -1) {
          const direction = protocolIndex === 0 ? 'receiving' : 'sending';
          const message = content.replace(`${protocolDebugMessages[protocolIndex]}\n\n`, '').replace('\r\n', '\n');
          protocolLogger.trace(message, {
            className,
            direction,
          });
        } else {
          sipLogger.trace(content, {
            className,
          });
        }
      };
    }

    this.client = new WazoWebRTCClient({
      host,
      // @ts-ignore
      port,
      displayName,
      authorizationUser: sipLine.username,
      password: sipLine.secret,
      uri: `${sipLine.username}@${server}`,
      ...options,
    }, null, options.uaConfigOverrides);
    this.phone = new WebRTCPhone(this.client, options.audioDeviceOutput, true, options.audioDeviceRing);

    this._transferEvents();
  }

  async disconnect(): Promise<void> {
    if (this.phone) {
      if (this.phone.hasAnActiveCall()) {
        logger.info('hangup call on disconnect');
        await this.phone.hangup(null);
      }

      await this.phone.close();
    }

    this.phone = null;
  }

  // If audioOnly is set to true, all video stream will be deactivated, even remotes ones.
  async call(extension: string, withCamera = false, rawSipLine: SipLine | null | undefined = null, audioOnly = false, conference = false): Promise<CallSession | null | undefined> {
    if (!this.phone) {
      return;
    }

    const sipLine = rawSipLine || this.getPrimaryWebRtcLine();
    return this.phone.makeCall(extension, sipLine, withCamera, audioOnly, conference);
  }

  async hangup(callSession: CallSession): Promise<boolean> {
    logger.info('hangup via simple phone', {
      callId: callSession.getId(),
    });
    return this.phone ? this.phone.hangup(callSession) : false;
  }

  async accept(callSession: CallSession, cameraEnabled?: boolean): Promise<string | null> {
    logger.info('accept via simple phone', {
      callId: callSession.getId(),
      cameraEnabled,
    });
    return this.phone ? this.phone.accept(callSession, cameraEnabled) : null;
  }

  async startConference(host: CallSession, otherCalls: CallSession[]): Promise<AdHocAPIConference> {
    const participants = [host, ...otherCalls].reduce((acc: Record<string, any>, participant: CallSession) => {
      acc[participant.getTalkingToIds()[0]] = participant;
      return acc;
    }, {});

    if (!this.phone) {
      return Promise.reject();
    }

    const adHocConference = new AdHocAPIConference({
      phone: this.phone,
      host,
      participants,
    });
    return adHocConference.start();
  }

  mute(callSession: CallSession, withApi = true): void {
    if (withApi) {
      this.muteViaAPI(callSession);
    }

    this.phone?.mute(callSession);
  }

  unmute(callSession: CallSession, withApi = true): void {
    if (withApi) {
      this.unmuteViaAPI(callSession);
    }

    this.phone?.unmute(callSession);
  }

  muteViaAPI(callSession: CallSession): void {
    if (callSession && callSession.callId) {
      Wazo.getApiClient().calld.mute(callSession.callId).catch(e => {
        logger.error('Mute via API, error', e);
      });
    }
  }

  unmuteViaAPI(callSession: CallSession): void {
    if (callSession && callSession.callId) {
      Wazo.getApiClient().calld.unmute(callSession.callId).catch(e => {
        logger.error('Unmute via API, error', e);
      });
    }
  }

  hold(callSession: CallSession): Promise<void | OutgoingInviteRequest> | null | undefined {
    return this.phone?.hold(callSession, true);
  }

  async unhold(callSession: CallSession): Promise<MediaStream | void | null | undefined> {
    return this.phone?.unhold(callSession, true);
  }

  async resume(callSession: CallSession): Promise<MediaStream | null | void> {
    return this.phone?.resume(callSession) || null;
  }

  reject(callSession: CallSession): Promise<void> | undefined {
    return this.phone?.reject(callSession);
  }

  transfer(callSession: CallSession, target: string): void {
    this.phone?.transfer(callSession, target);
  }

  atxfer(callSession: CallSession): Record<string, any> | null {
    return this.phone?.atxfer(callSession) || null;
  }

  async reinvite(callSession: CallSession, constraints: (Record<string, any> | null) = null, conference = false): Promise<OutgoingInviteRequest | void | null> {
    return this.phone ? this.phone.sendReinvite(callSession, constraints, conference) : null;
  }

  async getStats(callSession: CallSession): Promise<RTCStatsReport | null | undefined> {
    return this.phone ? this.phone.getStats(callSession) : null;
  }

  startNetworkMonitoring(callSession: CallSession, interval = 1000) {
    return this.phone ? this.phone.startNetworkMonitoring(callSession, interval) : null;
  }

  stopNetworkMonitoring(callSession: CallSession) {
    return this.phone ? this.phone.stopNetworkMonitoring(callSession) : null;
  }

  getSipSessionId(sipSession: Invitation | Inviter): string | null | undefined {
    if (!sipSession || !this.phone) {
      return null;
    }
    return this.phone.getSipSessionId(sipSession);
  }

  sendMessage(body: string, sipSession?: Inviter | Invitation, contentType = 'text/plain'): void {
    const toSipSession = sipSession || this.getCurrentSipSession();

    if (!toSipSession || !this.phone) {
      return;
    }

    this.phone.sendMessage(toSipSession, body, contentType);
  }

  sendChat(content: string, sipSession?: Inviter | Invitation): void {
    this.sendMessage(JSON.stringify({
      type: MESSAGE_TYPE_CHAT,
      content,
    }), sipSession, 'application/json');
  }

  sendSignal(content: any, sipSession?: Inviter | Invitation): void {
    this.sendMessage(JSON.stringify({
      type: MESSAGE_TYPE_SIGNAL,
      content,
    }), sipSession, 'application/json');
  }

  turnCameraOff(callSession: CallSession): void {
    this.phone?.turnCameraOff(callSession);
  }

  turnCameraOn(callSession: CallSession): void {
    this.phone?.turnCameraOn(callSession);
  }

  async startScreenSharing(constraints: Record<string, any>, callSession?: CallSession): Promise<MediaStream | null> {
    return this.phone?.startScreenSharing(constraints, callSession) || null;
  }

  stopScreenSharing(callSession?: CallSession, restoreLocalStream = true): Promise<OutgoingInviteRequest | void> {
    return this.phone ? this.phone.stopScreenSharing(restoreLocalStream, callSession) : Promise.resolve();
  }

  sendDTMF(tone: string, callSession: CallSession): void {
    this.phone?.sendKey(callSession, tone);
  }

  getLocalStream(callSession: CallSession): MediaStream | null | undefined {
    return this.phone?.getLocalStream(callSession);
  }

  hasLocalVideo(callSession: CallSession): boolean {
    return this.phone?.hasLocalVideo(callSession) || false;
  }

  hasALocalVideoTrack(callSession: CallSession): boolean {
    return this.phone?.hasALocalVideoTrack(callSession) || false;
  }

  // @Deprecated
  getLocalMediaStream(callSession: CallSession): MediaStream | null | undefined {
    logger.warn('Phone.getLocalMediaStream is deprecated, use Phone.getLocalStream instead');
    return this.phone?.getLocalStream(callSession);
  }

  getLocalVideoStream(callSession: CallSession): MediaStream | null {
    return this.phone?.getLocalVideoStream(callSession) || null;
  }

  getRemoteStream(callSession: CallSession): MediaStream | null {
    return this.phone?.getRemoteStream(callSession) || null;
  }

  getRemoteVideoStream(callSession: CallSession): MediaStream | null {
    return this.phone?.getRemoteVideoStream(callSession) || null;
  }

  isVideoRemotelyHeld(callSession: CallSession): boolean {
    return this.phone?.isVideoRemotelyHeld(callSession) || false;
  }

  // @Deprecated
  getRemoteStreamForCall(callSession: CallSession): MediaStream | null {
    logger.warn('Phone.getRemoteStreamForCall is deprecated, use Phone.getRemoteStream instead');
    return this.getRemoteStream(callSession) || null;
  }

  // Returns remote streams directly from the peerConnection
  // @Deprecated
  getRemoteStreamsForCall(callSession: CallSession): MediaStream | null {
    logger.warn('Phone.getRemoteStreamsForCall is deprecated, use Phone.getLocalStream instead');
    return this.getLocalStream(callSession) || null;
  }

  // @Deprecated
  getRemoteVideoStreamForCall(callSession: CallSession): MediaStream | null {
    logger.warn('Phone.getRemoteVideoStreamForCall is deprecated, use Phone.getRemoteVideoStream instead');
    return this.getRemoteVideoStream(callSession);
  }

  //  Useful in a react-native environment when remoteMediaStream is not updated
  getRemoteVideoStreamFromPc(callSession: CallSession) : MediaStream | null {
    return this.phone?.getRemoteVideoStreamFromPc(callSession) || null;
  }

  hasVideo(callSession: CallSession): boolean {
    return this.phone ? this.phone.hasVideo(callSession) : false;
  }

  hasAVideoTrack(callSession: CallSession): boolean {
    return this.phone ? this.phone.hasAVideoTrack(callSession) : false;
  }

  getCurrentSipSession(): Invitation | Inviter | null {
    return this.phone?.currentSipSession || null;
  }

  getPrimaryWebRtcLine(): SipLine | null {
    const session = Wazo.Auth.getSession();
    return session?.primaryWebRtcLine() || null;
  }

  getOutputDevice(): string | null {
    return this.phone?.audioOutputDeviceId || null;
  }

  getPrimaryLine(): SipLine | null {
    const session = Wazo.Auth.getSession();
    return session?.primarySipLine() || null;
  }

  getLineById(lineId: string): SipLine | null {
    return this.getSipLines().find(line => line && line.id === lineId) || null;
  }

  getSipLines(): SipLine[] {
    const session = Wazo.Auth.getSession();

    if (!session) {
      return [];
    }

    return session.profile?.sipLines || [];
  }

  hasSfu(): boolean {
    return this.sipLine?.hasVideoConference() || false;
  }

  checkSfu(): void {
    if (!this.hasSfu()) {
      throw new SFUNotAvailableError();
    }
  }

  _transferEvents() {
    this.unbind();
    [...clientEvents, ...transportEvents].forEach(event => {
      this.client.on(event, (...args) => this.eventEmitter.emit.apply(this.eventEmitter.emit, [`client-${event}`, ...args]));
    });
    Object.values(PHONE_EVENTS).forEach(event => {
      if (typeof event !== 'string' || !this.phone) {
        return;
      }

      this.phone.on(event, (...args) => this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args]));
    });
  }

}

if (!global.wazoTelephonyInstance) {
  global.wazoTelephonyInstance = new Phone();
}

export default global.wazoTelephonyInstance;
