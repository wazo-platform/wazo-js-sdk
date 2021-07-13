/* global navigator */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// @flow
import type { Message } from 'sip.js/lib/api/message';
import type { Session } from 'sip.js/lib/core/session';
import { Invitation } from 'sip.js/lib/api/invitation';
import { SessionState } from 'sip.js/lib/api/session-state';
import type { IncomingRequestMessage } from 'sip.js/lib/core/messages/incoming-request-message';

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
export const ON_CALL_CANCELED = 'onCallCanceled';
export const ON_CALL_FAILED = 'onCallFailed';
export const ON_CALL_ENDED = 'onCallEnded';
export const ON_CALL_ENDING = 'onCallEnding';
export const ON_MESSAGE = 'onMessage';
export const ON_REINVITE = 'reinvite';
export const ON_TRACK = 'onTrack';
export const ON_AUDIO_STREAM = 'onAudioStream';
export const ON_VIDEO_STREAM = 'onVideoStream';
export const ON_REMOVE_STREAM = 'onRemoveStream';
export const ON_SHARE_SCREEN_STARTED = 'onScreenShareStarted';
export const ON_SHARE_SCREEN_ENDING = 'onScreenShareEnding';
export const ON_SHARE_SCREEN_ENDED = 'onScreenShareEnded';
export const ON_TERMINATE_SOUND = 'terminateSound';
export const ON_PLAY_RING_SOUND = 'playRingingSound';
export const ON_PLAY_INBOUND_CALL_SIGNAL_SOUND = 'playInboundCallSignalSound';
export const ON_PLAY_HANGUP_SOUND = 'playHangupSound';
export const ON_PLAY_PROGRESS_SOUND = 'playProgressSound';
export const ON_VIDEO_INPUT_CHANGE = 'videoInputChange';
export const ON_CALL_ERROR = 'onCallError';

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
  ON_CALL_ERROR,
];

const logger = IssueReporter.loggerFor('webrtc-phone');

export default class WebRTCPhone extends Emitter implements Phone {
  client: WazoWebRTCClient;

  allowVideo: boolean;

  sipSessions: { [string]: Session };

  callSessions: { [string]: CallSession };

  incomingSessions: string[];

  currentSipSession: Session;

