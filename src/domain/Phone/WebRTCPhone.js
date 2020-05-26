/* global navigator */
// @flow

import CallSession from '../CallSession';
import type { Phone, AvailablePhoneOptions } from './Phone';
import WazoWebRTCClient from '../../web-rtc-client';
import SIP from '../../sip';
import Emitter from '../../utils/Emitter';
import IssueReporter from '../../service/IssueReporter';

export const ON_REGISTERED = 'onRegistered';
export const ON_UNREGISTERED = 'onUnRegistered';
export const ON_PROGRESS = 'onProgress';
export const ON_CALL_ACCEPTED = 'onCallAccepted';
export const ON_CALL_ANSWERED = 'onCallAnswered';
export const ON_CALL_INCOMING = 'onCallIncoming';
export const ON_CALL_OUTGOING = 'onCallOutgoing';
export const ON_CALL_MUTED = 'onCallMuted';
export const ON_CALL_UNMUTED = 'onCallUnmuted';
export const ON_CALL_RESUMED = 'onCameraResumed';
export const ON_CALL_HELD = 'onCallHeld';
export const ON_CALL_UNHELD = 'onCallUnHeld';
export const ON_CAMERA_DISABLED = 'onCameraDisabled';
export const ON_CALL_FAILED = 'onCallFailed';
export const ON_CALL_ENDED = 'onCallEnded';
export const ON_MESSAGE = 'onMessage';
export const ON_REINVITE = 'reinvite';
export const ON_AUDIO_STREAM = 'onAudioStream';
export const ON_VIDEO_STREAM = 'onVideoStream';
export const ON_REMOVE_STREAM = 'onRemoveStream';
export const ON_SHARE_SCREEN_ENDED = 'onScreenShareEnded';
export const ON_TERMINATE_SOUND = 'terminateSound';
export const ON_PLAY_RING_SOUND = 'playRingingSound';
export const ON_PLAY_INBOUND_CALL_SIGNAL_SOUND = 'playInboundCallSignalSound';
export const ON_PLAY_HANGUP_SOUND = 'playHangupSound';
export const ON_PLAY_PROGRESS_SOUND = 'playProgressSound';

export const events = [
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
  ON_AUDIO_STREAM,
  ON_VIDEO_STREAM,
  ON_REMOVE_STREAM,
  ON_SHARE_SCREEN_ENDED,
  ON_TERMINATE_SOUND,
  ON_PLAY_RING_SOUND,
  ON_PLAY_INBOUND_CALL_SIGNAL_SOUND,
  ON_PLAY_HANGUP_SOUND,
  ON_PLAY_PROGRESS_SOUND,
];

export default class WebRTCPhone extends Emitter implements Phone {
  client: WazoWebRTCClient;

  allowVideo: boolean;

  shouldRegisterAgain: boolean;

  sipSessions: { [string]: SIP.sessionDescriptionHandler };

  incomingSessions: string[];

  currentSipSession: SIP.sessionDescriptionHandler;

  audioOutputDeviceId: ?string;

  audioRingDeviceId: ?string;

  ringingEnabled: boolean;

  acceptedSessions: Object;

  rejectedSessions: Object;

  currentScreenShare: Object;

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
    this.incomingSessions = [];
    this.ringingEnabled = true;
    this.shouldRegisterAgain = true;

    this.client.on('invite', (sipSession: SIP.sessionDescriptionHandler, wantsToDoVideo: boolean) => {
      const autoAnswer = sipSession.request.getHeader('Answer-Mode') === 'Auto';
      const withVideo = this.allowVideo ? wantsToDoVideo : false;
      const callSession = this._createIncomingCallSession(sipSession, withVideo, null, autoAnswer);
      this.incomingSessions.push(callSession.getId());
      this._bindEvents(sipSession);

      this.sipSessions[callSession.getId()] = sipSession;

      if (!this.currentSipSession) {
        if (this.ringingEnabled) {
          this.eventEmitter.emit(ON_TERMINATE_SOUND);
          this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId);
        }
      } else {
        this.eventEmitter.emit(ON_TERMINATE_SOUND);
        this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND, this.audioOutputDeviceId);
      }

