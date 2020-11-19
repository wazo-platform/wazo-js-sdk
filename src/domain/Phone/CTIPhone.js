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

const logger = IssueReporter.loggerFor('cti-phone');

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
      record: false,
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

  async makeCall(number: string, line: Line): Promise<?CallSession> {
    logger.info('makeCall', { number });

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
    logger.info('accept', { callId: callSession.getId(), number: callSession.number });

    if (!this.currentCall) {
      this.currentCall = callSession.call;
    }

    return Promise.resolve(callSession.getId());
  }

  endCurrentCall(callSession: CallSession): void {
    logger.info('endCurrentCall', { callId: callSession.getId(), number: callSession.number });

    this.currentCall = undefined;
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  async hangup(callSession: CallSession): Promise<boolean> {
    logger.info('hangup', { callId: callSession.getId(), number: callSession.number });

    try {
      await CallApi.cancelCall(callSession);
      if (this.currentCall && callSession.callId === this.currentCall.id) {
        this.endCurrentCall(callSession);
      }

      this.eventEmitter.emit('onCallEnded', callSession);
      return true;
    } catch (e) {
      logger.error('hangup error', e);

      this.eventEmitter.emit('onCallFailed', callSession);
      return false;
    }
  }

  ignore() {}

  async reject(callSession: CallSession): Promise<void> {
    logger.info('reject', { callId: callSession.getId(), number: callSession.number });

    await CallApi.cancelCall(callSession);
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  async transfer(callSession: CallSession, number: string): Promise<void> {
    logger.info('transfer', { callId: callSession.getId(), number: callSession.number, to: number });

    await CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_BLIND);
  }

  indirectTransfer() {}

  async initiateCTIIndirectTransfer(callSession: CallSession, number: string): Promise<any> {
    logger.info('indirect transfer', { callId: callSession.getId(), number: callSession.number, to: number });

    return CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_ATTENDED);
  }

  async cancelCTIIndirectTransfer(transferId: string): Promise<any> {
    logger.info('cancel transfer', { transferId });

    return CallApi.cancelCallTransfer(transferId);
  }

  async confirmCTIIndirectTransfer(transferId: string): Promise<any> {
    logger.info('confirm transfer', { transferId });

    return CallApi.confirmCallTransfer(transferId);
  }

  sendKey(callSession: CallSession, digits: string) {
    logger.info('sendKey', { callId: callSession.getId(), number: callSession.number, digits });

    return CallApi.sendDTMF(callSession.callId, digits);
  }

  onConnectionMade() {
    logger.info('onConnectionMade');

    this.eventEmitter.emit('onCallAccepted');
  }

  async close() {
    logger.info('close');

    return Promise.resolve();
  }

  async hold(callSession: CallSession): Promise<void> {
    logger.info('hold', { callId: callSession.getId(), number: callSession.number });

    return CallApi.hold(callSession.callId);
  }

  async resume(callSession: CallSession): Promise<void> {
    logger.info('resume', { callId: callSession.getId(), number: callSession.number });

    return CallApi.resume(callSession.callId);
  }

  async mute(callSession: CallSession): Promise<void> {
    logger.info('mute', { callId: callSession.getId(), number: callSession.number });

    return CallApi.mute(callSession.callId);
  }

  async unmute(callSession: CallSession): Promise<void> {
    logger.info('unmute', { callId: callSession.getId(), number: callSession.number });

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

  getCurrentCallSession(): ?CallSession {
    return this.currentCall ? CallSession.parseCall(this.session, this.currentCall) : null;
  }

  enableRinging() {}

  sendMessage() {}

  disableRinging() {}
}