  currentCallSession: ?CallSession;

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
    this.callSessions = {};
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
      console.error('register error', error, error.message, error.stack);
      logger.error('WebRTC register error', { message: error.message, stack: error.stack });
    });
  }

  unregister() {
    if (!this.client || !this.client.isRegistered()) {
      return null;
    }
    return this.client.unregister();
  }

  stop() {
    if (!this.client) {
      return;
    }
    logger.info('WebRTC phone stop');
    this.client.stop();
  }

  removeIncomingSessions(id: string) {
    this.incomingSessions = this.incomingSessions.filter(sessionId => sessionId !== id);
  }

  isWebRTC() {
    return true;
  }

  sendReinvite(sipSession: Session, newConstraints: Object = null) {
    logger.info('WebRTC phone - send reinvite', { sessionId: sipSession ? sipSession.id : null, newConstraints });

    if (!sipSession) {
      return;
    }

    return this.client.reinvite(sipSession, newConstraints);
  }

  getUserAgent() {
    return (this.client && this.client.config && this.client.config.userAgentString) || 'webrtc-phone';
  }

  startHeartbeat() {
    logger.info('WebRTC phone - start heartbeat', { client: !!this.client, hasHeartbeat: this.client.hasHeartbeat() });
    if (!this.client || this.client.hasHeartbeat()) {
      return;
    }

    this.client.startHeartbeat();
  }

  stopHeartbeat() {
    logger.info('WebRTC phone - stopHeartbeat', { client: !!this.client });
    if (!this.client) {
      return;
    }

    this.client.stopHeartbeat();
  }

  setOnHeartbeatTimeout(cb: Function) {
    this.client.setOnHeartbeatTimeout(cb);
  }

  setOnHeartbeatCallback(cb: Function) {
    this.client.setOnHeartbeatCallback(cb);
  }

  reconnect() {
    logger.info('WebRTC phone - reconnect', { client: !!this.client });
    if (!this.client) {
      return;
    }
    this.client.attemptReconnection();
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

  onConnect() {
    if (!this.client) {
      return Promise.reject(new Error('No webrtc client'));
    }
    return this.client.onConnect();
  }

  onDisconnect() {
    if (!this.client) {
      return Promise.reject(new Error('No webrtc client'));
    }
    return this.client.onDisconnect();
  }

  _bindEvents(sipSession: Session) {
    if (sipSession._onCancel) {
      // Monkey patch to know when canceled with the CANCEL message
      const onCancel = sipSession._onCancel.bind(sipSession);
      sipSession._onCancel = (message: IncomingRequestMessage) => {
        logger.trace('on sip session canceled', { callId: message.callId });

        onCancel(message);
        const elsewhere = message.data.indexOf('cause=26') !== -1 && message.data.indexOf('completed elsewhere') !== -1;
        this.eventEmitter.emit(ON_CALL_CANCELED, this._createCallSession(sipSession), elsewhere);
      };
    } else if (sipSession instanceof Invitation) {
      console.warn('sipSession._onCancel not found, please update the wazo SDK accordingly');
    }

    sipSession.stateChange.addListener((newState: SessionState) => {
      switch (newState) {
        case SessionState.Establishing:
          if (sipSession instanceof Invitation) {
            // No need to trigger progress for an invitation (eg: when we answer the call).
            return;
          }
          // When receiving a progress event, we know we are the caller so we have to force incoming to false
          return this.eventEmitter.emit(
            ON_PROGRESS,
            this._createCallSession(sipSession, null, { incoming: false, ringing: true }),
            this.audioOutputDeviceId,
            this.audioOutputVolume,
          );
        case SessionState.Terminating:
          logger.info('WebRTC phone - call terminating', { sipId: sipSession.id });

          this.eventEmitter.emit(ON_CALL_ENDING, this._createCallSession(sipSession));

          break;
        case SessionState.Terminated:
          logger.info('WebRTC phone - call terminated', { sipId: sipSession.id });

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

      if (event && event.track && event.track.kind === 'audio') {
        return this.eventEmitter.emit(ON_AUDIO_STREAM, stream);
      }

      // not sure this does anything
      if (event && event.track && event.track.kind === 'video') {
        event.track.enabled = false;
      }

      return this.eventEmitter.emit(ON_VIDEO_STREAM, stream, event.track.id, event);
    };

    peerConnection.onremovestream = event => {
      this.eventEmitter.emit(ON_REMOVE_STREAM, event.stream);
    };
  }

  async startScreenSharing(constraintsOrStream: ?Object | MediaStream, callSession?: CallSession) {
    if (!navigator.mediaDevices) {
      return null;
    }

    logger.info('WebRTC - stop screen sharing', { constraintsOrStream, id: callSession ? callSession.getId() : null });

    let screenShareStream = constraintsOrStream;
    let constraints = null;

    if (!constraintsOrStream || !(constraintsOrStream instanceof MediaStream)) {
      try {
        constraints = constraintsOrStream || { video: { cursor: 'always' }, audio: false };
        // $FlowFixMe
        screenShareStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (e) {
        logger.warn('WebRTC - stop screen sharing, error', e);
        return null;
      }
    }

    // $FlowFixMe
    screenShareStream.local = true;

    if (!screenShareStream) {
      throw new Error(`Can't create media stream for screensharing with contraints ${JSON.stringify(constraints)}`);
    }

    const screenTrack = screenShareStream.getVideoTracks()[0];
    const sipSession = this.currentSipSession;
    const pc = sipSession.sessionDescriptionHandler.peerConnection;
    const sender = pc && pc.getSenders().find(s => s && s.track && s.track.kind === 'video');
    const localStream = this.client.getLocalStream(pc);

    if (sender) {
      sender.replaceTrack(screenTrack);
    }

    screenTrack.onended = () => this.eventEmitter.emit(
      ON_SHARE_SCREEN_ENDING,
      this._createCallSession(sipSession, callSession),
    );
    this.currentScreenShare = { stream: screenShareStream, sender, localStream };

    this.eventEmitter.emit(
      ON_SHARE_SCREEN_STARTED,
      this._createCallSession(sipSession, callSession, { screensharing: true }),
    );

    return screenShareStream;
  }

  async stopScreenSharing(restoreLocalStream: boolean = true, callSession?: CallSession) {
    if (!this.currentScreenShare) {
      return;
    }

    logger.info('WebRTC phone - stop screen sharing');

    try {
      if (this.currentScreenShare.stream) {
        await this.currentScreenShare.stream.getVideoTracks().forEach(track => track.stop());
      }

      if (restoreLocalStream) {
        if (this.currentScreenShare.sender) {
          const track = this.currentScreenShare.localStream.getVideoTracks()[0];
          await this.currentScreenShare.sender.replaceTrack(track);

          if (callSession && callSession.isVideoMuted()) {
            logger.info('session\'s video is muted, muting track');
            let loop = 0;
            const minLoops = 4;
            const maxLoops = 20;
            const loopDelay = 50; // milliseconds
            // note: admittedly a tad kludgy: afaik, there's no way to establish track readiness so we need to test
            // over an arbitrary length of time; 1 second appears to be sufficient, along a 200ms minimum testing period.
            // Preliminary testing indicate that the minimum testing period is generally fine, with nominal exceptions.
            const interval = setInterval(() => {
              if (track.enabled) {
                track.enabled = false;
              }

              if (!track.enabled && loop > minLoops) {
                clearInterval(interval);
              }

              if (track.enabled && loop > maxLoops) {
                logger.error(
                  'Unable to mute the track as requested following a screenshare, bailing',
                  { maxLoops, loopDelay },
                );
                clearInterval(interval);
              }
              loop++;
            }, loopDelay);
          }
        }
      } else if (this.currentScreenShare.localStream) {
        await this.currentScreenShare.localStream.getVideoTracks().forEach(track => track.stop());
      }
    } catch (e) {
      console.warn(e);
    }

    const sipSession = this.currentSipSession;

    this.eventEmitter.emit(
      ON_SHARE_SCREEN_ENDED,
      callSession ? this._createCallSession(sipSession, callSession, { screensharing: false }) : null,
    );

    this.currentScreenShare = null;
  }

  _onCallAccepted(sipSession: Session, cameraEnabled: boolean): CallSession {
    logger.info('WebRTC phone -  on call accepted', { sipId: sipSession.id, cameraEnabled });

    const callSession = this._createAcceptedCallSession(sipSession, cameraEnabled);
    this.sipSessions[callSession.getId()] = sipSession;
    this.currentSipSession = sipSession;
    this.currentCallSession = callSession;

    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call accepted');
    const sipSessionId = this.getSipSessionId(sipSession);
    if (sipSessionId) {
      this.removeIncomingSessions(sipSessionId);
    }

    this.eventEmitter.emit(ON_CALL_ACCEPTED, callSession, cameraEnabled);

    return callSession;
  }

  changeAudioDevice(id: string) {
    logger.info('WebRTC phone - change audio device', { deviceId: id });
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
    logger.info('WebRTC phone - changeAudio input device', { deviceId: id });

    return this.client.changeAudioInputDevice(id, this.currentSipSession);
  }

  changeVideoInputDevice(id: string) {
    logger.info('WebRTC phone - change video input device', { deviceId: id });

    return this.client.changeVideoInputDevice(id, this.currentSipSession);
  }

  _onCallTerminated(sipSession: Session) {
    logger.info('WebRTC phone - on call terminated', { sipId: sipSession.id });

    this.client.onCallEnded(sipSession);

    const callSession = this._createCallSession(sipSession);
    const isCurrentSession = this.isCurrentCallSipSession(callSession);
    const isCurrentIncomingCall = callSession.is(this.getIncomingCallSession());

    // If the terminated call was an incoming call, we have to re-trigger if it's was the first incoming call
    // Otherwise, we have to re-trigger an incoming call event if another call is incoming
    const shouldRetrigger = isCurrentSession ? this.incomingSessions.length : isCurrentIncomingCall;

    // Terminate incoming sound only for the ringing call
    // (so another terminated call won't stop the incoming call sound)
    if (isCurrentIncomingCall) {
      setTimeout(() => {
        // Avoid race condition when the other is calling and hanging up immediately
        this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call terminated');
      }, 5);
    }

    const sipSessionId = this.getSipSessionId(sipSession);
    if (sipSessionId) {
      this.removeIncomingSessions(sipSessionId);
    }

    delete this.sipSessions[callSession.getId()];
    delete this.callSessions[callSession.getId()];

    if (isCurrentSession) {
      this.currentSipSession = undefined;
      this.currentCallSession = undefined;
    }

    const hasIncomingCallSession = this.hasIncomingCallSession();

    // Re-trigger incoming call event for remaining incoming calls
    logger.info('WebRTC phone - check to re-trigger incoming call', {
      sipId: sipSession.id,
      shouldRetrigger,
      hasIncomingCallSession,
    });

    if (hasIncomingCallSession && shouldRetrigger) {
      const nextCallSession = this.getIncomingCallSession();
      // Avoid race condition
      setTimeout(() => {
        if (this.ringingEnabled) {
          if (!this.currentCallSession) {
            this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, nextCallSession);
          } else {
            this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND,
              this.audioOutputDeviceId,
              this.audioOutputVolume,
              nextCallSession);
          }
        }

        // $FlowFixMe
        this.eventEmitter.emit(ON_CALL_INCOMING, nextCallSession, nextCallSession.cameraEnabled);
      }, 100);
    }

    if (callSession.getId() in this.ignoredSessions) {
      return;
    }

    if (!sipSession.isCanceled) {
      setTimeout(() => {
        this.eventEmitter.emit(ON_PLAY_HANGUP_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, callSession);
      }, 10);
    }
  }

  setActiveSipSession(callSession: CallSession) {
    const sipSessionId = this.findSipSession(callSession);
    if (!sipSessionId) {
      return;
    }

    this.currentSipSession = sipSessionId;
    this.currentCallSession = callSession;
  }

  hasAnActiveCall() {
    return !!this.currentSipSession;
  }

  // /!\ In some case with react-native webrtc the session will have only one audio stream set
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

    return this.currentSipSession && this.getSipSessionId(this.currentSipSession) === callSession.getId();
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

  getRemoteStreamsForCall(callSession: CallSession): Object[] {
    if (!callSession) {
      return [];
    }

    const sipSession = this.sipSessions[callSession.getId()];
    if (!sipSession || !sipSession.sessionDescriptionHandler) {
      return [];
    }

    const { peerConnection } = sipSession.sessionDescriptionHandler;
    return peerConnection.getRemoteStreams();
  }

  accept(callSession: CallSession, cameraEnabled?: boolean): Promise<string | null> {
    logger.info('WebRTC phone - accept call', { id: callSession ? callSession.getId() : 'n/a', cameraEnabled });
    if (this.currentSipSession) {
      this.holdSipSession(this.currentSipSession, this.currentCallSession, true);
    }

    if (!callSession) {
      logger.warn('no CallSession to accept.');
      return Promise.resolve(null);
    }

    if (callSession.getId() in this.acceptedSessions) {
      logger.warn('CallSession already accepted.', { id: callSession ? callSession.getId() : 'n/a' });
      return Promise.resolve(callSession.sipCallId);
    }

    this.shouldSendReinvite = false;
    this.acceptedSessions[callSession.getId()] = true;

    this.eventEmitter.emit(ON_CALL_ANSWERED, callSession);

    const sipSession = this.sipSessions[callSession.getId()];
    if (sipSession) {
      if (sipSession.state === SessionState.Terminated || sipSession.state === SessionState.Terminating) {
        logger.warn('Trying to answer a terminated sipSession.');

        return Promise.resolve(null);
      }

      logger.info('accept call, session found', { sipId: sipSession.id });

      // $FlowFixMe
      return this.client.answer(sipSession, this.allowVideo ? cameraEnabled : false).then(() => {
        return callSession.sipCallId;
      }).catch(e => {
        logger.error(e);
        this.endCurrentCall(callSession);
        throw e;
      });
    }

    logger.warn('no CallSession found to accept.', { id: callSession ? callSession.getId() : 'n/a' });

    return Promise.resolve(null);
  }

  isAccepted(callSession: CallSession): boolean {
    return callSession && callSession.getId() in this.acceptedSessions;
  }

  async reject(callSession: CallSession): Promise<void> {
    logger.info('reject WebRTC called', { id: callSession.getId() });

    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call rejected locally');
    if (!callSession || callSession.getId() in this.rejectedSessions) {
      return;
    }

    this.shouldSendReinvite = false;
    this.rejectedSessions[callSession.getId()] = true;

    const sipSession = this.findSipSession(callSession);
    if (sipSession) {
      logger.info('WebRTC rejecting', { sipId: sipSession.id });

      this.client.hangup(sipSession);
    }
  }

  async ignore(callSession: CallSession): Promise<void> {
    logger.info('WebRTC ignore', { id: callSession.getId() });

    // kill the ring
    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'ignoring call');
    this.ignoredSessions[callSession.getId()] = true;
    callSession.ignore();
  }

  hold(callSession: CallSession, withEvent: boolean = true, isConference: boolean = false): void {
    logger.info('WebRTC hold', { id: callSession.getId() });

    const sipSession = this.findSipSession(callSession);

    if (sipSession) {
      this.holdSipSession(sipSession, callSession, withEvent, isConference);
    }
  }

  unhold(callSession: CallSession, withEvent: boolean = true, isConference: boolean = false): void {
    logger.info('WebRTC unhold', { id: callSession ? callSession.getId() : null });

    console.warn('Please note that `phone.unhold()` is being deprecated; `phone.resume()` is the preferred method');

    const sipSession = this.findSipSession(callSession);

    if (sipSession) {
      this.unholdSipSession(sipSession, callSession, withEvent, isConference);
    }
  }

  atxfer(callSession: CallSession): ?Object {
    const sipSession = this.findSipSession(callSession);

    if (sipSession) {
      logger.info('WebRTC atxfer', { sipId: sipSession.id });

      return this.client.atxfer(sipSession);
    }
  }

  holdSipSession(
    sipSession: Session,
    callSession: ?CallSession,
    withEvent: boolean = true,
    isConference: boolean = false,
  ): Promise<any> {
    if (!sipSession) {
      return new Promise((resolve, reject) => reject(new Error('No session to hold')));
    }
    logger.info('WebRTC hold sip session', { sipId: sipSession.id });

    const promise = this.client.hold(sipSession, isConference);
    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_HELD, this._createCallSession(sipSession, callSession));
    }

    return promise;
  }

  unholdSipSession(
    sipSession: Session,
    callSession: ?CallSession,
    withEvent: boolean = true,
    isConference: boolean = false,
  ): Promise<any> {
    if (!sipSession) {
      return new Promise((resolve, reject) => reject(new Error('No session to unhold')));
    }
    logger.info('WebRTC unhold', { sipId: sipSession.id });

    const promise = this.client.unhold(sipSession, isConference);
    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_UNHELD, this._createCallSession(sipSession, callSession));
    }

    return promise;
  }

  resume(callSession?: CallSession, isConference: boolean = false): Promise<any> {
    logger.info('WebRTC resume called', { id: callSession ? callSession.getId() : null });

    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return new Promise((resolve, reject) => reject(new Error('No session to resume')));
    }

    logger.info('WebRTC resuming', { sipId: sipSession.id });

    // Hold current session if different from the current one (we don't want 2 sessions active at the same time).
    if (this.currentSipSession && this.currentSipSession.id !== sipSession.id) {
      logger.info('WebRTC hold call after resume', { id: this.currentSipSession.id });
      this.holdSipSession(this.currentSipSession, callSession);
    }

    const promise = this.client.unhold(sipSession, isConference);
    this.eventEmitter.emit(ON_CALL_RESUMED, this._createCallSession(sipSession, callSession));
    this.currentSipSession = sipSession;
    if (callSession) {
      this.currentCallSession = callSession;
    }

    return promise;
  }

  mute(callSession: ?CallSession, withEvent: boolean = true): void {
    logger.info('WebRTC mute called', { id: callSession ? callSession.getId() : null });

    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    logger.info('WebRTC muting', { sipId: sipSession.id });
    this.client.mute(sipSession);
    const newCallSession = this._createCallSession(sipSession, callSession, { muted: true });

    if (this.currentCallSession && newCallSession.is(this.currentCallSession)) {
      this.currentCallSession = newCallSession;
    }

    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_MUTED, newCallSession);
    }
  }

  unmute(callSession: ?CallSession, withEvent: boolean = true): void {
    logger.info('WebRTC unmute called', { id: callSession ? callSession.getId() : null });

    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    logger.info('WebRTC unmuting', { sipId: sipSession.id });
    this.client.unmute(sipSession);
    const newCallSession = this._createCallSession(sipSession, callSession, { muted: false });

    if (this.currentCallSession && newCallSession.is(this.currentCallSession)) {
      this.currentCallSession = newCallSession;
    }

    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_UNMUTED, newCallSession);
    }
  }

  isAudioMuted(callSession: CallSession): boolean {
    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return true;
    }

    return this.client.isAudioMuted(sipSession);
  }

  turnCameraOn(callSession?: CallSession): void {
    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return;
    }
    logger.info('WebRTC turn camera on', { sipId: sipSession.id });

    this.client.toggleCameraOn(sipSession);

    this.eventEmitter.emit(ON_CAMERA_RESUMED, this._createCameraResumedCallSession(sipSession, callSession));
  }

  turnCameraOff(callSession?: CallSession): void {
    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return;
    }
    logger.info('WebRTC turn camera off', { sipId: sipSession.id });

    this.client.toggleCameraOff(sipSession);
    this.eventEmitter.emit(ON_CAMERA_DISABLED, this._createCameraDisabledCallSession(sipSession, callSession));
  }

  sendKey(callSession: ?CallSession, tone: string): void {
    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    logger.info('WebRTC send key', { sipId: sipSession.id, tone });
    this.client.sendDTMF(sipSession, tone);
  }

  // Should be async to match CTIPhone definition
  // @TODO: line is not used here
  async makeCall(number: string, line: any, cameraEnabled?: boolean,
    audioOnly: boolean = false): Promise<?CallSession> {
    logger.info('make WebRTC call', { number, lineId: line ? line.id : null, cameraEnabled });
    if (!number) {
      return Promise.resolve(null);
    }

    if (!this.client.isRegistered()) {
      await this.client.register();
    }
    if (this.currentSipSession) {
      this.holdSipSession(this.currentSipSession, this.currentCallSession, true).catch(e => {
        logger.warn('Unable to hold current session when making another call', e);
      });
    }

    let sipSession: Session;
    try {
      sipSession = this.client.call(number, this.allowVideo ? cameraEnabled : false, audioOnly);
      this._bindEvents(sipSession);
    } catch (error) {
      console.warn(error);
      logger.warn('make WebRTC call, error', { message: error.message, stack: error.stack });
      return Promise.resolve(null);
    }
    const callSession = this._createOutgoingCallSession(sipSession, cameraEnabled || false);

    this.sipSessions[callSession.getId()] = sipSession;

    this.eventEmitter.emit(ON_PLAY_PROGRESS_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);

    this.currentSipSession = sipSession;
    this.currentCallSession = callSession;

    this.eventEmitter.emit(ON_CALL_OUTGOING, callSession);

    // If an invite promise exists, catch exceptions on it to trigger error like OverConstraintsError.
    if (sipSession.invitePromise) {
      sipSession.invitePromise.catch(error => {
        this.eventEmitter.emit(ON_CALL_ERROR, error, callSession);
      });
    }

    return Promise.resolve(callSession);
  }

  transfer(callSession: ?CallSession, target: string): void {
    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      return;
    }

    logger.info('WebRTC transfer', { sipId: sipSession.id, target });

    this.client.transfer(sipSession, target);
  }

  async indirectTransfer(source: CallSession, destination: CallSession): Promise<void> {
    const sipSession = this.sipSessions[source.sipCallId];
    const sipSessionTarget = this.sipSessions[destination.sipCallId];

    logger.info('WebRTC indirect transfer', { sipId: sipSession.id, target: sipSessionTarget.id });

    return sipSessionTarget.refer(sipSession).then(() => {
      return this.hangup(destination);
    });
  }

  initiateCTIIndirectTransfer() {}

  cancelCTIIndirectTransfer() {}

  confirmCTIIndirectTransfer() {}

  async hangup(callSession: ?CallSession): Promise<boolean> {
    const sipSession = this.findSipSession(callSession);
    if (!sipSession) {
      console.error('Call is unknown to the WebRTC phone', callSession ? callSession.sipCallId : null,
        callSession ? callSession.callId : null, Object.keys(this.sipSessions));
      return false;
    }

    logger.info('WebRTC hangup', { sipId: sipSession.id });

    const sipSessionId = this.getSipSessionId(sipSession);

    this.client.hangup(sipSession);
    if (callSession) {
      // Removal in `this.sipSessions` and `this.callSessions` will be done in `_onCallTerminated`.
      this.endCurrentCall(callSession);
    } else if (sipSessionId) {
      delete this.sipSessions[sipSessionId];
      if (callSession) {
        delete this.callSessions[callSession.getId()];
      }
    }

    this.shouldSendReinvite = false;
    return true;
  }

  forceCancel(sipSession: Session): void {
    if (!sipSession || !sipSession.outgoingInviteRequest) {
      return;
    }
    sipSession.outgoingInviteRequest.cancel();
  }

  endCurrentCall(callSession: CallSession): void {
    if (this.isCurrentCallSipSession(callSession)) {
      this.currentSipSession = undefined;
      this.currentCallSession = null;
    }

    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'locally ended');
  }

  onConnectionMade(): void {}

  async close(): Promise<void> {
    logger.info('WebRTC close');

    try {
      await Promise.race([
        this.unregister(),
        new Promise((resolve, reject) => setTimeout(() => reject(new Error('Unregister, timed out')), 3000)),
      ]);
    } catch (e) {
      logger.error('WebRTC close, unregister error', e);
    }

    this.client.close();
    this.unbind();

    this.sipSessions = {};
    this.incomingSessions = [];
    this.currentSipSession = null;
    this.currentCallSession = null;
    this.shouldSendReinvite = false;
    this.rejectedSessions = {};
  }

  isRegistered(): boolean {
    return this.client && this.client.isRegistered();
  }

  enableRinging(): Promise<void> | void {
    logger.info('WebRTC enable ringing');
    this.ringingEnabled = true;
  }

  disableRinging(): Promise<void> | void {
    logger.info('WebRTC disable ringing');
    this.ringingEnabled = false;
  }

  getCurrentCallSession(): ?CallSession {
    if (!this.currentSipSession) {
      return null;
    }

    return this._createCallSession(this.currentSipSession, this.currentCallSession);
  }

  hasIncomingCallSession(): boolean {
    return this.incomingSessions.length > 0;
  }

  getIncomingCallSession(): ?CallSession {
    if (!this.hasIncomingCallSession()) {
      return null;
    }

    const sessionId = this.incomingSessions[0];
    if (!(sessionId in this.sipSessions)) {
      return null;
    }

    return this._createCallSession(this.sipSessions[sessionId]);
  }

  sendMessage(sipSession: Session = null, body: string, contentType: string = 'text/plain') {
    if (!sipSession) {
      return;
    }

    logger.info('send WebRTC message', { sipId: sipSession.id, contentType });

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
    const sipSession = this.findSipSession(callSession);

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
      logger.info('WebRTC invite received', { sipId: sipSession.id, withVideo, autoAnswer });

      const callSession = this._createIncomingCallSession(sipSession, withVideo, null, autoAnswer);
      this.incomingSessions.push(callSession.getId());
      this._bindEvents(sipSession);

      this.sipSessions[callSession.getId()] = sipSession;

      if (!this.currentSipSession) {
        if (this.ringingEnabled) {
          this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, callSession);
        }
      } else {
        this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND,
          this.audioOutputDeviceId,
          this.audioOutputVolume,
          callSession);
      }

      this.eventEmitter.emit(ON_CALL_INCOMING, callSession, wantsToDoVideo);
    });

    this.client.on(this.client.ON_REINVITE, (...args) => {
      logger.info('WebRTC reinvite', {
        sessionId: args[0].id,
        inviteId: args[1].id,
        updatedCalleeName: args[2],
        updatedNumber: args[3],
      });

      const sipSession = args[0];
      // Update callSession
      this._createCallSession(sipSession);

      this.eventEmitter.emit.apply(this.eventEmitter, [this.client.ON_REINVITE, ...args]);
    });

    this.client.on(this.client.ACCEPTED, (sipSession: Session) => {
      logger.info('WebRTC call accepted', { sipId: sipSession.id });

      this._onCallAccepted(sipSession, this.client.sessionHasVideo(this.getSipSessionId(sipSession)));

      if (this.audioOutputDeviceId) {
        this.client.changeAudioOutputDevice(this.audioOutputDeviceId);
      }
    });
    this.client.on('ended', () => {});

    this.client.on(this.client.ON_ERROR, e => {
      logger.error('WebRTC error', e);
      this.eventEmitter.emit(ON_CALL_ERROR, e);
    });

    this.client.on(this.client.UNREGISTERED, () => {
      logger.info('WebRTC unregistered');
      this.eventEmitter.emit(ON_UNREGISTERED);
    });

    this.client.on(this.client.REGISTERED, () => {
      logger.info('WebRTC registered', {
        shouldSendReinvite: this.shouldSendReinvite,
        state: this.currentSipSession ? this.currentSipSession.state : null,
        currentSipSession: !!this.currentSipSession,
      });
      this.stopHeartbeat();
      this.eventEmitter.emit(ON_REGISTERED);

      // If the phone registered with a current callSession (eg: when switching network):
      // send a reinvite to renegociate ICE with new IP
      if (this.shouldSendReinvite && this.currentSipSession
        && this.currentSipSession.state === SessionState.Established) {
        this.shouldSendReinvite = false;
        try {
          this.sendReinvite(this.currentSipSession);
        } catch (e) {
          logger.error('WebRTC reinvite after register, error', { message: e.message, stack: e.stack });
        }
      }
    });

    this.client.on(this.client.CONNECTED, () => {
      logger.info('WebRTC client connected');

      this.stopHeartbeat();
    });

    this.client.on(this.client.DISCONNECTED, () => {
      logger.info('WebRTC client disconnected');

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

  // Find a corresponding sipSession from a CallSession
  findSipSession(callSession: ?CallSession): ?Session {
    const keys = Object.keys(this.sipSessions);
    const keyIndex = keys.findIndex(sessionId => callSession && callSession.isId(sessionId));
    if (keyIndex === -1) {
      const currentSipSessionId = this.currentSipSession
        ? this.getSipSessionId(this.currentSipSession)
        : Object.keys(this.sipSessions)[0];
      return currentSipSessionId ? this.sipSessions[currentSipSessionId] : null;
    }

    return this.sipSessions[keys[keyIndex]];
  }

  getSipSessionId(sipSession: Session) {
    return this.client.getSipSessionId(sipSession);
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
    });
  }

  _createUnmutedCallSession(sipSession: Session, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: false,
    });
  }

  _createCameraResumedCallSession(sipSession: Session, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      videoMuted: false,
    });
  }

  _createCameraDisabledCallSession(sipSession: Session, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      videoMuted: true,
    });
  }

  _createCallSession(sipSession: Session, fromSession?: ?CallSession, extra: Object = {}): CallSession {
    // eslint-disable-next-line
    const identity = sipSession ? sipSession.remoteIdentity || sipSession.assertedIdentity : null;
    const number = identity ? identity.uri._normal.user : null;
    const { state } = sipSession || {};

    const callSession = new CallSession({
      callId: fromSession && fromSession.callId,
      sipCallId: this.getSipSessionId(sipSession),
      sipStatus: state,
      displayName: identity ? identity.displayName || number : number,
      startTime: fromSession ? fromSession.startTime : new Date(),
      answered: state === SessionState.Established,
      paused: this.client.isCallHeld(sipSession),
      isCaller: 'incoming' in extra ? !extra.incoming : false,
      cameraEnabled: fromSession ? fromSession.isCameraEnabled() : this.client.sessionWantsToDoVideo(sipSession),
      number,
      ringing: false,
      muted: fromSession ? fromSession.isMuted() : false,
      videoMuted: fromSession ? fromSession.isVideoMuted() : false,
      recording: fromSession ? fromSession.isRecording() : false,
      recordingPaused: false, // @TODO
      ...extra,
    });

    this.callSessions[callSession.getId()] = callSession;

    return callSession;
  }

  _parseSDP(sdp: string) {
    const labelMatches = sdp.match(/a=label:(.*)/m);
    const msidMatches = sdp.match(/a=msid:(.*)/gm);

    const label = labelMatches && labelMatches.length && labelMatches[1];
    const msid = msidMatches && msidMatches.length && msidMatches[msidMatches.length - 1].split(' ')[1];

    return { label, msid };
  }
}
