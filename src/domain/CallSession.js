// @flow

import Call from './Call';
import Session from './Session';
import newFrom from '../utils/new-from';
import updateFrom from '../utils/update-from';

type CallSessionArguments = {
  answered: boolean,
  answeredBySystem: boolean,
  call: ?Call,
  callId: string,
  callerNumber: string,
  cameraEnabled: boolean,
  dialedExtension?: string | null,
  displayName: string,
  isCaller: boolean,
  muted: boolean,
  videoMuted: boolean,
  number: string,
  paused: boolean,
  ringing: boolean,
  sipCallId: string,
  sipId?: string,
  sipStatus?: number,
  startTime: number,
  autoAnswer?: boolean,
  ignored?: boolean,
  screensharing: boolean,
};

export default class CallSession {
  call: ?Call;

  // Wazo's callId, like `1594062407.xxxx`
  callId: string;

  displayName: string;

  // Used to retrieve the real callee when doing indirect transfer
  realDisplayName: string;

  number: string;

  callerNumber: string;

  startTime: number;

  isCaller: boolean;

  answered: boolean;

  answeredBySystem: boolean;

  dialedExtension: string;

  ringing: boolean;

  // Should be computed ?
  paused: boolean;

  // Asterisk callId, like `7aed6793-4405-466d-873e-92d21c2fef9f`
  sipCallId: string;

  sipStatus: ?number;

  muted: boolean;

  videoMuted: boolean;

  cameraEnabled: boolean;

  autoAnswer: boolean;

  ignored: boolean;

  screensharing: boolean;

  type: string;

  constructor({
    answered,
    answeredBySystem,
    isCaller,
    displayName,
    callId,
    muted,
    videoMuted,
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
    autoAnswer,
    ignored,
    screensharing,
  }: CallSessionArguments) {
    this.callId = callId;
    this.sipCallId = sipCallId;
    this.displayName = displayName;
    this.number = number;
    this.startTime = startTime;
    this.isCaller = isCaller;
    this.answered = answered;
    this.answeredBySystem = answeredBySystem;
    this.ringing = ringing;
    this.paused = paused;
    this.muted = muted;
    this.videoMuted = videoMuted;
    this.callerNumber = callerNumber;
    this.cameraEnabled = cameraEnabled;
    this.dialedExtension = dialedExtension || '';
    this.call = call;
    this.sipStatus = sipStatus;
    this.autoAnswer = autoAnswer || false;
    this.ignored = ignored || false;
    this.screensharing = screensharing || false;

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

  muteVideo() {
    this.videoMuted = true;
  }

  unmuteVideo() {
    this.videoMuted = false;
  }

  answer() {
    this.answered = true;
  }

  systemAnswer() {
    this.answeredBySystem = true;
  }

  enableCamera() {
    this.cameraEnabled = true;
  }

  ignore() {
    this.ignored = true;
  }

  startScreenSharing() {
    this.screensharing = true;
  }

  stopScreenSharing() {
    this.screensharing = false;
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

  isAnsweredBySystem(): boolean {
    return this.answeredBySystem;
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

  isVideoMuted(): boolean {
    return this.videoMuted;
  }

  isCameraEnabled(): boolean {
    return this.cameraEnabled;
  }

  isIgnored(): boolean {
    return this.ignored;
  }

  isScreenSharing(): boolean {
    return this.screensharing;
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

  getTalkingToIds() {
    return this.call ? this.call.talkingToIds : [];
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
      videoMuted: false,
      screensharing: false,
      ringing: call.isRinging(),
      answered: call.isUp(),
      answeredBySystem: call.isUp() && call.talkingToIds.length === 0,
      cameraEnabled: false,
      dialedExtension: call.dialedExtension,
      call,
    });
  }
}
