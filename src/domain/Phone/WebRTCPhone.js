/* global navigator */
// @flow
import type { Message } from 'sip.js/lib/api/message';
import type { Session } from 'sip.js/lib/core/session';
import { SessionState } from 'sip.js/lib/api/session-state';

import CallSession from '../CallSession';
import type { Phone, AvailablePhoneOptions } from './Phone';
import WazoWebRTCClient from '../../web-rtc-client';
import Emitter from '../../utils/Emitter';
import IssueReporter from '../../service/IssueReporter';

export const ON_USER_AGENT = 'onUserAgent';
export const ON_REGISTERED = 'onRegistered';
export const ON_UNREGISTERED = 'onUnRegistered';
export const ON_PROGRESS = 'onProgress';
export const ON_CALL_ACCEPTED = 'onCallAccepted';
export const ON_CALL_ANSWERED = 'onCallAnswered';
export const ON_CALL_INCOMING = 'onCallIncoming';
export const ON_CALL_OUTGOING = 'onCallOutgoing';
export const ON_CALL_MUTED = 'onCallMuted';
export const ON_CALL_UNMUTED = 'onCallUnmuted';
export const ON_CALL_RESUMED = 'onCallResumed';
export const ON_CALL_HELD = 'onCallHeld';
export const ON_CALL_UNHELD = 'onCallUnHeld';
export const ON_CAMERA_DISABLED = 'onCameraDisabled';
export const ON_CAMERA_RESUMED = 'onCameraResumed';
export const ON_CALL_FAILED = 'onCallFailed';
export const ON_CALL_ENDED = 'onCallEnded';
export const ON_MESSAGE = 'onMessage';
export const ON_REINVITE = 'reinvite';
export const ON_TRACK = 'onTrack';
export const ON_AUDIO_STREAM = 'onAudioStream';
export const ON_VIDEO_STREAM = 'onVideoStream';
export const ON_REMOVE_STREAM = 'onRemoveStream';
export const ON_SHARE_SCREEN_ENDED = 'onScreenShareEnded';
export const ON_TERMINATE_SOUND = 'terminateSound';
export const ON_PLAY_RING_SOUND = 'playRingingSound';
export const ON_PLAY_INBOUND_CALL_SIGNAL_SOUND = 'playInboundCallSignalSound';
export const ON_PLAY_HANGUP_SOUND = 'playHangupSound';
export const ON_PLAY_PROGRESS_SOUND = 'playProgressSound';
export const ON_VIDEO_INPUT_CHANGE = 'videoInputChange';

export const events = [
  ON_USER_AGENT,
  ON_REGISTERED,
  ON_UNREGISTERED,
  ON_PROGRESS,
  ON_CALL_ACCEPTED,
  ON_CALL_ANSWERED,
  ON_CALL_INCOMING,
  ON_CALL_OUTGOING,
  ON_CALL_MUTED,
  ON_CALL_UNMUTED,
  ON_CALL_RESUMED,
  ON_CALL_HELD,
  ON_CALL_UNHELD,
  ON_CAMERA_DISABLED,
  ON_CALL_FAILED,
  ON_CALL_ENDED,
  ON_MESSAGE,
  ON_REINVITE,
  ON_TRACK,
  ON_AUDIO_STREAM,
  ON_VIDEO_STREAM,
  ON_REMOVE_STREAM,
  ON_SHARE_SCREEN_ENDED,
  ON_TERMINATE_SOUND,
  ON_PLAY_RING_SOUND,
  ON_PLAY_INBOUND_CALL_SIGNAL_SOUND,
  ON_PLAY_HANGUP_SOUND,
  ON_PLAY_PROGRESS_SOUND,
  ON_VIDEO_INPUT_CHANGE,
];

export default class WebRTCPhone extends Emitter implements Phone {
  client: WazoWebRTCClient;

  allowVideo: boolean;

  sipSessions: { [string]: Session };

  incomingSessions: string[];

  currentSipSession: Session;

