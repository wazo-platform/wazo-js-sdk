// @flow

import Session from '../Session';
import Call from '../Call';
import Line from '../Line';
import CallSession from '../CallSession';
import type { Phone, AvailablePhoneOptions } from './Phone';
import Emitter from '../../utils/Emitter';

import CallApi from '../../service/CallApi';

export const TRANSFER_FLOW_ATTENDED = 'attended';
export const TRANSFER_FLOW_BLIND = 'blind';

const MINIMUM_WAZO_ENGINE_VERSION_FOR_CTI_HOLD = '20.11';

export default class CTIPhone extends Emitter implements Phone {
  session: Session;

  isMobile: boolean;

  callbackAllLines: boolean;

  currentCall: ?Call;

  constructor(session: Session, isMobile: boolean = false, callbackAllLines: boolean = false) {
    super();
    this.session = session;
    this.isMobile = isMobile;
    this.callbackAllLines = callbackAllLines;
  }

  getOptions(): AvailablePhoneOptions {
    const hold = this.session.hasEngineVersionGte(MINIMUM_WAZO_ENGINE_VERSION_FOR_CTI_HOLD);

    return {
      accept: false,
      decline: true,
      mute: true,
      // $FlowFixMe
      hold,
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

  accept(callSession: CallSession): Promise<CallSession | null> {
    if (!this.currentCall) {
      this.currentCall = callSession.call;
    }

    return Promise.resolve(callSession);
  }

  endCurrentCall(callSession: CallSession): void {
    this.currentCall = undefined;
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  async hangup(callSession: CallSession): Promise<boolean> {
    try {
      await CallApi.cancelCall(callSession);
      if (this.currentCall && callSession.callId === this.currentCall.id) {
        this.endCurrentCall(callSession);
      }

      this.eventEmitter.emit('onCallEnded', callSession);
      return true;
    } catch (_) {
      this.eventEmitter.emit('onCallFailed', callSession);
      return false;
    }
  }

  ignore() {}

  async reject(callSession: CallSession): Promise<void> {
    await CallApi.cancelCall(callSession);
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  async transfer(callSession: CallSession, number: string): Promise<void> {
    await CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_BLIND);
  }

  indirectTransfer() {}

  async initiateCTIIndirectTransfer(callSession: CallSession, number: string): Promise<any> {
    return CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_ATTENDED);
  }

  async cancelCTIIndirectTransfer(transferId: string): Promise<any> {
    return CallApi.cancelCallTransfer(transferId);
  }

  async confirmCTIIndirectTransfer(transferId: string): Promise<any> {
    return CallApi.confirmCallTransfer(transferId);
  }

  sendKey(callSession: CallSession, digits: string) {
    return CallApi.sendDTMF(callSession.callId, digits);
  }

  onConnectionMade() {
    this.eventEmitter.emit('onCallAccepted');
  }

  async close() {
    return Promise.resolve();
  }

  async hold(callSession: CallSession): Promise<void> {
    return CallApi.hold(callSession.callId);
  }

  async resume(callSession: CallSession): Promise<void> {
    return CallApi.resume(callSession.callId);
  }

  async mute(callSession: CallSession): Promise<void> {
    return CallApi.mute(callSession.callId);
  }

  async unmute(callSession: CallSession): Promise<void> {
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

  enableRinging() {}

  sendMessage() {}

  disableRinging() {}
}
