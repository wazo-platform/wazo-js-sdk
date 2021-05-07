// @flow

import Session from '../Session';
import Call from '../Call';
import Line from '../Line';
import CallSession from '../CallSession';
import type { Phone, AvailablePhoneOptions } from './Phone';
import Emitter from '../../utils/Emitter';

import CallApi from '../../service/CallApi';
import IssueReporter from '../../service/IssueReporter';

export const TRANSFER_FLOW_ATTENDED = 'attended';
export const TRANSFER_FLOW_BLIND = 'blind';

// const MINIMUM_WAZO_ENGINE_VERSION_FOR_CTI_HOLD = '20.11';

const logger = IssueReporter ? IssueReporter.loggerFor('cti-phone') : console;

export default class CTIPhone extends Emitter implements Phone {
  session: Session;

  isMobile: boolean;

  callbackAllLines: boolean;

  currentCall: ?Call;

  constructor(session: Session, isMobile: boolean = false, callbackAllLines: boolean = false) {
    super();
    logger.info('CTI Phone created');
    this.session = session;
    this.isMobile = isMobile;
    this.callbackAllLines = callbackAllLines;
  }

  getOptions(): AvailablePhoneOptions {
    // @FIXME: temporarily disabling this option
    // const hold = this.session.hasEngineVersionGte(MINIMUM_WAZO_ENGINE_VERSION_FOR_CTI_HOLD);

    return {
      accept: false,
      decline: true,
      mute: true,
      hold: false,
      transfer: true,
      sendKey: true,
      addParticipant: false,
      record: true,
      merge: false,
    };
  }

  hasAnActiveCall() {
    return !!this.currentCall;
  }

  callCount() {
    return this.currentCall ? 1 : 0;
  }

  isWebRTC() {
    return false;
  }

  getUserAgent() {
    return 'cti-phone';
  }

  startHeartbeat() {
  }

  setOnHeartbeatTimeout() {
  }

  setOnHeartbeatCallback() {
  }

  stopHeartbeat() {
  }

  bindClientEvents() {
  }

  onConnect() {
  }

  onDisconnect() {
  }

  async makeCall(number: string, line: Line): Promise<?CallSession> {
    logger.info('make CTI call', { number });

    if (!number) {
      return null;
    }
    try {
      this.currentCall = await CallApi.makeCall(line, number, this.isMobile, this.callbackAllLines);
    } catch (_) {
      // We have to deal with error like `User has no mobile phone number` error in the UI.
    }
    if (!this.currentCall) {
      return null;
    }
    const callSession = CallSession.parseCall(this.session, this.currentCall);
    this.eventEmitter.emit('onCallOutgoing', callSession);

    return callSession;
  }

  accept(callSession: CallSession): Promise<string | null> {
    if (!callSession) {
      return Promise.resolve(null);
    }
    logger.info('accept CTI call', { callId: callSession.getId(), number: callSession.number });

    if (!this.currentCall) {
      this.currentCall = callSession.call;
    }

    return Promise.resolve(callSession.getId());
  }

  endCurrentCall(callSession: CallSession): void {
    if (!callSession) {
      return;
    }
    logger.info('end current CTI call', { callId: callSession.getId(), number: callSession.number });

    this.currentCall = undefined;
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  async hangup(callSession: CallSession): Promise<boolean> {
    if (!callSession) {
      return Promise.resolve(false);
    }
    logger.info('hangup CTI call', { callId: callSession.getId(), number: callSession.number });

    try {
      await CallApi.cancelCall(callSession);
      if (this.currentCall && callSession.callId === this.currentCall.id) {
        this.endCurrentCall(callSession);
      }

      this.eventEmitter.emit('onCallEnded', callSession);
      return true;
    } catch (e) {
      logger.error('hangup CTI call, error', e);

      this.eventEmitter.emit('onCallFailed', callSession);
      return false;
    }
  }

  ignore() {}

  async reject(callSession: CallSession): Promise<void> {
    if (!callSession) {
      return;
    }
    logger.info('reject CTI call', { callId: callSession.getId(), number: callSession.number });

    await CallApi.cancelCall(callSession);
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  async transfer(callSession: CallSession, number: string): Promise<void> {
    if (!callSession) {
      return;
    }
    logger.info('transfer CTI call', { callId: callSession.getId(), number: callSession.number, to: number });

    await CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_BLIND);
  }

  indirectTransfer() {}

  async initiateCTIIndirectTransfer(callSession: CallSession, number: string): Promise<any> {
    if (!callSession) {
      return;
    }
    logger.info('indirect CTI transfer', { callId: callSession.getId(), number: callSession.number, to: number });

    return CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_ATTENDED);
  }

  async cancelCTIIndirectTransfer(transferId: string): Promise<any> {
    logger.info('cancel CTI transfer', { transferId });

    return CallApi.cancelCallTransfer(transferId);
  }

  async confirmCTIIndirectTransfer(transferId: string): Promise<any> {
    logger.info('confirm CTI transfer', { transferId });

    return CallApi.confirmCallTransfer(transferId);
  }

  sendKey(callSession: CallSession, digits: string) {
    if (!callSession) {
      return;
    }
    logger.info('send CTI key', { callId: callSession.getId(), number: callSession.number, digits });

    return CallApi.sendDTMF(callSession.callId, digits);
  }

  onConnectionMade() {
    logger.info('on CTI connection made');

    this.eventEmitter.emit('onCallAccepted');
  }

  async close() {
    logger.info('CTI close');

    return Promise.resolve();
  }

  async hold(callSession: CallSession): Promise<void> {
    if (!callSession) {
      return;
    }
    logger.info('CTI hold', { callId: callSession.getId(), number: callSession.number });

    return CallApi.hold(callSession.callId);
  }

  async resume(callSession: CallSession): Promise<void> {
    if (!callSession) {
      return;
    }
    logger.info('CTI resume', { callId: callSession.getId(), number: callSession.number });

    return CallApi.resume(callSession.callId);
  }

  async mute(callSession: CallSession): Promise<void> {
    if (!callSession) {
      return;
    }
    logger.info('CTI mute', { callId: callSession.getId(), number: callSession.number });

    return CallApi.mute(callSession.callId);
  }

  async unmute(callSession: CallSession): Promise<void> {
    if (!callSession) {
      return;
    }
    logger.info('CTI unmute', { callId: callSession.getId(), number: callSession.number });

    return CallApi.unmute(callSession.callId);
  }

  putOnSpeaker() {}

  putOffSpeaker() {}

  turnCameraOff() {}

  turnCameraOn() {}

  changeAudioInputDevice() {}

  changeVideoInputDevice() {}

  changeAudioDevice() {}

  changeRingDevice() {}

  changeAudioVolume() {}

  changeRingVolume() {}

  isCallUsingVideo(): boolean {
    return false;
  }

  getLocalStreamForCall(): boolean {
    return false;
  }

  getRemoteStreamForCall(): boolean {
    return false;
  }

  setActiveSipSession() {}

  isRegistered(): boolean {
    return true;
  }

  hasIncomingCallSession(): boolean {
    return true;
  }

  hasActiveRemoteVideoStream(): boolean {
    return false;
  }

  getCurrentCallSession(): ?CallSession {
    return this.currentCall ? CallSession.parseCall(this.session, this.currentCall) : null;
  }

  enableRinging() {}

  sendMessage() {}

  disableRinging() {}
}