  audioOutputDeviceId: ?string;

  audioRingDeviceId: ?string;

  audioOutputVolume: number;

  audioRingVolume: number;

  ringingEnabled: boolean;

  acceptedSessions: Object;

  rejectedSessions: Object;

  ignoredSessions: Object;

  currentScreenShare: Object;

  shouldSendReinvite: boolean;

  constructor(
    client: WazoWebRTCClient,
    audioOutputDeviceId: ?string,
    allowVideo: boolean = false,
    audioRingDeviceId?: string,
  ) {
    super();

    this.client = client;
    this.allowVideo = allowVideo;
    this.sipSessions = {};
    this.audioOutputDeviceId = audioOutputDeviceId;
    this.audioRingDeviceId = audioRingDeviceId || audioOutputDeviceId;
    this.audioOutputVolume = 1;
    this.audioRingVolume = 1;
    this.incomingSessions = [];
    this.ringingEnabled = true;
    this.shouldSendReinvite = false;

    this.bindClientEvents();

    this.acceptedSessions = {};
    this.rejectedSessions = {};
    this.ignoredSessions = {};
  }

  register() {
    if (!this.client) {
      return Promise.resolve();
    }

    return this.client.register().then(() => {
      return this.bindClientEvents();
    }).catch(error => {
      // Avoid exception on `t.server.scheme` in sip transport when losing the webrtc socket connection
      console.error('[WebRtcPhone] register error', error, error.message, error.stack);
    });
  }

  unregister() {
    if (!this.client || !this.client.isRegistered()) {
      return;
    }
    this.client.unregister();
  }

  stop() {
    if (!this.client) {
      return;
    }
    IssueReporter.log(IssueReporter.INFO, '[WebRtcPhone] stop');
    this.client.stop();
  }

  removeIncomingSessions(id: string) {
    this.incomingSessions = this.incomingSessions.filter(sessionId => sessionId !== id);
  }

  isWebRTC() {
    return true;
  }

  sendReinvite() {
    const sipSession = this.currentSipSession;
    if (!sipSession) {
      return;
    }
    sipSession.reinvite({
      sessionDescriptionHandlerOptions: {
        offerOptions: {
          iceRestart: true,
        },
        constraints: {
          audio: true,
          video: this.client.sessionWantsToDoVideo(sipSession),
        },
      },
    });
  }

  getUserAgent() {
    return (this.client && this.client.config && this.client.config.userAgentString) || 'webrtc-phone';
  }

  startHeartbeat() {
    if (!this.client || this.client.hasHeartbeat()) {
      return;
    }

    this.client.startHeartbeat();
  }

  stopHeartbeat() {
    if (!this.client) {
      return;
    }

    this.client.stopHeartbeat();
  }

  setOnHeartbeatTimeout(cb: Function) {
    this.client.setOnHeartbeatTimeout(cb);
  }

  getOptions(): AvailablePhoneOptions {
    return {
      accept: true,
      decline: true,
      mute: true,
      hold: true,
      transfer: true,
      sendKey: true,
      addParticipant: false,
      record: true,
      merge: true,
    };
  }

  _bindEvents(sipSession: Session) {
    sipSession.stateChange.addListener((newState: SessionState) => {
      switch (newState) {
        case SessionState.Establishing:
          // When receiving a progress event, we know we are the caller so we have to force incoming to false
          return this.eventEmitter.emit(
            ON_PROGRESS,
            this._createCallSession(sipSession, null, { incoming: false, ringing: true }),
            this.audioOutputDeviceId,
            this.audioOutputVolume,
          );
        case SessionState.Terminated:
          this._onCallTerminated(sipSession);

          return this.eventEmitter.emit(ON_CALL_ENDED, this._createCallSession(sipSession));
        default:
          break;
      }
    });

    if (!sipSession.sessionDescriptionHandler) {
      return;
    }

    // Video events
    const { peerConnection } = sipSession.sessionDescriptionHandler;
    peerConnection.ontrack = rawEvent => {
      const event = rawEvent;
      const [stream] = event.streams;

      if (event.track.kind === 'audio') {
        return this.eventEmitter.emit(ON_AUDIO_STREAM, stream);
      }

      // not sure this does anything
      if (event.track.kind === 'video') {
        event.track.enabled = false;
      }

      return this.eventEmitter.emit(ON_VIDEO_STREAM, stream, event.track.id, event);
    };

    peerConnection.onremovestream = event => {
      this.eventEmitter.emit(ON_REMOVE_STREAM, event.stream);
    };
  }

