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

export default class CTIPhone extends Emitter implements Phone {
  session: Session;

  isMobile: boolean;

  currentCall: ?Call;

  constructor(session: Session, isMobile: boolean = false) {
    super();
    this.session = session;
    this.isMobile = isMobile;
  }

  getOptions(): AvailablePhoneOptions {
    return {
      accept: false,
      decline: true,
      mute: true,
      hold: false,
      transfer: true,
      sendKey: false,
      addParticipant: false,
      record: false,
      merge: false,
    };
  }

  hasAnActiveCall() {
    return !!this.currentCall;
  }

  isWebRTC() {
    return false;
  }

  async makeCall(number: string, line: Line): Promise<?CallSession> {
    if (!number) {
      return null;
    }
    try {
      this.currentCall = await CallApi.makeCall(line, number, this.isMobile);
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

  accept(callSession: CallSession): string | null {
    if (!this.currentCall) {
      this.currentCall = callSession.call;
    }

    return callSession.getId();
  }

  endCurrentCall(callSession: CallSession): void {
    this.currentCall = undefined;
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  async hangup(callSession: CallSession): Promise<void> {
    try {
      await CallApi.cancelCall(callSession);
      if (this.currentCall && callSession.callId === this.currentCall.id) {
        this.endCurrentCall(callSession);
      }

      this.eventEmitter.emit('onCallEnded', callSession);
    } catch (ex) {
      this.eventEmitter.emit('onCallFailed', callSession);
    }
  }

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

  sendKey() {}

  onConnectionMade() {
    this.eventEmitter.emit('onCallAccepted');
  }

  close() {}

  hold() {}

  resume() {}

  async mute(callSession: CallSession): Promise<void> {
    await CallApi.mute(callSession.callId);
  }

  async unmute(callSession: CallSession): Promise<void> {
    await CallApi.unmute(callSession.callId);
  }

  putOnSpeaker() {}

  putOffSpeaker() {}

  startConference() {}

  addToConference() {}

  muteConference() {}

  unmuteConference() {}

  holdConference() {}

  resumeConference() {}

  hangupConference() {}

  removeFromConference() {}

  turnCameraOff() {}

  turnCameraOn() {}

  changeAudioInputDevice() {}

  changeVideoInputDevice() {}

  changeAudioDevice() {}

  changeRingDevice() {}

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

  disableRinging() {}
}
