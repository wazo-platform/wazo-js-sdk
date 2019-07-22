// @flow

import Session from '../Session';
import Call from '../Call';
import Line from '../Line';
import CallSession from '../CallSession';
import type { Phone, AvailablePhoneOptions } from './Phone';
import Emitter from '../../utils/Emitter';

import CallApi from '../../services/CallApi';

export default class CTIPhone extends Emitter implements Phone {

  session: Session;

  server: string;

  currentCall: ?Call;

  constructor(server: string, session: Session) {
    super();
    this.session = session;
    this.server = server;
  }

  getOptions(): AvailablePhoneOptions {
    return {
      accept: false,
      decline: true,
      mute: false,
      hold: false,
      transfer: false,
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
    this.currentCall = await CallApi.makeCall(this.server, this.session, line, number);
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
      await CallApi.cancelCall(this.server, this.session, callSession);
      if (this.currentCall && callSession.callId === this.currentCall.id) {
        this.endCurrentCall(callSession);
      }

      this.eventEmitter.emit('onCallEnded', callSession);
    } catch (ex) {
      this.eventEmitter.emit('onCallFailed', callSession);
    }
  }

  async reject(callSession: CallSession): Promise<void> {
    await CallApi.cancelCall(this.server, this.session, callSession);
    this.eventEmitter.emit('onCallEnded', callSession);
  }

  transfer() {}

  indirectTransfer() {}

  sendKey() {}

  onConnectionMade() {}

  close() {}

  hold() {}

  mute() {}

  resume() {}

  unmute() {}

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

  isCallUsingVideo(): boolean {
    return false;
  }

  getLocalStreamForCall(): boolean {
    return false;
  }

  getRemoteStreamForCall(): boolean {
    return false;
  }

  isRegistered(): boolean {
    return true;
  }

  enableRinging() {}

  disableRinging() {}

}