  async startScreenSharing(constraintsOrStream: ?Object | MediaStream) {
    if (!navigator.mediaDevices) {
      return null;
    }

    let stream = constraintsOrStream;

    if (!constraintsOrStream || !(constraintsOrStream instanceof MediaStream)) {
      try {
        const constraints = constraintsOrStream || { video: { cursor: 'always' }, audio: false };
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (e) {
        console.warn(e);
        return null;
      }
    }

    // $FlowFixMe
    stream.local = true;
    // $FlowFixMe
    return this._continueScreenSharing(stream);
  }

  _continueScreenSharing(screenShareStream: MediaStream, constraints: Object = {}) {
    if (!screenShareStream) {
      throw new Error(`Can't create media stream for screensharing with contraints ${JSON.stringify(constraints)}`);
    }

    const screenTrack = screenShareStream.getVideoTracks()[0];
    const sipSession = this.currentSipSession;
    const pc = sipSession.sessionDescriptionHandler.peerConnection;
    const sender = pc.getSenders().find(s => s.track.kind === 'video');
    const localStream = this.client.getLocalStream(pc);

    if (sender) {
      sender.replaceTrack(screenTrack);
    }

    screenTrack.onended = () => this.eventEmitter.emit(ON_SHARE_SCREEN_ENDED);

    this.currentScreenShare = { stream: screenShareStream, sender, localStream };

    return screenShareStream;
  }

  async stopScreenSharing(restoreLocalStream: boolean = true) {
    if (!this.currentScreenShare) {
      return;
    }

    try {
      if (this.currentScreenShare.stream) {
        await this.currentScreenShare.stream.getVideoTracks().forEach(track => track.stop());
      }

      if (restoreLocalStream) {
        if (this.currentScreenShare.sender) {
          await this.currentScreenShare.sender.replaceTrack(this.currentScreenShare.localStream.getVideoTracks()[0]);
        }
      } else if (this.currentScreenShare.localStream) {
        await this.currentScreenShare.localStream.getVideoTracks().forEach(track => track.stop());
      }
    } catch (e) {
      console.warn(e);
    }

    this.currentScreenShare = null;
  }

  _onCallAccepted(sipSession: Session, videoEnabled: boolean): CallSession {
    const callSession = this._createAcceptedCallSession(sipSession, videoEnabled);
    this.sipSessions[callSession.getId()] = sipSession;
    this.currentSipSession = sipSession;

    this.eventEmitter.emit(ON_TERMINATE_SOUND);
    const sipSessionId = this.client.getSipSessionId(sipSession);
    if (sipSessionId) {
      this.removeIncomingSessions(sipSessionId);
    }

    this.eventEmitter.emit(ON_CALL_ACCEPTED, callSession, videoEnabled);

    return callSession;
  }

  changeAudioDevice(id: string) {
    this.audioOutputDeviceId = id;
    this.client.changeAudioOutputDevice(id);
  }

  changeRingDevice(id: string) {
    this.audioRingDeviceId = id;
  }

  // volume is a value between 0 and 1
  changeAudioVolume(volume: number) {
    this.audioOutputVolume = volume;
    this.client.changeAudioOutputVolume(volume);
  }

  // volume is a value between 0 and 1
  changeRingVolume(volume: number) {
    this.audioRingVolume = volume;
  }

  changeAudioInputDevice(id: string) {
    return this.client.changeAudioInputDevice(id, this.currentSipSession);
  }

  changeVideoInputDevice(id: string) {
    return this.client.changeVideoInputDevice(id, this.currentSipSession);
  }

  _onCallTerminated(sipSession: Session) {
    const callSession = this._createCallSession(sipSession);

    this.eventEmitter.emit(ON_TERMINATE_SOUND);

    const sipSessionId = this.client.getSipSessionId(sipSession);
    if (sipSessionId) {
      this.removeIncomingSessions(sipSessionId);
    }

    delete this.sipSessions[callSession.getId()];

    if (this.isCurrentCallSipSession(callSession)) {
      this.currentSipSession = undefined;
    }

    if (callSession.getId() in this.ignoredSessions) {
      return;
    }

    this.eventEmitter.emit(ON_PLAY_HANGUP_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);
  }

  setActiveSipSession(callSession: CallSession) {
    const sipSessionId = this._findSipSession(callSession);
    if (!sipSessionId) {
      return;
    }

    this.currentSipSession = sipSessionId;
  }

  hasAnActiveCall() {
    return !!this.currentSipSession;
  }

  // /!\ In some case with react0native webrtc the session will have only one audio stream set
  // Maybe due to https://github.com/react-native-webrtc/react-native-webrtc/issues/401
  // Better check directly `peerConnection.getRemoteStreams()` when on mobile rather than client.videoSessions.
  hasActiveRemoteVideoStream() {
    const sipSession = this.currentSipSession;
    if (!sipSession) {
      return false;
    }

    const { peerConnection } = sipSession.sessionDescriptionHandler;
    const remoteStream = peerConnection.getRemoteStreams().find(stream => !!stream.getVideoTracks().length);

    return remoteStream && remoteStream.getVideoTracks().some(track => !track.muted);
  }

  callCount() {
    return Object.keys(this.sipSessions).length;
  }

  isCurrentCallSipSession(callSession: CallSession): boolean {
    if (!this.currentSipSession) {
      return false;
    }

    return this.currentSipSession && this.client.getSipSessionId(this.currentSipSession) === callSession.getId();
  }

  isCallUsingVideo(callSession: CallSession): boolean {
    return this.client.sessionHasVideo(callSession.getId());
  }

  getLocalStreamForCall(callSession: CallSession): boolean {
    if (!callSession) {
      return false;
    }
    return this.client.videoSessions[callSession.getId()]
      && this.client.videoSessions[callSession.getId()].local;
  }

  getRemoteStreamForCall(callSession: CallSession): boolean {
    if (!callSession) {
      return false;
    }

    const remotes = this.client.videoSessions[callSession.getId()]
      && this.client.videoSessions[callSession.getId()].remotes;

    if (!remotes) {
      return false;
    }

    return remotes && remotes[remotes.length - 1];
  }

  startConference(participants: CallSession[]) {
    const targetedSessions = participants.map(callSession => this.sipSessions[callSession.getId()]);

    this.client.merge(Object.values(targetedSessions));
  }

  async addToConference(callSessions: CallSession[]): Promise<void> {
    const targetedSessions = callSessions.map(callSession => this.sipSessions[callSession.getId()]);

    const mergingSessions = targetedSessions.map(async sipSession => this.client.addToMerge(sipSession));
    await Promise.all(mergingSessions);
  }

  accept(callSession: CallSession, videoEnabled?: boolean): Promise<string | null> {
    if (this.currentSipSession) {
      this.holdSipSession(this.currentSipSession, true);
    }

    if (!callSession || callSession.getId() in this.acceptedSessions) {
      return Promise.resolve(null);
    }

    this.shouldSendReinvite = false;
    this.acceptedSessions[callSession.getId()] = true;

    this.eventEmitter.emit(ON_CALL_ANSWERED, callSession);

    const sipSession = this.sipSessions[callSession.getId()];
    if (sipSession) {
      return this.client.answer(sipSession, this.allowVideo ? videoEnabled : false).then(() => {
        return callSession.sipCallId;
      });
    }

    return Promise.resolve(null);
  }

  async reject(callSession: CallSession): Promise<void> {
    this.eventEmitter.emit(ON_TERMINATE_SOUND);
    if (!callSession || callSession.getId() in this.rejectedSessions) {
      return;
    }

    this.shouldSendReinvite = false;
    this.rejectedSessions[callSession.getId()] = true;

    const sipSession = this._findSipSession(callSession);
    if (sipSession) {
      this.client.hangup(sipSession);
    }
  }

  async ignore(callSession: CallSession): Promise<void> {
    // kill the ring
    this.eventEmitter.emit(ON_TERMINATE_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);
    this.ignoredSessions[callSession.getId()] = true;
    callSession.ignore();
  }

  hold(callSession: CallSession, withEvent: boolean = true): void {
    const sipSession = this._findSipSession(callSession);

    if (sipSession) {
      this.holdSipSession(sipSession, withEvent);
    }
  }

  unhold(callSession: CallSession, withEvent: boolean = true): void {
    const sipSession = this._findSipSession(callSession);

    if (sipSession) {
      this.unholdSipSession(sipSession, withEvent);
    }
  }

  atxfer(callSession: CallSession): ?Object {
    const sipSession = this._findSipSession(callSession);

    if (sipSession) {
      return this.client.atxfer(sipSession);
    }
  }

  holdSipSession(sipSession: Session, withEvent: boolean = true): void {
    if (!sipSession) {
      return;
    }

    this.client.hold(sipSession);
    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_HELD, this._createCallSession(sipSession));
    }
  }

  unholdSipSession(sipSession: Session, withEvent: boolean = true): void {
    if (!sipSession) {
      return;
    }

    this.client.unhold(sipSession);
    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_UNHELD, this._createCallSession(sipSession));
    }
  }

  holdConference(participants: CallSession[]): void {
    participants.forEach(participant => {
      const sipSession = this.sipSessions[participant.sipCallId];

      if (sipSession && !participant.isOnHold()) {
        this.client.hold(sipSession);
        participant.hold();
      }
    });
  }

  resumeConference(participants: CallSession[]): void {
    participants.forEach(participant => {
      const sipSession = this.sipSessions[participant.sipCallId];

      if (sipSession && participant.isOnHold()) {
        this.client.unhold(sipSession);
        participant.resume();
      }
    });
  }

  resume(callSession?: CallSession): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    // Hold current session if different from the current one (we don't want 2 sessions active at the same time).
    if (this.currentSipSession && this.currentSipSession.id !== sipSession.id) {
      this.holdSipSession(this.currentSipSession);
    }

    this.client.unhold(sipSession);
    this.eventEmitter.emit(ON_CALL_RESUMED, this._createCallSession(sipSession, callSession));
    this.currentSipSession = sipSession;
  }

  mute(callSession: ?CallSession, withEvent: boolean = true): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.mute(sipSession);

    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_MUTED, this._createCallSession(sipSession, callSession, { muted: true }));
    }
  }

  unmute(callSession: ?CallSession, withEvent: boolean = true): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.unmute(sipSession);

    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_UNMUTED, this._createCallSession(sipSession, callSession, { muted: false }));
    }
  }

  turnCameraOn(callSession?: CallSession): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.toggleCameraOn(sipSession);

    this.eventEmitter.emit(ON_CALL_RESUMED, this._createCameraResumedCallSession(sipSession, callSession));
  }

  turnCameraOff(callSession?: CallSession): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.toggleCameraOff(sipSession);
    this.eventEmitter.emit(ON_CAMERA_DISABLED, this._createCameraDisabledCallSession(sipSession, callSession));
  }

  sendKey(callSession: ?CallSession, tone: string): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.sendDTMF(sipSession, tone);
  }

  // Should be async to match CTIPhone definition
  // @TODO: line is not used here
  async makeCall(number: string, line: any, enableVideo?: boolean): Promise<?CallSession> {
    if (!number) {
      return new Promise(resolve => resolve(null));
    }
    if (!this.client.isRegistered()) {
      await this.client.register();
    }
    if (this.currentSipSession) {
      this.holdSipSession(this.currentSipSession, true);
    }

    let sipSession: Session;
    try {
      sipSession = this.client.call(number, this.allowVideo ? enableVideo : false);
      this._bindEvents(sipSession);
    } catch (error) {
      console.warn(error);
      return new Promise(resolve => resolve(null));
    }
    const callSession = this._createOutgoingCallSession(sipSession, enableVideo || false);

    this.sipSessions[callSession.getId()] = sipSession;

    this.eventEmitter.emit(ON_PLAY_PROGRESS_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);

    this.currentSipSession = sipSession;

    this.eventEmitter.emit(ON_CALL_OUTGOING, callSession);

    return new Promise(resolve => resolve(callSession));
  }

  transfer(callSession: ?CallSession, target: string): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.transfer(sipSession, target);
  }

  async indirectTransfer(source: CallSession, destination: CallSession): Promise<void> {
    const sipSession = this.sipSessions[source.sipCallId];
    const sipSessionTarget = this.sipSessions[destination.sipCallId];

    await sipSessionTarget.refer(sipSession);
  }

  initiateCTIIndirectTransfer() {}

  cancelCTIIndirectTransfer() {}

  confirmCTIIndirectTransfer() {}

  async hangup(callSession: ?CallSession): Promise<void> {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return console.error('Call is unknown to the WebRTC phone');
    }

    const sipSessionId = this.client.getSipSessionId(sipSession);
    if (sipSessionId) {
      delete this.sipSessions[sipSessionId];
    }

    this.client.hangup(sipSession);
    if (callSession) {
      this.endCurrentCall(callSession);
    }

    this.shouldSendReinvite = false;
  }

  async hangupConference(participants: CallSession[]): Promise<void> {
    participants.forEach(participant => {
      const sipSession = this.sipSessions[participant.sipCallId];
      if (!sipSession) {
        return;
      }

      this.client.removeFromMerge(sipSession, false);

      const sipSessionId = this.client.getSipSessionId(sipSession);
      if (sipSessionId) {
        delete this.sipSessions[sipSessionId];
      }

      this.client.hangup(sipSession);
      this.endCurrentCall(participant);
    });
  }

  async removeFromConference(participants: CallSession[]): Promise<void> {
    participants.forEach(participant => {
      const sipSession = this.sipSessions[participant.sipCallId];
      if (!sipSession || participant.isOnHold()) {
        return;
      }

      this.client.removeFromMerge(sipSession, false);
      this.client.hold(sipSession);
      participant.hold();
    });
  }

  muteConference(participants: CallSession[]): void {
    participants.forEach(participant => {
      const sipSession = this.sipSessions[participant.sipCallId];
      if (!sipSession) {
        return;
      }

      this.client.mute(sipSession);
      participant.mute();
      this.eventEmitter.emit(ON_CALL_MUTED, participant);
    });
  }

  unmuteConference(participants: CallSession[]): void {
    participants.forEach(participant => {
      const sipSession = this.sipSessions[participant.sipCallId];
      if (!sipSession) {
        return;
      }

      this.client.unmute(sipSession);
      participant.unmute();
      this.eventEmitter.emit(ON_CALL_UNMUTED, participant);
    });
  }

  endCurrentCall(callSession: CallSession): void {
    if (this.isCurrentCallSipSession(callSession)) {
      this.currentSipSession = undefined;
    }

    this.eventEmitter.emit(ON_TERMINATE_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);

    if (!this.currentSipSession && this.incomingSessions.length > 0) {
      this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);
    }
  }

  onConnectionMade(): void {}

  close(): void {
    IssueReporter.log(IssueReporter.INFO, '[WebRtcPhone] close');
    this.unregister();
    this.client.close();
    this.unbind();
  }

  isRegistered(): boolean {
    return this.client && this.client.isRegistered();
  }

  enableRinging(): Promise<void> | void {
    this.ringingEnabled = true;
  }

  disableRinging(): Promise<void> | void {
    this.ringingEnabled = false;
  }

  getCurrentCallSession(): ?CallSession {
    if (!this.currentSipSession) {
      return null;
    }

    return this._createCallSession(this.currentSipSession);
  }

  hasIncomingCallSession(): boolean {
    return this.incomingSessions.length > 0;
  }

  getIncomingCallSession(): ?CallSession {
    if (!this.hasIncomingCallSession()) {
      return null;
    }

    const sessionId = this.incomingSessions[0];

    return this._createCallSession(this.sipSessions[sessionId]);
  }

  sendMessage(sipSession: Session = null, body: string, contentType: string = 'text/plain') {
    if (!sipSession) {
      return;
    }

    try {
      sipSession.message({
        requestOptions: {
          body: {
            content: body,
            contentType,
          },
        },
      });
    } catch (e) {
      console.warn(e);
    }
  }

  getLocalMediaStream(callSession: CallSession) {
    const sipSession = this._findSipSession(callSession);

    return sipSession ? this.client.getLocalMediaStream(sipSession) : null;
  }

  setMediaConstraints(media: MediaStreamConstraints) {
    this.client.setMediaConstraints(media);
  }

  bindClientEvents() {
    this.client.unbind();

    this.client.on(this.client.INVITE, (sipSession: Session, wantsToDoVideo: boolean) => {
      const autoAnswer = sipSession.request.getHeader('Answer-Mode') === 'Auto';
      const withVideo = this.allowVideo ? wantsToDoVideo : false;
      const callSession = this._createIncomingCallSession(sipSession, withVideo, null, autoAnswer);
      this.incomingSessions.push(callSession.getId());
      this._bindEvents(sipSession);

      this.sipSessions[callSession.getId()] = sipSession;

      if (!this.currentSipSession) {
        if (this.ringingEnabled) {
          this.eventEmitter.emit(ON_TERMINATE_SOUND);
          this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume);
        }
      } else {
        this.eventEmitter.emit(ON_TERMINATE_SOUND);
        this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);
      }

      this.eventEmitter.emit(ON_CALL_INCOMING, callSession, wantsToDoVideo);
    });

    this.client.on(this.client.ON_REINVITE, (...args) =>
      this.eventEmitter.emit.apply(this.eventEmitter, [this.client.ON_REINVITE, ...args]));

    this.client.on(this.client.ACCEPTED, (sipSession: Session) => {
      this._onCallAccepted(sipSession, this.client.sessionHasVideo(this.client.getSipSessionId(sipSession)));

      if (this.audioOutputDeviceId) {
        this.client.changeAudioOutputDevice(this.audioOutputDeviceId);
      }
    });
    this.client.on('ended', () => {});

    this.client.on(this.client.UNREGISTERED, () => {
      this.eventEmitter.emit(ON_UNREGISTERED);
    });

    this.client.on(this.client.REGISTERED, () => {
      this.stopHeartbeat();
      this.eventEmitter.emit(ON_REGISTERED);

      // If the phone registered with a current callSession (eg: when switching network):
      // send a reinvite to renegociate ICE with new IP
      if (this.shouldSendReinvite && this.currentSipSession) {
        this.shouldSendReinvite = false;
        try {
          this.sendReinvite();
        } catch (e) {
          IssueReporter.log(IssueReporter.ERROR, `[WebRtcPhone] Reinvite error : ${e.message} (${e.stack})`);
        }
      }
    });

    this.client.on(this.client.CONNECTED, () => {
      this.stopHeartbeat();
    });

    this.client.on(this.client.DISCONNECTED, () => {
      this.eventEmitter.emit(ON_UNREGISTERED);

      // Do not trigger heartbeat if already running
      if (!this.client.hasHeartbeat()) {
        this.startHeartbeat();
      }

      // Tell to send reinvite when reconnecting
      this.shouldSendReinvite = true;
    });

    this.client.on(this.client.ON_TRACK, (session, event) => {
      this.eventEmitter.emit(ON_TRACK, session, event);
    });

    this.client.on('onVideoInputChange', stream => {
      this.eventEmitter.emit(ON_VIDEO_INPUT_CHANGE, stream);
    });

    this.client.on(this.client.MESSAGE, (message: Message) => {
      this.eventEmitter.emit(ON_MESSAGE, message);
    });
  }

  _createIncomingCallSession(
    sipSession: Session,
    cameraEnabled: boolean,
    fromSession?: ?CallSession,
    autoAnswer: boolean = false,
  ): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      incoming: true,
      ringing: true,
      cameraEnabled,
      autoAnswer,
    });
  }

  _createOutgoingCallSession(
    sipSession: Session,
    cameraEnabled: boolean,
    fromSession?: CallSession,
  ): CallSession {
    return this._createCallSession(sipSession, fromSession, { incoming: false, ringing: true, cameraEnabled });
  }

  _createAcceptedCallSession(
    sipSession: Session,
    cameraEnabled?: boolean,
    fromSession?: CallSession,
  ): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      cameraEnabled: cameraEnabled !== undefined ? cameraEnabled : false,
    });
  }

  _createMutedCallSession(sipSession: Session, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: true,
      cameraEnabled: this.client.sessionHasLocalVideo(this.client.getSipSessionId(sipSession)),
    });
  }

  _createUnmutedCallSession(sipSession: Session, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      cameraEnabled: this.client.sessionHasLocalVideo(this.client.getSipSessionId(sipSession)),
    });
  }

  _createCameraResumedCallSession(sipSession: Session, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: !this.client.sessionHasAudio(sipSession),
      cameraEnabled: true,
    });
  }

  _createCameraDisabledCallSession(sipSession: Session, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: !this.client.sessionHasAudio(sipSession),
      cameraEnabled: false,
    });
  }

  _createCallSession(sipSession: Session, fromSession?: ?CallSession, extra: Object = {}): CallSession {
    // eslint-disable-next-line
    const number = sipSession.remoteIdentity.uri._normal.user;
    const { state } = sipSession;

    return new CallSession({
      callId: fromSession && fromSession.callId,
      sipCallId: this.client.getSipSessionId(sipSession),
      sipStatus: state,
      displayName: sipSession.remoteIdentity.displayName || number,
      startTime: fromSession ? fromSession.startTime : new Date(),
      answered: state === SessionState.Established,
      paused: this.client.isCallHeld(sipSession),
      isCaller: 'incoming' in extra ? !extra.incoming : false,
      cameraEnabled: this.client.sessionWantsToDoVideo(sipSession),
      number,
      ringing: false,
      muted: false,
      ...extra,
    });
  }

  // Find a corresponding sipSession from a CallSession
  _findSipSession(callSession: ?CallSession): ?Session {
    const keys = Object.keys(this.sipSessions);
    const keyIndex = keys.findIndex(sessionId => callSession && callSession.isId(sessionId));
    if (keyIndex === -1) {
      const currentSipSessionId = this.currentSipSession
        ? this.client.getSipSessionId(this.currentSipSession)
        : Object.keys(this.sipSessions)[0];
      return currentSipSessionId ? this.sipSessions[currentSipSessionId] : null;
    }

    return this.sipSessions[keys[keyIndex]];
  }

  _parseSDP(sdp: string) {
    const labelMatches = sdp.match(/a=label:(.*)/m);
    const msidMatches = sdp.match(/a=msid:(.*)/gm);

    const label = labelMatches && labelMatches.length && labelMatches[1];
    const msid = msidMatches && msidMatches.length && msidMatches[msidMatches.length - 1].split(' ')[1];

    return { label, msid };
  }
}
