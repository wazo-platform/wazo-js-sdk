// @flow

import Call from './Call';
import Session from './Session';

type CallSessionArguments = {
  answered: boolean,
  callId: string,
  callerNumber: string,
  cameraEnabled: boolean,
  dialedExtension?: string | null,
  displayName: string,
  isCaller: boolean,
  muted: boolean,
  number: string,
  paused: boolean,
  ringing: boolean,
  sipCallId: string,
  sipId?: string,
  startTime: number,
};

export default class CallSession {
  callId: string;

  displayName: string;

  number: string;

  callerNumber: string;

  startTime: number;

  isCaller: boolean;

  answered: boolean;

  dialedExtension: string;

  ringing: boolean;

  // Should be computed ?
  paused: boolean;

  sipCallId: string;

  muted: boolean;

  cameraEnabled: boolean;

  constructor({
    answered,
    isCaller,
    displayName,
    callId,
    muted,
    number,
    paused,
    ringing,
    startTime,
    cameraEnabled,
    dialedExtension,
    sipCallId,
    callerNumber,
  }: CallSessionArguments) {
    this.callId = callId;
    this.sipCallId = sipCallId;
    this.displayName = displayName;
    this.number = number;
    this.startTime = startTime;
    this.isCaller = isCaller;
    this.answered = answered;
    this.ringing = ringing;
    this.paused = paused;
    this.muted = muted;
    this.callerNumber = callerNumber;
    this.cameraEnabled = cameraEnabled;
    this.dialedExtension = dialedExtension || '';
  }

  resume() {
    this.paused = false;
  }

  hold() {
    this.paused = true;
  }

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }

  answer() {
    this.answered = true;
  }

  enableCamera() {
    this.cameraEnabled = true;
  }

  isIncoming(): boolean {
    return !this.isCaller && !this.answered;
  }

  isOutgoing(): boolean {
    return this.isCaller && !this.answered;
  }

  isActive(): boolean {
    return this.answered || this.isOutgoing();
  }

  isAnswered(): boolean {
    return this.answered;
  }

  isRinging(): boolean {
    return this.ringing;
  }

  isOnHold(): boolean {
    return this.paused;
  }

  isMuted(): boolean {
    return this.muted;
  }

  isCameraEnabled(): boolean {
    return this.cameraEnabled;
  }

  hasAnInitialInterceptionNumber(): boolean {
    return this.number.startsWith('*8');
  }

  isAnInterception(): boolean {
    return this.dialedExtension.startsWith('*8');
  }

  getElapsedTimeInSeconds() {
    if (!this.startTime) {
      return 0;
    }
    return (Date.now() - this.startTime) / 1000;
  }

  getId() {
    return this.sipCallId || this.callId;
  }

  is(callSession: CallSession) {
    return this.isId(callSession.getId());
  }

  isId(id: string): boolean {
    return (
      this.getId() === id || (this.sipCallId && this.sipCallId === id) || (Boolean(this.callId) && this.callId === id)
    );
  }

  static parseCall(session: Session, call: Call): CallSession {
    return new CallSession({
      callId: call.id,
      sipCallId: call.sipCallId,
      displayName: call.calleeName || call.calleeNumber,
      number: call.calleeNumber,
      callerNumber: call.callerNumber,
      startTime: +call.startingTime,
      paused: call.isOnHold(),
      isCaller: call.isCaller,
      muted: false,
      ringing: call.isRinging(),
      answered: call.isUp(),
      cameraEnabled: false,
      dialedExtension: call.dialedExtension,
    });
  }
}
