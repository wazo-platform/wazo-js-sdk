// @flow

import Call from './Call';
import Session from './Session';
import newFrom from '../utils/new-from';
import updateFrom from '../utils/update-from';

type CallSessionArguments = {
  answered: boolean,
  call: ?Call,
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
  sipStatus?: number,
  startTime: number,
};

export default class CallSession {
  call: ?Call;

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

  sipStatus: ?number;

  muted: boolean;

  cameraEnabled: boolean;

  type: string;

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
    sipStatus,
    callerNumber,
    call,
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
    this.call = call;
    this.sipStatus = sipStatus;

    // Useful to compare instead of instanceof with minified code
    this.type = 'CallSession';
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

  updateFrom(session: CallSession) {
    updateFrom(this, session);
  }

  separateDisplayName(): { firstName: string, lastName: string } {
    const names = this.displayName.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');

    return { firstName, lastName };
  }

  static newFrom(callSession: CallSession) {
    return newFrom(callSession, CallSession);
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
      call,
    });
  }
}
