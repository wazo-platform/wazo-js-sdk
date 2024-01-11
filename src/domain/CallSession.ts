import { SessionState } from 'sip.js/lib/api/session-state';
import Call from './Call';
import newFrom from '../utils/new-from';
import updateFrom from '../utils/update-from';
import { WazoSession } from './types';

type CallSessionArguments = {
  answered: boolean;
  answerTime?: Date | null | undefined;
  answeredBySystem: boolean;
  call: Call | null | undefined;
  callId: string;
  callerNumber: string;
  cameraEnabled: boolean;
  creationTime?: Date | null | undefined;
  dialedExtension?: string | null;
  displayName: string;
  endTime?: Date | null | undefined;
  isCaller: boolean;
  muted: boolean;
  videoMuted: boolean;
  videoRemotelyDowngraded?: boolean;
  number: string;
  paused: boolean;
  ringing: boolean;
  sipCallId: string;
  sipId?: string;
  sipStatus?: string;
  startTime: number;
  autoAnswer?: boolean;
  ignored?: boolean;
  screensharing: boolean;
  recording: boolean;
  recordingPaused: boolean;
  sipSession?: WazoSession;
  conference: boolean;
};
export default class CallSession {
  call: Call | null | undefined;

  // Wazo's callId, like `1594062407.xxxx`
  callId: string;

  displayName: string;

  // Used to retrieve the real callee when doing indirect transfer
  realDisplayName: string;

  updatedNumber: string;

  number: string;

  callerNumber: string;

  creationTime: Date | null | undefined;

  startTime: number; // = creationTime

  answerTime: Date | null | undefined;

  endTime: Date | null | undefined;

  isCaller: boolean;

  answeredBySystem: boolean;

  dialedExtension: string;

  ringing: boolean;

  // Should be computed ?
  paused: boolean;

  // Asterisk callId, like `7aed6793-4405-466d-873e-92d21c2fef9f`
  sipCallId: string;

  sipStatus: string | number | null | undefined;

  muted: boolean;

  videoMuted: boolean;

  videoRemotelyDowngraded: boolean | null | undefined;

  cameraEnabled: boolean;

  autoAnswer: boolean;

  ignored: boolean;

  screensharing: boolean;

  type: string;

  recording: boolean;

  recordingPaused: boolean;

  sipSession: WazoSession | undefined;

  conference: boolean;

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
    creationTime,
    endTime,
    cameraEnabled,
    dialedExtension,
    sipCallId,
    sipStatus,
    callerNumber,
    call,
    autoAnswer,
    ignored,
    screensharing,
    recording,
    recordingPaused,
    videoRemotelyDowngraded,
    sipSession,
    answerTime,
    conference,
  }: CallSessionArguments) {
    this.callId = callId;
    this.sipCallId = sipCallId;
    this.displayName = displayName;
    this.number = number;
    this.creationTime = creationTime;
    this.startTime = startTime;
    this.endTime = endTime;
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
    this.recording = recording || false;
    this.recordingPaused = recordingPaused || false;
    this.videoRemotelyDowngraded = videoRemotelyDowngraded;
    this.sipSession = sipSession;
    this.answerTime = answerTime || this.answerTime;
    this.conference = conference;
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
    this.answerTime = new Date();
  }

  systemAnswer() {
    this.answeredBySystem = true;
  }

  enableCamera() {
    this.cameraEnabled = true;
  }

  disableCamera() {
    this.cameraEnabled = false;
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

  setIsConference(conference: boolean) {
    this.conference = conference;
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

  isRecording(): boolean {
    return this.recording;
  }

  recordingIsPaused(): boolean {
    return this.recordingPaused;
  }

  hasAnInitialInterceptionNumber(): boolean {
    return this.number.startsWith('*8');
  }

  isAnInterception(): boolean {
    return this.dialedExtension.startsWith('*8');
  }

  isEstablished(): boolean {
    return this.sipStatus === SessionState.Established;
  }

  isTerminating(): boolean {
    return this.sipStatus === SessionState.Terminating;
  }

  isTerminated(): boolean {
    return this.sipStatus === SessionState.Terminated;
  }

  isConference(): boolean {
    return this.conference;
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

  is(callSession: CallSession | null | undefined) {
    if (!callSession) {
      return false;
    }

    return this.isId(callSession.sipCallId) || this.isId(callSession.callId);
  }

  isId(id: string): boolean {
    return this.getId() === id || (!!this.sipCallId && this.sipCallId === id) || (!!this.callId && this.callId === id);
  }

  updateFrom(session: CallSession) {
    updateFrom(this, session);
  }

  separateDisplayName(): {
    firstName: string;
    lastName: string;
  } {
    const names = this.displayName.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');
    return {
      firstName,
      lastName,
    };
  }

  getTalkingToIds() {
    return this.call ? this.call.talkingToIds : [];
  }

  setVideoRemotelyDowngraded(value: boolean) {
    this.videoRemotelyDowngraded = value;
  }

  isVideoRemotelyDowngraded() {
    return this.videoRemotelyDowngraded;
  }

  static newFrom(callSession: CallSession) {
    return newFrom(callSession, CallSession);
  }

  // Retro-compatibility: `answered` was a boolean before. We can reproduce the behaviour with a getter/setter
  set answered(value: boolean) {
    this.answerTime = value ? this.answerTime || new Date() : null;
  }

  get answered(): boolean {
    return !!this.answerTime;
  }

  toJSON() {
    const jsonObj = { ...this,
    };
    jsonObj.answered = this.answered;
    return jsonObj;
  }

  static parseCall(call: Call): CallSession {
    return new CallSession({
      callId: call.id,
      sipCallId: call.sipCallId,
      displayName: call.calleeName || call.calleeNumber,
      number: call.calleeNumber,
      callerNumber: call.callerNumber,
      startTime: +call.startingTime,
      paused: call.isOnHold(),
      isCaller: call.isCaller,
      muted: call.muted,
      videoMuted: false,
      screensharing: false,
      recording: call.isRecording(),
      recordingPaused: false,
      // @TODO
      ringing: call.isRinging(),
      answered: call.isUp(),
      answeredBySystem: call.isUp() && call.talkingToIds.length === 0,
      cameraEnabled: call.isVideo,
      dialedExtension: call.dialedExtension,
      call,
      conference: false, // @FIXME?

    });
  }

}