      this.eventEmitter.emit(ON_CALL_INCOMING, callSession);
    });

    this.client.on('accepted', () => {});
    this.client.on('ended', () => {});

    this.client.on('unregistered', () => {
      this.eventEmitter.emit(ON_UNREGISTERED);

      if (this.shouldRegisterAgain) {
        this.register();
      }
    });

    this.client.on('registered', () => {
      this.eventEmitter.emit(ON_REGISTERED);
    });

    this.client.on('disconnected', () => {
      this.eventEmitter.emit(ON_UNREGISTERED);
    });

    this.acceptedSessions = {};
    this.rejectedSessions = {};
  }

  register() {
    this.shouldRegisterAgain = true;

    if (!this.client) {
      return;
    }

    try {
      this.client.register();
    } catch (error) {
      console.error('[WebRtcPhone] register error', error, error.message, error.stack);
      // Avoid exception on `t.server.scheme` in sip transport when losing the webrtc socket connection
    }
  }

  unregister() {
    if (!this.client || !this.client.isRegistered()) {
      return;
    }
    this.shouldRegisterAgain = false;

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

  _bindEvents(sipSession: SIP.sessionDescriptionHandler) {
    sipSession.on('accepted', () => {
      this._onCallAccepted(sipSession, this.client.sessionHasVideo(this.client.getSipSessionId(sipSession)));

      if (this.audioOutputDeviceId) {
        this.client.changeAudioOutputDevice(this.audioOutputDeviceId);
      }
    });
    sipSession.on('progress', () => {
      // When receiving a progress event, we know we are the caller so we have to force incoming to false
      this.eventEmitter.emit(
        ON_PROGRESS,
        this._createCallSession(sipSession, null, { incoming: false, ringing: true }),
        this.audioOutputDeviceId,
      );
    });
    sipSession.on('muted', callSession => {
      this.eventEmitter.emit(ON_CALL_MUTED, this._createMutedCallSession(sipSession, callSession));
    });
    sipSession.on('unmuted', callSession => {
      this.eventEmitter.emit(ON_CALL_UNMUTED, this._createUnmutedCallSession(sipSession, callSession));
    });
    sipSession.on('cameraOn', callSession => {
      this.eventEmitter.emit(ON_CALL_RESUMED, this._createCameraResumedCallSession(sipSession, callSession));
    });
    sipSession.on('cameraOff', callSession => {
      this.eventEmitter.emit(ON_CAMERA_DISABLED, this._createCameraDisabledCallSession(sipSession, callSession));
    });

    sipSession.on('failed', reason => {
      this.eventEmitter.emit(ON_CALL_FAILED, this._createCallSession(sipSession), reason);

      this._onCallTerminated(sipSession);
    });

    sipSession.on('rejected', () => {
      this._onCallTerminated(sipSession);

      this.eventEmitter.emit(ON_CALL_ENDED, this._createCallSession(sipSession));
    });

    sipSession.on('terminated', () => {
      this._onCallTerminated(sipSession);

      this.eventEmitter.emit(ON_CALL_ENDED, this._createCallSession(sipSession));
    });

    sipSession.on('cancel', () => {
      this._onCallTerminated(sipSession);

      this.eventEmitter.emit(ON_CALL_ENDED, this._createCallSession(sipSession));
    });

    sipSession.on('message', (message) => {
      this.eventEmitter.emit(ON_MESSAGE, message);
    });

    sipSession.on('reinvite', (session: SIP.InviteClientContext, message: SIP.IncomingRequestMessage) => {
      const { label, msid } = this._parseSDP(message.data);
      return this.eventEmitter.emit(ON_REINVITE, session, message, label, msid);
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

      return this.eventEmitter.emit(ON_VIDEO_STREAM, stream, event.track.id);
    };

    peerConnection.onremovestream = event => {
      this.eventEmitter.emit(ON_REMOVE_STREAM, event.stream);
    };
  }

  async startScreenSharing(constraints: Object) {
    if (!navigator.mediaDevices) {
      return null;
    }

    return navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' }, audio: false })
      .then(stream => {
        const screenShareStream = stream;
        // $FlowFixMe
        screenShareStream.local = true;
        return this._continueScreenSharing(stream, constraints);
      })
      .catch(e => {
        console.warn(e);
        return null;
      });
  }

  _continueScreenSharing(screenShareStream: MediaStream, constraints: Object) {
    if (!screenShareStream) {
      throw new Error(`Can't create media stream for screensharing with contraints ${JSON.stringify(constraints)}`);
    }

    const screenTrack = screenShareStream.getVideoTracks()[0];
    const sipSession = this.currentSipSession;
    const pc = sipSession.sessionDescriptionHandler.peerConnection;
    const sender = pc.getSenders().find(s => s.track.kind === 'video');
    const localStream = this.client.getLocalStream(pc);

    sender.replaceTrack(screenTrack);

    screenTrack.onended = async () => this.eventEmitter.emit(ON_SHARE_SCREEN_ENDED);

    this.currentScreenShare = { stream: screenShareStream, sender, localStream };

    return screenShareStream;
  }

  async stopScreenSharing() {
    if (!this.currentScreenShare) {
      return;
    }

    await this.currentScreenShare.stream.getVideoTracks().forEach(track => track.stop());

    this.currentScreenShare.sender.replaceTrack(this.currentScreenShare.localStream.getVideoTracks()[0]);
  }

  _onCallAccepted(sipSession: SIP.sessionDescriptionHandler, videoEnabled: boolean): CallSession {
    const callSession = this._createAcceptedCallSession(sipSession, videoEnabled);
    this.sipSessions[callSession.getId()] = sipSession;
    this.currentSipSession = sipSession;

    this.eventEmitter.emit(ON_TERMINATE_SOUND);
    const sipSessionId = this.client.getSipSessionId(sipSession);
    if (sipSessionId) {
      this.removeIncomingSessions(sipSessionId);
    }

    this.eventEmitter.emit(ON_CALL_ACCEPTED, callSession);

    return callSession;
  }

  changeAudioDevice(id: string) {
    this.audioOutputDeviceId = id;
    this.client.changeAudioOutputDevice(id);
  }

  changeRingDevice(id: string) {
    this.audioRingDeviceId = id;
  }

  changeAudioInputDevice(id: string) {
    this.client.changeAudioInputDevice(id, this.currentSipSession);
  }

  changeVideoInputDevice(id: string) {
    this.client.changeVideoInputDevice(id, this.currentSipSession);
  }

  _onCallTerminated(sipSession: SIP.sessionDescriptionHandler) {
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

    this.eventEmitter.emit(ON_PLAY_HANGUP_SOUND, this.audioOutputDeviceId);
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
    return this.client.videoSessions[callSession.getId()].local;
  }

  getRemoteStreamForCall(callSession: CallSession): boolean {
    return this.client.videoSessions[callSession.getId()].remotes[0];
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

  accept(callSession: CallSession, videoEnabled?: boolean): string | null {
    if (this.currentSipSession) {
      this.holdSipSession(this.currentSipSession);
    }

    if (!callSession || callSession.getId() in this.acceptedSessions) {
      return null;
    }

    this.acceptedSessions[callSession.getId()] = true;

    this.eventEmitter.emit(ON_CALL_ANSWERED, callSession);

    const sipSession = this.sipSessions[callSession.getId()];
    if (sipSession) {
      this.client.answer(sipSession, this.allowVideo ? videoEnabled : false);

      return callSession.sipCallId;
    }

    return null;
  }

  async reject(callSession: CallSession): Promise<void> {
    this.eventEmitter.emit(ON_TERMINATE_SOUND);
    if (!callSession || callSession.getId() in this.rejectedSessions) {
      return;
    }

    this.rejectedSessions[callSession.getId()] = true;

    const sipSession = this._findSipSession(callSession);
    if (sipSession) {
      this.client.reject(sipSession);
    }
  }

  hold(callSession: CallSession, withEvent: boolean = true): void {
    const sipSession = this._findSipSession(callSession);
    this.holdSipSession(sipSession, withEvent);
  }

  unhold(callSession: CallSession, withEvent: boolean = true): void {
    const sipSession = this._findSipSession(callSession);
    this.unholdSipSession(sipSession, withEvent);
  }

  holdSipSession(sipSession: SIP.sessionDescriptionHandler, withEvent: boolean = true): void {
    if (!sipSession) {
      return;
    }

    this.client.hold(sipSession);
    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_HELD, this._createCallSession(sipSession));
    }
  }

  unholdSipSession(sipSession: SIP.sessionDescriptionHandler, withEvent: boolean = true): void {
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
    if (this.currentSipSession) {
      this.holdSipSession(this.currentSipSession);
    }

    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
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
      sipSession.emit('muted', callSession);
    }
  }

  unmute(callSession: ?CallSession, withEvent: boolean = true): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.unmute(sipSession);

    if (withEvent) {
      sipSession.emit('unmuted', callSession);
    }
  }

  turnCameraOn(callSession: ?CallSession): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.toggleCameraOn(sipSession);

    sipSession.emit('cameraOn', callSession);
  }

  turnCameraOff(callSession: ?CallSession): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.toggleCameraOff(sipSession);
    sipSession.emit('cameraOff', callSession);
  }

  sendKey(callSession: ?CallSession, tone: string): void {
    const sipSession = this._findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    this.client.sendDTMF(sipSession, tone);
  }

  // Should be async to match CTIPhone definition
  async makeCall(number: string, line: any, enableVideo?: boolean): Promise<?CallSession> {
    if (!number) {
      return new Promise(resolve => resolve(null));
    }
    if (!this.client.isRegistered()) {
      this.client.register();
    }
    if (this.currentSipSession) {
      this.holdSipSession(this.currentSipSession);
    }

    let sipSession;
    try {
      sipSession = this.client.call(number, this.allowVideo ? enableVideo : false);
    } catch (error) {
      console.warn(error);
      return new Promise(resolve => resolve(null));
    }
    const callSession = this._createOutgoingCallSession(sipSession, enableVideo || false);

    this.sipSessions[callSession.getId()] = sipSession;

    this.eventEmitter.emit(ON_PLAY_PROGRESS_SOUND, this.audioOutputDeviceId);

    this.currentSipSession = sipSession;

    // We use a setTimeout because the sipSession becomes as InviteClientContext right after
    // But I don't know when
    setTimeout(() => this._bindEvents(sipSession), 0);

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
      sipSession.emit('muted', participant);
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
      sipSession.emit('unmuted', participant);
    });
  }

  endCurrentCall(callSession: CallSession): void {
    if (this.isCurrentCallSipSession(callSession)) {
      this.currentSipSession = undefined;
    }

    this.eventEmitter.emit(ON_TERMINATE_SOUND, this.audioOutputDeviceId);

    if (!this.currentSipSession && this.incomingSessions.length > 0) {
      this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioOutputDeviceId);
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

  sendMessage(sipSession: SIP.sessionDescriptionHandler = null, body: string) {
    if (!sipSession) {
      return;
    }

    sipSession.sendRequest('MESSAGE', {
      body: {
        body,
        contentType: 'text/plain',
      },
    });
  }

  _createIncomingCallSession(
    sipSession: SIP.sessionDescriptionHandler,
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
    sipSession: SIP.sessionDescriptionHandler,
    cameraEnabled: boolean,
    fromSession?: CallSession,
  ): CallSession {
    return this._createCallSession(sipSession, fromSession, { incoming: false, ringing: true, cameraEnabled });
  }

  _createAcceptedCallSession(
    sipSession: SIP.sessionDescriptionHandler,
    cameraEnabled?: boolean,
    fromSession?: CallSession,
  ): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      cameraEnabled: cameraEnabled !== undefined ? cameraEnabled : false,
    });
  }

  _createMutedCallSession(sipSession: SIP.sessionDescriptionHandler, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: true,
      cameraEnabled: this.client.sessionHasLocalVideo(this.client.getSipSessionId(sipSession)),
    });
  }

  _createUnmutedCallSession(sipSession: SIP.sessionDescriptionHandler, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      cameraEnabled: this.client.sessionHasLocalVideo(this.client.getSipSessionId(sipSession)),
    });
  }

  _createCameraResumedCallSession(sipSession: SIP.sessionDescriptionHandler, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: !this.client.sessionHasAudio(sipSession),
      cameraEnabled: true,
    });
  }

  _createCameraDisabledCallSession(sipSession: SIP.sessionDescriptionHandler, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: !this.client.sessionHasAudio(sipSession),
      cameraEnabled: false,
    });
  }

  _createCallSession(
    sipSession: SIP.sessionDescriptionHandler,
    fromSession?: ?CallSession,
    extra: Object = {},
  ): CallSession {
    // eslint-disable-next-line
    const number = sipSession.remoteIdentity.uri._normal.user;

    return new CallSession({
      callId: fromSession && fromSession.callId,
      sipCallId: this.client.getSipSessionId(sipSession),
      sipStatus: sipSession.status,
      displayName: sipSession.remoteIdentity.displayName || number,
      startTime: sipSession.startTime,
      answered: sipSession.hasAnswer,
      paused: sipSession.localHold,
      isCaller: 'incoming' in extra ? !extra.incoming : false,
      number,
      ringing: false,
      muted: false,
      ...extra,
    });
  }

  // Find a corresponding sipSession from a CallSession
  _findSipSession(callSession: ?CallSession): ?SIP.sessionDescriptionHandler {
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
