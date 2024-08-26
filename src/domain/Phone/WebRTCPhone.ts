/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import type { Message } from 'sip.js/lib/api/message';
import { SessionState } from 'sip.js/lib/api/session-state';
import type { IncomingRequestMessage } from 'sip.js/lib/core/messages/incoming-request-message';
import { OutgoingInviteRequest } from 'sip.js/lib/core';
import { Inviter, Invitation, Session, SessionDescriptionHandlerOptions } from 'sip.js/lib/api';
import { SessionDescriptionHandler } from 'sip.js/lib/platform/web';
import CallSession from '../CallSession';
import type { Phone, AvailablePhoneOptions } from './Phone';
import WebRTCClient from '../../web-rtc-client';
import Emitter from '../../utils/Emitter';
import IssueReporter from '../../service/IssueReporter';
import { PeerConnection, WazoSession } from '../types';
import { getCallDisplayName, getCallNumber, getSipSessionId } from '../../utils/sdp';
import { downgradeToAudio, getStreamFromConstraints, getWebRtcStats, setLocalMediaStream, upgradeToVideo } from '../../utils/webrtc';

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
export const ON_CALL_REJECTED = 'onCallRejected';
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
export const ON_MESSAGE_TRACK_UPDATED = 'onTrackUpdated';
export const ON_NETWORK_STATS = 'onNetworkStats';
export const ON_CHAT = 'phone/ON_CHAT';
export const ON_SIGNAL = 'phone/ON_SIGNAL';
export const ON_DISCONNECTED = 'onDisconnected';
export const ON_EARLY_MEDIA = 'onEarlyMedia';
export const MESSAGE_TYPE_CHAT = 'message/TYPE_CHAT';
export const MESSAGE_TYPE_SIGNAL = 'message/TYPE_SIGNAL';
export const events = [ON_USER_AGENT, ON_REGISTERED, ON_UNREGISTERED, ON_PROGRESS, ON_CALL_ACCEPTED, ON_CALL_ANSWERED, ON_CALL_INCOMING, ON_CALL_OUTGOING, ON_CALL_MUTED, ON_CALL_UNMUTED, ON_CALL_RESUMED, ON_CALL_HELD, ON_CALL_UNHELD, ON_CAMERA_DISABLED, ON_CALL_FAILED, ON_CALL_ENDED, ON_CALL_REJECTED, ON_MESSAGE, ON_REINVITE, ON_TRACK, ON_AUDIO_STREAM, ON_VIDEO_STREAM, ON_REMOVE_STREAM, ON_SHARE_SCREEN_ENDED, ON_TERMINATE_SOUND, ON_PLAY_RING_SOUND, ON_PLAY_INBOUND_CALL_SIGNAL_SOUND, ON_PLAY_HANGUP_SOUND, ON_PLAY_PROGRESS_SOUND, ON_VIDEO_INPUT_CHANGE, ON_SHARE_SCREEN_STARTED, ON_CALL_ERROR, ON_CHAT, ON_SIGNAL, ON_NETWORK_STATS, ON_DISCONNECTED, ON_EARLY_MEDIA];
const logger = IssueReporter.loggerFor('webrtc-phone');

// @deprecated: Use Wazo.Voice.Softphone instead
export default class WebRTCPhone extends Emitter implements Phone {
  client: WebRTCClient;

  allowVideo: boolean;

  callSessions: Record<string, CallSession>;

  incomingSessions: string[];

  currentSipSession?: WazoSession;

  currentCallSession?: CallSession;

  audioOutputDeviceId?: string;

  audioRingDeviceId?: string;

  audioOutputVolume: number;

  audioRingVolume: number;

  ringingEnabled: boolean;

  acceptedSessions: Record<string, any>;

  rejectedSessions: Record<string, any>;

  ignoredSessions: Record<string, any>;

  currentScreenShare: Record<string, any> | null;

  lastScreenShare: Record<string, any> | null;

  shouldSendReinvite: boolean;

  constructor(client: WebRTCClient, audioOutputDeviceId: string | undefined, allowVideo = false, audioRingDeviceId?: string) {
    super();
    this.client = client;
    this.allowVideo = allowVideo;
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
    logger.info('WebRTC register', { client: !!this.client });
    if (!this.client) {
      return Promise.resolve();
    }

    return this.client.register().then(() => {
      logger.info('WebRTC register, registered');
      return this.bindClientEvents();
    }).catch(error => {
      // Avoid exception on `t.server.scheme` in sip transport when losing the webrtc socket connection
      console.error('register error', error, error.message, error.stack);
      logger.error('WebRTC register error', {
        message: error.message,
        stack: error.stack,
      });
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

  async sendReinvite(callSession?: CallSession, constraints: Record<string, any> | null | undefined = null, conference = false, audioOnly = false, iceRestart = false): Promise<OutgoingInviteRequest | void> {
    const sipSession = this.findSipSession(callSession);
    logger.info('WebRTC phone - send reinvite', {
      sessionId: getSipSessionId(sipSession),
      constraints,
      audioOnly,
      conference,
      iceRestart,
    });

    if (!sipSession) {
      return;
    }

    const shouldScreenShare = constraints?.screen;
    const isUpgrade = shouldScreenShare || constraints?.video;

    // Downgrade
    if (constraints && !isUpgrade) {
      // No reinvite needed
      this._downgradeToAudio(callSession);

      return;
    }

    if (isUpgrade) {
      const shouldReinvite = await this._upgradeToVideo(callSession, constraints, conference);

      if (!shouldReinvite) {
        return;
      }
    }

    return this.client.reinvite(sipSession, constraints, conference, audioOnly, iceRestart);
  }

  getUserAgent() {
    return this.client?.config?.userAgentString || 'webrtc-phone';
  }

  startHeartbeat() {
    logger.info('WebRTC phone - start heartbeat', {
      client: !!this.client,
      hasHeartbeat: this.client.hasHeartbeat(),
    });

    if (!this.client || this.client.hasHeartbeat()) {
      return;
    }

    this.client.startHeartbeat();
  }

  stopHeartbeat() {
    logger.info('WebRTC phone - stopHeartbeat', {
      client: !!this.client,
    });

    if (!this.client) {
      return;
    }

    this.client.stopHeartbeat();
  }

  setOnHeartbeatTimeout(cb: (...args: Array<any>) => any) {
    this.client.setOnHeartbeatTimeout(cb);
  }

  setOnHeartbeatCallback(cb: (...args: Array<any>) => any) {
    this.client.setOnHeartbeatCallback(cb);
  }

  reconnect() {
    logger.info('WebRTC phone - reconnect', {
      client: !!this.client,
    });

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

  _downgradeToAudio(callSession?: CallSession, withMessage = true) {
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return false;
    }

    logger.info('Downgrade to audio', {
      id: callSession ? callSession.getId() : null,
      withMessage,
    });
    downgradeToAudio(sipSession);

    if (callSession) {
      callSession.cameraEnabled = false;

      this._updateCallSession(callSession);
    }

    if (withMessage) {
      this._sendReinviteMessage(callSession, false);
    }

    return true;
  }

  // Returns true if we need to send a re-INVITE request
  async _upgradeToVideo(callSession: CallSession | undefined, constraints: Record<string, any>, isConference: boolean): Promise<boolean> {
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return Promise.resolve(false);
    }

    logger.info('Upgrade to video', {
      id: callSession ? callSession.getId() : null,
      constraints,
      isConference,
    });
    const shouldScreenShare = constraints && !!constraints.screen;
    const desktop = constraints && constraints.desktop;
    const options = sipSession.sessionDescriptionHandlerOptionsReInvite;
    const wasAudioOnly = (options as SessionDescriptionHandlerOptions & { audioOnly: boolean })?.audioOnly;
    const newStream = await upgradeToVideo(sipSession, constraints, isConference);

    if (callSession) {
      callSession.cameraEnabled = true;

      this._updateCallSession(callSession);
    }

    // If no stream is returned, it means we have to reinvite
    if (!newStream) {
      return true;
    }

    this._sendReinviteMessage(callSession, true);

    if (shouldScreenShare) {
      this._onScreenSharing(newStream, sipSession, callSession, false, desktop);
    }

    // We have to reinvite to change the direction on the bundle when upgrading from an audioOnly conference
    if (isConference && wasAudioOnly) {
      return true;
    }

    // No reinvite needed here
    return false;
  }

  _sendReinviteMessage(callSession: CallSession | undefined, isUpgrade: boolean) {
    const sipSession = this.findSipSession(callSession);
    logger.info('Sending reinvite message', {
      id: callSession ? callSession.getId() : null,
      isUpgrade,
    });

    // Have to send the message after a delay due to latency to update the remote peer
    setTimeout(() => {
      this.sendMessage(sipSession, JSON.stringify({
        type: MESSAGE_TYPE_SIGNAL,
        content: {
          type: ON_MESSAGE_TRACK_UPDATED,
          update: isUpgrade ? 'upgrade' : 'downgrade',
          sipCallId: sipSession && getSipSessionId(sipSession),
          callId: callSession ? callSession.callId : null,
          number: callSession ? callSession.number : null,
        },
      }));
    }, 2500);
  }

  _bindEvents(sipSession: WazoSession) {
    const sipSessionId = getSipSessionId(sipSession);

    if (sipSession instanceof Invitation) {
      // Monkey patch to know when canceled with the CANCEL message
      const onCancel = sipSession._onCancel.bind(sipSession);

      sipSession._onCancel = (message: IncomingRequestMessage) => {
        logger.trace('on sip session canceled', {
          callId: message.callId,
          sipSessionId,
        });
        onCancel(message);
        const elsewhere = message.data.indexOf('cause=26') !== -1 && message.data.indexOf('completed elsewhere') !== -1;
        const callSession = this._createCallSession(sipSession);

        if (sipSessionId) {
          delete this.callSessions[sipSessionId];
        }
        this.eventEmitter.emit(ON_CALL_CANCELED, callSession, elsewhere);
      };
    }

    sipSession.stateChange.addListener((newState: SessionState) => {
      switch (newState) {
        case SessionState.Terminating:
          logger.info('WebRTC phone - call terminating', {
            sipId: getSipSessionId(sipSession),
          });
          this.eventEmitter.emit(ON_CALL_ENDING, this._createCallSession(sipSession));
          break;

        case SessionState.Terminated:
        {
          logger.info('WebRTC phone - call terminated', {
            sipId: getSipSessionId(sipSession),
          });

          // Should be called before `_onCallTerminated` or the callCount will not decrement...
          const callSession = this._createCallSession(sipSession);

          callSession.endTime = new Date();

          const wasCurrentSession = this._onCallTerminated(sipSession);

          return this.eventEmitter.emit(ON_CALL_ENDED, callSession, wasCurrentSession);
        }

        default:
          break;
      }
    });

    if (!sipSession.sessionDescriptionHandler) {
      return;
    }

    // Video events
    const sdh = sipSession.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sdh.peerConnection as PeerConnection;

    if (!peerConnection) {
      logger.info('null peer connection');
      return;
    }

    peerConnection.ontrack = (rawEvent: RTCTrackEvent) => {
      const event = rawEvent;
      const [stream] = event.streams;
      const kind = event && event.track && event.track.kind;
      logger.info('on track stream called on the peer connection', {
        callId: getSipSessionId(sipSession),
        streamId: stream ? stream.id : null,
        tracks: stream ? stream.getTracks() : null,
        kind,
      });

      if (kind === 'audio') {
        return this.eventEmitter.emit(ON_AUDIO_STREAM, stream);
      }

      return this.eventEmitter.emit(ON_VIDEO_STREAM, stream, event.track.id, event, sipSession);
    };

    peerConnection.onremovestream = (event: any) => {
      logger.info('on remove stream called on the peer connection', {
        id: event.stream.id,
        tracks: event.stream.getTracks(),
      });
      this.eventEmitter.emit(ON_REMOVE_STREAM, event.stream);
    };
  }

  async startScreenSharing(constraints: Record<string, any>, callSession?: CallSession): Promise<MediaStream> {
    logger.info('WebRTC - start screen sharing', {
      constraints,
      id: callSession ? callSession.getId() : null,
    });
    const screenShareStream = await getStreamFromConstraints(constraints);

    if (!screenShareStream) {
      throw new Error(`Can't create media stream for screensharing with: ${JSON.stringify(constraints)}`);
    }

    const screenTrack = screenShareStream.getVideoTracks()[0];
    const sipSession = this.currentSipSession;
    const pc = sipSession && this.client.getPeerConnection(getSipSessionId(sipSession));
    const sender = pc && pc.getSenders && pc.getSenders().find((s) => s && s.track && s.track.kind === 'video');
    const localStream = sipSession && this.client.getLocalStream(getSipSessionId(sipSession));
    const videoTrack = localStream ? localStream.getTracks().find(track => track.kind === 'video') : null;
    const hadVideo = !!videoTrack;

    // Stop local video tracks
    if (videoTrack && localStream) {
      videoTrack.enabled = false;
      videoTrack.stop();
      localStream.removeTrack(videoTrack);
    }

    if (localStream) {
      localStream.addTrack(screenTrack);
    }

    if (sender) {
      sender.replaceTrack(screenTrack);
    }

    this._onScreenSharing(screenShareStream, sipSession as WazoSession, callSession, hadVideo, constraints.desktop);

    return screenShareStream;
  }

  async stopScreenSharing(restoreLocalStream = true, callSession?: CallSession): Promise<OutgoingInviteRequest | void | null> {
    if (!this.currentScreenShare) {
      return;
    }

    logger.info('WebRTC phone - stop screen sharing', {
      restoreLocalStream,
    });
    let reinvited: OutgoingInviteRequest | null | void = null;

    try {
      if (this.currentScreenShare.stream) {
        this.currentScreenShare.stream.getTracks()
          .filter((track: MediaStreamTrack) => track.enabled && track.kind === 'video')
          .forEach((track: MediaStreamTrack) => track.stop());
      }

      if (restoreLocalStream) {
        const targetCallSession = callSession || this.currentCallSession;
        const conference = this.isConference(targetCallSession);
        // When stopping screenshare and we had video before that, we have to re-upgrade
        // When upgrading directly to screenshare (eg: we don't have a videoLocalStream to replace)
        // We have to downgrade to audio.
        const screenshareStopped = this.currentScreenShare.hadVideo;
        const constraints = {
          audio: false,
          video: screenshareStopped,
        };

        // We have to remove the video sender to be able to re-upgrade to video in `sendReinvite` below
        this._downgradeToAudio(targetCallSession, false);

        // Wait for the track to be removed, unless the video sender won't have a null track in `_upgradeToVideo`.
        await new Promise(resolve => setTimeout(resolve, 500));
        reinvited = await this.sendReinvite(targetCallSession, constraints, conference);
      }
    } catch (e: any) {
      console.warn(e);
    }

    const sipSession = this.currentSipSession;
    this.eventEmitter.emit(ON_SHARE_SCREEN_ENDED, callSession && sipSession ? this._createCallSession(sipSession, callSession, {
      screensharing: false,
    }) : null);
    this.currentScreenShare = null;

    return reinvited;
  }

  _onScreenSharing(screenStream: MediaStream, sipSession: WazoSession, callSession: CallSession | null | undefined, hadVideo: boolean, desktop?: boolean | null | undefined) {
    const screenTrack = screenStream.getVideoTracks()[0];
    const sipSessionId = getSipSessionId(sipSession);
    const pc = this.client.getPeerConnection(sipSessionId);
    const sender = pc && pc.getSenders && pc.getSenders().find((s) => s && s.track && s.track.kind === 'video');
    logger.info('WebRTC phone - on screensharing', {
      hadVideo,
      id: getSipSessionId(sipSession),
      screenTrack,
    });

    if (screenTrack) {
      screenTrack.onended = () => {
        logger.info('WebRTC phone - on screenshare ended', {
          hadVideo,
          id: getSipSessionId(sipSession),
          screenTrack,
        });
        this.eventEmitter.emit(ON_SHARE_SCREEN_ENDING, this._createCallSession(sipSession, callSession));
      };
    }

    this.currentScreenShare = {
      stream: screenStream,
      hadVideo,
      sender,
      sipSessionId,
      desktop,
    };
    setLocalMediaStream(sipSession, screenStream);
    this.eventEmitter.emit(ON_SHARE_SCREEN_STARTED, this._createCallSession(sipSession, callSession, {
      screensharing: true,
    }), screenStream);
  }

  _onCallAccepted(sipSession: WazoSession, cameraEnabled: boolean): CallSession {
    logger.info('WebRTC phone - on call accepted', {
      sipId: getSipSessionId(sipSession),
      cameraEnabled,
    });

    const callSession = this._createAcceptedCallSession(sipSession, cameraEnabled);

    if (this.currentSipSession && !this.isCurrentCallSipSession(callSession)) {
      logger.info('WebRTC phone - on call accepted with another ongoing call, holding it', {
        sipId: getSipSessionId(sipSession),
        cameraEnabled,
      });

      this.holdSipSession(this.currentSipSession, this.currentCallSession, true);
    }

    this.currentSipSession = sipSession;
    this.currentCallSession = callSession;
    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call accepted');
    const sipSessionId = getSipSessionId(sipSession);

    if (sipSessionId) {
      this.removeIncomingSessions(sipSessionId);
    }

    callSession.answerTime = new Date();

    this._updateCallSession(callSession);

    this.eventEmitter.emit(ON_CALL_ACCEPTED, callSession, cameraEnabled);
    return callSession;
  }

  async changeAudioDevice(id: string) {
    logger.info('WebRTC phone - change audio device', {
      deviceId: id,
    });
    this.audioOutputDeviceId = id;
    return this.client.changeAudioOutputDevice(id);
  }

  createAudioElementFor(sessionId: string) {
    return this.client.createAudioElementFor(sessionId);
  }

  changeRingDevice(id: string) {
    logger.info('WebRTC phone - changing ring device', {
      id,
    });
    this.audioRingDeviceId = id;
  }

  // volume is a value between 0 and 1
  changeAudioVolume(volume: number) {
    logger.info('WebRTC phone - changing audio volume', {
      volume,
    });
    this.audioOutputVolume = volume;
    this.client.changeAudioOutputVolume(volume);
  }

  // volume is a value between 0 and 1
  changeRingVolume(volume: number) {
    logger.info('WebRTC phone - changing ring volume', {
      volume,
    });
    this.audioRingVolume = volume;
  }

  changeAudioInputDevice(id: string, force?: boolean) {
    logger.info('WebRTC phone - changeAudio input device', {
      deviceId: id,
    });
    return this.client.changeAudioInputDevice(id, this.currentSipSession, force);
  }

  async changeVideoInputDevice(id: string): Promise<void | MediaStream | null | undefined> {
    logger.info('WebRTC phone - change video input device', {
      deviceId: id,
    });
    return this.client.changeVideoInputDevice(id, this.currentSipSession);
  }

  changeSessionVideoInputDevice(id: string | null | undefined) {
    logger.info('WebRTC phone - change session video input device', {
      deviceId: id,
    });
    return this.currentSipSession && this.client.changeSessionVideoInputDevice(id, this.currentSipSession);
  }

  _onCallTerminated(sipSession: WazoSession): boolean {
    const sipSessionId = getSipSessionId(sipSession);

    logger.info('WebRTC phone - on call terminated', {
      sipId: getSipSessionId(sipSession),
      sipSessionId,
      ids: Object.keys(this.callSessions),
    });

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

    if (sipSessionId) {
      this.removeIncomingSessions(sipSessionId);

      delete this.callSessions[sipSessionId];
    }

    if (isCurrentSession) {
      this.currentSipSession = undefined;
      this.currentCallSession = undefined;
    }

    const hasIncomingCallSession = this.hasIncomingCallSession();
    // Re-trigger incoming call event for remaining incoming calls
    logger.info('WebRTC phone - check to re-trigger incoming call', {
      sipId: getSipSessionId(sipSession),
      shouldRetrigger,
      hasIncomingCallSession,
    });
    this.client.onCallEnded(sipSession);

    if (hasIncomingCallSession && shouldRetrigger) {
      const nextCallSession = this.getIncomingCallSession();
      // Avoid race condition
      setTimeout(() => {
        if (this.ringingEnabled) {
          if (!this.currentCallSession) {
            this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, nextCallSession);
          } else {
            this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, nextCallSession);
          }
        }

        this.eventEmitter.emit(ON_CALL_INCOMING, nextCallSession, nextCallSession?.cameraEnabled);
      }, 100);
    }

    if (callSession.getId() in this.ignoredSessions) {
      return false;
    }

    // @ts-ignore: does not exist
    if (!sipSession.isCanceled) {
      setTimeout(() => {
        this.eventEmitter.emit(ON_PLAY_HANGUP_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, callSession);
      }, 10);
    }

    return isCurrentSession;
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
  hasActiveRemoteVideoStream() {
    const sipSession = this.currentSipSession;

    if (!sipSession) {
      return false;
    }

    const sdh = sipSession.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sdh.peerConnection as PeerConnection;
    const remoteStream: MediaStream = peerConnection.getRemoteStreams().find((stream: MediaStream) => !!stream.getVideoTracks().length) as MediaStream;
    return remoteStream && remoteStream.getVideoTracks().some(track => !track.muted);
  }

  callCount(): number {
    return Object.keys(this.callSessions).length;
  }

  isCurrentCallSipSession(callSession: CallSession): boolean {
    if (!this.currentSipSession) {
      return false;
    }

    return this.currentSipSession && getSipSessionId(this.currentSipSession) === callSession.getId();
  }

  hasVideo(callSession: CallSession): boolean {
    return this.client.hasVideo(callSession.getId());
  }

  hasAVideoTrack(callSession: CallSession): boolean {
    return this.client.hasAVideoTrack(callSession.getId());
  }

  // Deprecated
  getLocalStreamForCall(callSession: CallSession): MediaStream | null | undefined {
    logger.warn('WebRTCPhone.getLocalStreamForCall is deprecated, use WebRTCPhone.getLocalStream instead');
    return this.getLocalStream(callSession);
  }

  // Deprecated
  getRemoteStreamForCall(callSession: CallSession): MediaStream | null | undefined {
    logger.warn('WebRTCPhone.getRemoteStreamForCall is deprecated, use WebRTCPhone.getRemoteStream instead');
    return this.getRemoteVideoStream(callSession);
  }

  getRemoteStreamsForCall(callSession: CallSession): MediaStream | null | undefined {
    logger.warn('WebRTCPhone.getRemoteStreamsForCall is deprecated, use WebRTCPhone.getRemoteStreams instead');
    return this.getRemoteStream(callSession);
  }

  accept(callSession: CallSession, cameraEnabled?: boolean): Promise<string | null> {
    logger.info('WebRTC phone - accept call', {
      id: callSession ? callSession.getId() : 'n/a',
      cameraEnabled,
    });

    if (this.currentSipSession && !this.isCurrentCallSipSession(callSession)) {
      this.holdSipSession(this.currentSipSession, this.currentCallSession, true);
    }

    if (!callSession) {
      logger.warn('no CallSession to accept.');
      return Promise.resolve(null);
    }

    const sipSessionId = this.getSipSessionIdFromCallSession(callSession);

    if (sipSessionId && !(sipSessionId in this.callSessions)) {
      logger.warn('Call session already ended or not found, can\'t accept it.', {
        sipSessionId,
      });
      return Promise.resolve(null);
    }

    if (callSession.getId() in this.acceptedSessions) {
      logger.warn('CallSession already accepted.', {
        id: callSession ? callSession.getId() : 'n/a',
      });
      return Promise.resolve(callSession.sipCallId);
    }

    this.shouldSendReinvite = false;
    callSession.answerTime = new Date();

    this._updateCallSession(callSession);

    this.acceptedSessions[callSession.getId()] = true;
    this.eventEmitter.emit(ON_CALL_ANSWERED, callSession);
    const sipSession = this.client.getSipSession(callSession.getId()) as Invitation;

    if (sipSession) {
      logger.info('accept call, session found', { sipId: getSipSessionId(sipSession) });

      return this.client.answer(sipSession, this.allowVideo ? cameraEnabled : false).then(() => {
        return callSession.sipCallId;
      }).catch(e => {
        logger.error(e);
        this.endCurrentCall(callSession);
        throw e;
      });
    }

    const error = 'No CallSession found to accept.';

    logger.warn(error, {
      id: callSession ? callSession.getId() : 'n/a',
      ids: this.client.getSipSessionIds(),
    });

    if (callSession) {
      this.eventEmitter.emit(ON_CALL_ERROR, new Error(error), callSession);
    }

    return Promise.resolve(null);
  }

  isAccepted(callSession: CallSession): boolean {
    return callSession && callSession.getId() in this.acceptedSessions;
  }

  async reject(callSession: CallSession): Promise<void> {
    logger.info('reject WebRTC called', {
      id: callSession.getId(),
    });
    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call rejected locally');

    if (!callSession || callSession.getId() in this.rejectedSessions) {
      return;
    }

    this.shouldSendReinvite = false;
    this.rejectedSessions[callSession.getId()] = true;
    const sipSession = this.findSipSession(callSession);

    if (sipSession) {
      logger.info('WebRTC rejecting', {
        sipId: getSipSessionId(sipSession),
      });
      this.client.hangup(sipSession);
    }
  }

  async ignore(callSession: CallSession): Promise<void> {
    logger.info('WebRTC ignore', {
      id: callSession.getId(),
    });
    // kill the ring
    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'ignoring call');
    this.ignoredSessions[callSession.getId()] = true;
    callSession.ignore();
  }

  atxfer(callSession: CallSession): Record<string, any> | null | undefined {
    const sipSession = this.findSipSession(callSession) as Inviter;

    if (sipSession) {
      logger.info('WebRTC atxfer', {
        sipId: getSipSessionId(sipSession),
      });
      return this.client.atxfer(sipSession);
    }
  }

  hold(callSession: CallSession, withEvent = true): Promise<OutgoingInviteRequest | void> | null | undefined {
    logger.info('WebRTC hold', {
      id: callSession.getId(),
    });
    const sipSession = this.findSipSession(callSession);
    return sipSession ? this.holdSipSession(sipSession, callSession, withEvent) : null;
  }

  // @Deprecated
  unhold(callSession: CallSession, withEvent = true): Promise<MediaStream | void | null> {
    console.warn('Please note that `phone.unhold()` is being deprecated; `phone.resume()` is the preferred method');
    return this.resume(callSession, withEvent);
  }

  resume(callSession?: CallSession, withEvent = true): Promise<MediaStream | void | null> {
    logger.info('WebRTC resume called', {
      id: callSession ? callSession.getId() : null,
    });
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return new Promise((resolve, reject) => reject(new Error('No session to resume')));
    }

    logger.info('WebRTC resuming', {
      sipId: getSipSessionId(sipSession),
    });

    // Hold current session if different from the current one (we don't want 2 sessions active at the same time).
    if (this.currentSipSession && getSipSessionId(this.currentSipSession) !== getSipSessionId(sipSession)) {
      logger.info('WebRTC hold call after resume', {
        id: getSipSessionId(this.currentSipSession),
      });
      this.holdSipSession(this.currentSipSession, this.currentCallSession, withEvent);
    }

    const promise = this.unholdSipSession(sipSession, callSession, withEvent);
    this.currentSipSession = sipSession;

    if (callSession) {
      this.currentCallSession = callSession;
    }

    return promise;
  }

  async holdSipSession(sipSession: WazoSession, callSession?: CallSession, withEvent = true): Promise<OutgoingInviteRequest | void> {
    if (!sipSession) {
      return new Promise((resolve, reject) => reject(new Error('No session to hold')));
    }

    const sessionId = getSipSessionId(sipSession);
    const hasVideo = this.client.hasLocalVideo(sessionId);
    logger.info('WebRTC hold sip session', {
      sipId: getSipSessionId(sipSession),
      hasVideo,
    });

    // Stop screenshare if needed
    if (this.currentScreenShare && this.currentScreenShare.sipSessionId === sessionId) {
      this.lastScreenShare = this.currentScreenShare;
      await this.stopScreenSharing(false, callSession);
    }

    // Downgrade to audio if needed
    if (hasVideo) {
      await downgradeToAudio(sipSession);
    }

    const isConference = !!callSession && callSession.isConference();
    const promise = this.client.hold(sipSession, isConference, hasVideo);

    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_HELD, this._createCallSession(sipSession, callSession));
    }

    return promise;
  }

  async unholdSipSession(sipSession: WazoSession, callSession: CallSession | null | undefined, withEvent = true): Promise<MediaStream | void | null> {
    if (!sipSession) {
      return new Promise((resolve, reject) => reject(new Error('No session to unhold')));
    }

    const isConference = !!callSession && callSession.isConference();
    const sessionId = getSipSessionId(sipSession);
    logger.info('WebRTC unhold sip session', {
      sessionId,
      isConference,
    });
    const {
      hasVideo,
    } = this.client.getHeldSession(sessionId) || {};
    const wasScreensharing = this.lastScreenShare && this.lastScreenShare.sipSessionId === sessionId;
    const wasDesktop = this.lastScreenShare && this.lastScreenShare.desktop;
    const promise = this.client.unhold(sipSession, isConference);

    if (hasVideo) {
      const constraints = {
        audio: false,
        video: true,
        screen: wasScreensharing,
        desktop: wasDesktop,
      };
      await upgradeToVideo(sipSession, constraints, isConference);
    }

    const onScreenSharing = (stream: MediaStream | null | undefined) => {
      const hadVideo = this.lastScreenShare && this.lastScreenShare.hadVideo;

      if (stream) {
        this._onScreenSharing(stream, sipSession, callSession, hadVideo);
      }

      this.lastScreenShare = null;
    };

    if (withEvent) {
      // Calling webRtcClient.unhold will unmute the call; let's make sure the call session reflects that state
      if (callSession) {
        callSession.muted = false;
      }
      const updatedCallSession = this._createCallSession(sipSession, callSession);

      // Deprecated event
      this.eventEmitter.emit(ON_CALL_UNHELD, updatedCallSession);
      this.eventEmitter.emit(ON_CALL_RESUMED, updatedCallSession);
    }

    return promise.then(() => {
      const stream = callSession ? this.getLocalVideoStream(callSession) : null;

      if (wasScreensharing) {
        onScreenSharing(stream);
      }

      return stream;
    });
  }

  mute(callSession?: CallSession, withEvent = true): void {
    logger.info('WebRTC mute called', {
      id: callSession ? callSession.getId() : null,
    });
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return;
    }

    logger.info('WebRTC muting', {
      sipId: getSipSessionId(sipSession),
    });
    this.client.mute(sipSession);

    const newCallSession = this._createCallSession(sipSession, callSession, {
      muted: true,
    });

    if (this.currentCallSession && newCallSession.is(this.currentCallSession)) {
      this.currentCallSession = newCallSession;
    }

    if (withEvent) {
      this.eventEmitter.emit(ON_CALL_MUTED, newCallSession);
    }
  }

  unmute(callSession?: CallSession, withEvent = true): void {
    logger.info('WebRTC unmute called', {
      id: callSession ? callSession.getId() : null,
    });
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return;
    }

    logger.info('WebRTC unmuting', {
      sipId: getSipSessionId(sipSession),
    });
    this.client.unmute(sipSession);

    const newCallSession = this._createCallSession(sipSession, callSession, {
      muted: false,
    });

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

    logger.info('WebRTC turn camera on', {
      sipId: getSipSessionId(sipSession),
    });
    this.client.toggleCameraOn(sipSession);
    this.eventEmitter.emit(ON_CAMERA_RESUMED, this._createCameraResumedCallSession(sipSession, callSession));
  }

  turnCameraOff(callSession?: CallSession): void {
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return;
    }

    logger.info('WebRTC turn camera off', {
      sipId: getSipSessionId(sipSession),
    });
    this.client.toggleCameraOff(sipSession);
    this.eventEmitter.emit(ON_CAMERA_DISABLED, this._createCameraDisabledCallSession(sipSession, callSession));
  }

  sendKey(callSession: CallSession | undefined, tone: string): void {
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return;
    }

    logger.info('WebRTC send key', {
      sipId: getSipSessionId(sipSession),
      tone,
    });
    this.client.sendDTMF(sipSession, tone);
  }

  // Should be async to match CTIPhone definition
  // @TODO: line is not used here
  async makeCall(number: string, line: any, cameraEnabled?: boolean, audioOnly = false, conference = false, options = {}): Promise<CallSession | null | undefined> {
    logger.info('make WebRTC call', {
      number,
      lineId: line ? line.id : null,
      cameraEnabled,
      audioOnly,
      conference,
      options,
    });

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

    let sipSession: WazoSession;

    try {
      sipSession = this.client.call(number, this.allowVideo ? cameraEnabled : false, audioOnly, conference, options) as WazoSession;

      this._bindEvents(sipSession);
    } catch (error: any) {
      logger.warn('make WebRTC call, error', {
        message: error.message,
        stack: error.stack,
      });
      return Promise.resolve(null);
    }

    const callSession = this._createOutgoingCallSession(sipSession, cameraEnabled || false);

    callSession.setIsConference(conference);
    callSession.creationTime = new Date();

    this._updateCallSession(callSession);

    this.eventEmitter.emit(ON_PLAY_PROGRESS_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);
    this.currentSipSession = sipSession;
    this.currentCallSession = callSession;
    this.eventEmitter.emit(ON_CALL_OUTGOING, callSession);

    // If an invite promise exists, catch exceptions on it to trigger error like OverConstraintsError.
    // @ts-ignore: does not exist
    if (sipSession.invitePromise) {
      // @ts-ignore: does not exist
      sipSession.invitePromise.catch(error => {
        this.eventEmitter.emit(ON_CALL_ERROR, error, callSession);
      });
    }

    return Promise.resolve(callSession);
  }

  transfer(callSession: CallSession, target: string): void {
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      return;
    }

    logger.info('WebRTC transfer', {
      sipId: getSipSessionId(sipSession),
      target,
    });
    this.client.transfer(sipSession, target);
  }

  async indirectTransfer(source: CallSession, destination: CallSession): Promise<boolean> {
    const sipSession = this.client.getSipSession(source.sipCallId);
    const sipSessionTarget = this.client.getSipSession(destination.sipCallId);
    logger.info('WebRTC indirect transfer', {
      sipId: sipSession ? getSipSessionId(sipSession) : null,
      target: sipSessionTarget ? getSipSessionId(sipSessionTarget) : null,
    });

    if (!sipSessionTarget) {
      return Promise.reject();
    }

    return new Promise(resolve => {
      const options = {
        requestDelegate: {
          onAccept: () => {
            // Wait a little so the REFER will take effect
            setTimeout(() => {
              this.hangup(destination).then(resolve);
            }, 200);
          },
        },
      };

      return sipSessionTarget.refer((sipSession as Session), options);
    });
  }

  initiateCTIIndirectTransfer() { return Promise.resolve(null); }

  cancelCTIIndirectTransfer() {}

  confirmCTIIndirectTransfer() {}

  async hangup(callSession?: CallSession): Promise<boolean> {
    const sipSession = this.findSipSession(callSession);

    if (!sipSession) {
      console.error('Call is unknown to the WebRTC phone', callSession ? callSession.sipCallId : null, callSession ? callSession.callId : null);
      return false;
    }
    const sipSessionId = getSipSessionId(sipSession);

    logger.info('WebRTC hangup', {
      sipId: getSipSessionId(sipSession),
      sipSessionId,
    });
    await this.client.hangup(sipSession);

    if (callSession) {
      // Removal of `this.callSessions` will be done in `_onCallTerminated`.
      this.endCurrentCall(callSession);
    } else if (sipSessionId) {
      delete this.callSessions[sipSessionId];
    }

    this.shouldSendReinvite = false;
    return true;
  }

  async getStats(callSession?: CallSession): Promise<RTCStatsReport | null | undefined> {
    const sipSession = this.findSipSession(callSession);
    return sipSession ? getWebRtcStats(sipSession) : null;
  }

  startNetworkMonitoring(callSession?: CallSession, interval = 1000) {
    const sipSession = this.findSipSession(callSession);
    return sipSession ? this.client.startNetworkMonitoring(sipSession, interval) : null;
  }

  stopNetworkMonitoring(callSession?: CallSession) {
    const sipSession = this.findSipSession(callSession);
    return sipSession ? this.client.stopNetworkMonitoring(sipSession) : null;
  }

  forceCancel(sipSession: Inviter): void {
    // @ts-ignore: private
    if (!sipSession || !sipSession.outgoingInviteRequest) {
      return;
    }

    try {
      // @ts-ignore: private
      sipSession.outgoingInviteRequest.cancel();
    } catch (e) {
      logger.info('force cancel, error', e);
    }
  }

  endCurrentCall(callSession: CallSession): void {
    const isCurrent = this.isCurrentCallSipSession(callSession);
    logger.info('Ending current call', {
      id: callSession ? callSession.getId() : null,
      isCurrent,
    });

    if (isCurrent) {
      this.currentSipSession = undefined;
      this.currentCallSession = undefined;
    }

    this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'locally ended');
  }

  onConnectionMade(): void {}

  isConference(callSession: CallSession | null | undefined): boolean {
    if (!callSession) {
      return false;
    }

    return this.client && this.client.isConference(callSession.sipCallId);
  }

  async close(force = false): Promise<void> {
    logger.info('WebRTC close');

    try {
      await Promise.race([
        this.unregister(),
        new Promise((resolve, reject) => setTimeout(() => reject(new Error('Unregister, timed out')), 3000)),
      ]);
    } catch (e: any) {
      logger.error('WebRTC close, unregister error', e);
    }

    await this.client.close(force);
    this.unbind();
    this.incomingSessions = [];
    this.currentSipSession = undefined;
    this.currentCallSession = undefined;
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

  getCurrentCallSession(): CallSession | null | undefined {
    if (!this.currentSipSession) {
      return null;
    }

    return this._createCallSession(this.currentSipSession, this.currentCallSession);
  }

  hasIncomingCallSession(): boolean {
    return this.incomingSessions.length > 0;
  }

  getIncomingCallSession(): CallSession | null | undefined {
    if (!this.hasIncomingCallSession()) {
      return null;
    }

    const sessionId = this.incomingSessions[0];
    const sipSession = this.client.getSipSession(sessionId);

    if (!sipSession) {
      return null;
    }

    return this._createCallSession(sipSession);
  }

  // eslint-disable-next-line @typescript-eslint/default-param-last
  sendMessage(sipSession: WazoSession | null = null, body: string, contentType = 'text/plain'): void {
    return this.client.sendMessage(sipSession, body, contentType);
  }

  getLocalStream(callSession: CallSession): MediaStream | null | undefined {
    return callSession ? this.client.getLocalStream(callSession.sipCallId) : null;
  }

  getLocalVideoStream(callSession: CallSession): MediaStream | null | undefined {
    return callSession ? this.client.getLocalVideoStream(callSession.sipCallId) : null;
  }

  // Deprecated
  getLocalMediaStream(callSession: CallSession): MediaStream | null | undefined {
    logger.warn('WebRTCPhone.getLocalMediaStream is deprecated, use WebRTCPhone.getLocalStream instead');
    return this.getLocalStream(callSession);
  }

  hasLocalVideo(callSession: CallSession): boolean {
    return callSession ? this.client.hasLocalVideo(callSession.sipCallId) : false;
  }

  hasALocalVideoTrack(callSession: CallSession): boolean {
    return callSession ? this.client.hasALocalVideoTrack(callSession.sipCallId) : false;
  }

  getRemoteStream(callSession: CallSession): MediaStream | null | undefined {
    return callSession ? this.client.getRemoteStream(callSession.sipCallId) : null;
  }

  getRemoteVideoStream(callSession: CallSession): MediaStream | null | undefined {
    return callSession ? this.client.getRemoteVideoStream(callSession.sipCallId) : null;
  }

  getRemoteVideoStreamFromPc(callSession: CallSession): MediaStream | null | undefined {
    return callSession ? this.client.getRemoteVideoStreamFromPc(callSession.sipCallId) : null;
  }

  hasRemoteVideo(callSession: CallSession): boolean {
    return callSession ? this.client.hasRemoteVideo(callSession.sipCallId) : false;
  }

  setMediaConstraints(media: MediaStreamConstraints): void {
    this.client.setMediaConstraints(media);
  }

  isVideoRemotelyHeld(callSession: CallSession): boolean {
    return callSession ? this.client.isVideoRemotelyHeld(callSession.sipCallId) : false;
  }

  bindClientEvents() {
    this.client.unbind();
    this.client.on(this.client.INVITE, (sipSession: WazoSession, wantsToDoVideo: boolean) => {
      const autoAnswer = sipSession.request.getHeader('Answer-Mode') === 'Auto';
      const withVideo = this.allowVideo ? wantsToDoVideo : false;
      logger.info('WebRTC invite received', {
        sipId: getSipSessionId(sipSession),
        withVideo,
        autoAnswer,
      });

      const callSession = this._createIncomingCallSession(sipSession, withVideo, null, autoAnswer);

      this.incomingSessions.push(callSession.getId());

      this._bindEvents(sipSession);

      this.client.storeSipSession(sipSession);

      callSession.creationTime = new Date();

      this._updateCallSession(callSession);

      this.eventEmitter.emit(ON_CALL_INCOMING, callSession, wantsToDoVideo);

      if (!this.currentSipSession) {
        if (this.ringingEnabled) {
          this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, callSession);
        }
      } else {
        this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, callSession);
      }
    });
    this.client.on(this.client.ON_REINVITE, (...args) => {
      logger.info('WebRTC on reinvite', {
        sessionId: args[0].id,
        inviteId: args[1].id,
        updatedCalleeName: args[2],
        updatedNumber: args[3],
      });
      const sipSession = args[0];
      // Give some time for the stream to be mounted.
      // if `_createCallSession` is called too soon `hasVideo` will return false because the stream doesn't exists yet
      setTimeout(() => {
        // Update callSession
        this._createCallSession(sipSession, this.callSessions[getSipSessionId(sipSession)]);

        this.eventEmitter.emit.apply(this.eventEmitter, [this.client.ON_REINVITE, ...args]);
      }, 2000);
    });
    this.client.on(this.client.ACCEPTED, async (sipSession: WazoSession) => {
      const sessionId = getSipSessionId(sipSession);
      const hasSession = (sessionId in this.callSessions);
      logger.info('WebRTC call accepted', {
        sipId: sessionId,
        hasSession,
      });

      if (!hasSession) {
        logger.warn('Call accepted ignored, session is no longer present in the WebRtcPhone', {
          sessionId,
        });
        return;
      }

      this._onCallAccepted(sipSession, this.client.hasVideo(sessionId));

      if (this.audioOutputDeviceId) {
        await this.client.changeAudioOutputDevice(this.audioOutputDeviceId);
      }
    });
    this.client.on('ended', () => {});
    this.client.on(this.client.ON_ERROR, e => {
      logger.error('WebRTC error', e);
      this.eventEmitter.emit(ON_CALL_ERROR, e);
    });
    this.client.on(this.client.REJECTED, session => {
      logger.info('WebRTC call rejected', { id: getSipSessionId(session) });

      const callSession = this._createCallSession(session);

      // `_createCallSession` add the CallSession in `this.callSessions`.
      // so we have to remove it or `callCount` will always return 1 even if the call was rejected
      delete this.callSessions[getSipSessionId(session)];

      callSession.endTime = new Date();

      this.eventEmitter.emit(ON_CALL_REJECTED, callSession);
    });
    this.client.on(this.client.UNREGISTERED, () => {
      logger.info('WebRTC unregistered');
      this.eventEmitter.emit(ON_UNREGISTERED);
    });
    this.client.on(this.client.ON_DISCONNECTED, () => {
      logger.info('WebRTC disconnected');
      this.eventEmitter.emit(ON_DISCONNECTED);
    });
    this.client.on(this.client.ON_PROGRESS, session => {
      logger.info('WebRTC progress (180)');

      const callSession = this._createCallSession(session, null, {
        incoming: false,
        ringing: true,
        callId: getSipSessionId(session),
      });

      this.eventEmitter.emit(ON_PROGRESS, callSession, this.audioOutputDeviceId, this.audioOutputVolume);
    });
    this.client.on(this.client.ON_EARLY_MEDIA, session => {
      logger.info('WebRTC early media');

      const callSession = this._createCallSession(session, null, {
        incoming: false,
        ringing: true,
        callId: getSipSessionId(session),
      });

      this.eventEmitter.emit(ON_EARLY_MEDIA, callSession, this.audioOutputDeviceId, this.audioOutputVolume);
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
      if (this.shouldSendReinvite && this.currentSipSession && this.currentSipSession.state === SessionState.Established) {
        this.shouldSendReinvite = false;
        const pc = (this.currentSipSession?.sessionDescriptionHandler as SessionDescriptionHandler)?.peerConnection as PeerConnection;
        const isConference = pc ? pc.sfu : false;
        const hasVideo = this.currentCallSession && this.currentCallSession.cameraEnabled;

        try {
          // Send reinvite with iceRestart
          this.sendReinvite(this.currentCallSession, null, isConference, !hasVideo, true);
        } catch (e: any) {
          logger.error('WebRTC reinvite after register, error', {
            message: e.message,
            stack: e.stack,
          });
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
      this._onMessage(message);

      this.eventEmitter.emit(ON_MESSAGE, message);
    });
    this.client.on(this.client.ON_NETWORK_STATS, (session, stats, previousStats) => {
      const callSession = this.getCallSession(getSipSessionId(session));
      this.eventEmitter.emit(ON_NETWORK_STATS, callSession, stats, previousStats);
    });
    // Used when upgrading directly in screenshare mode
    this.client.on(this.client.ON_SCREEN_SHARING_REINVITE, (sipSession: WazoSession, response: any, desktop: boolean) => {
      const sipSessionId = getSipSessionId(sipSession);
      const localStream = this.client.getLocalStream(sipSessionId);
      const callSession = this.callSessions[sipSessionId];
      logger.info('Updrading directly in screensharing mode', {
        sipSessionId,
        tracks: localStream?.getTracks() || null,
      });

      this._onScreenSharing(localStream as MediaStream, sipSession, callSession, false, desktop);
    });
  }

  // Find a corresponding sipSession from a CallSession
  findSipSession(callSession?: CallSession): WazoSession | null | undefined {
    const keys = this.client.getSipSessionIds();
    const keyIndex = keys.findIndex(sessionId => callSession && callSession.isId(sessionId));

    if (keyIndex === -1) {
      const currentSipSessionId = this.currentSipSession ? getSipSessionId(this.currentSipSession) : this.client.getSipSessionIds()[0];
      return currentSipSessionId ? this.client.getSipSession(currentSipSessionId) : null;
    }

    return this.client.getSipSession(keys[keyIndex]);
  }

  getCallSession(sipSessionId: string): CallSession | null | undefined {
    return this.callSessions[sipSessionId];
  }

  getSipSessionIdFromCallSession(callSession: CallSession): string | null {
    const sipSession = this.findSipSession(callSession);
    return sipSession ? getSipSessionId(sipSession) : null;
  }

  _updateCallSession(callSession: CallSession): void {
    const sipSessionId = this.getSipSessionIdFromCallSession(callSession);

    if (sipSessionId) {
      this.callSessions[sipSessionId] = callSession;
    }
  }

  _onMessage(message: Message & { method?: string, body?: string }): void {
    if (!message || message.method !== 'MESSAGE') {
      return;
    }

    let body;

    try {
      body = JSON.parse(message.body || '');
    } catch (e: any) {
      return;
    }

    const {
      type,
      content,
    } = body;

    switch (type) {
      case MESSAGE_TYPE_CHAT:
        this.eventEmitter.emit(ON_CHAT, content);
        break;

      case MESSAGE_TYPE_SIGNAL:
      {
        this.eventEmitter.emit(ON_SIGNAL, content);
        break;
      }

      default:
    }
  }

  _createIncomingCallSession(sipSession: WazoSession, cameraEnabled: boolean, fromSession?: CallSession | null | undefined, autoAnswer = false): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      incoming: true,
      ringing: true,
      cameraEnabled,
      autoAnswer,
    });
  }

  _createOutgoingCallSession(sipSession: WazoSession, cameraEnabled: boolean, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      incoming: false,
      ringing: true,
      cameraEnabled,
    });
  }

  _createAcceptedCallSession(sipSession: WazoSession, cameraEnabled?: boolean, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      cameraEnabled: cameraEnabled !== undefined ? cameraEnabled : false,
    });
  }

  _createMutedCallSession(sipSession: WazoSession, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: true,
    });
  }

  _createUnmutedCallSession(sipSession: WazoSession, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      muted: false,
    });
  }

  _createCameraResumedCallSession(sipSession: WazoSession, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      videoMuted: false,
    });
  }

  _createCameraDisabledCallSession(sipSession: WazoSession, fromSession?: CallSession): CallSession {
    return this._createCallSession(sipSession, fromSession, {
      videoMuted: true,
    });
  }

  _createCallSession(sipSession: WazoSession, fromSession?: CallSession | null | undefined, extra: Record<string, any> = {}): CallSession {
    const number = getCallNumber(sipSession);
    const displayName = getCallDisplayName(sipSession);
    const { state } = sipSession || {};
    const sessionId = getSipSessionId(sipSession);

    fromSession = fromSession || this.callSessions[sessionId];
    const callSession = new CallSession({
      callId: fromSession && fromSession.callId,
      sipCallId: sessionId,
      sipStatus: state,
      displayName,
      // @ts-ignore: date / number
      startTime: fromSession ? fromSession.startTime : new Date(),
      creationTime: fromSession ? fromSession.creationTime : null,
      answerTime: fromSession ? fromSession.answerTime : null,
      endTime: fromSession ? fromSession.endTime : null,
      answered: state === SessionState.Established,
      paused: this.client.isCallHeld(sipSession),
      isCaller: fromSession ? fromSession.isCaller : 'incoming' in extra ? !extra.incoming : false,
      cameraEnabled: fromSession ? fromSession.isCameraEnabled() : this.client.hasVideo(sessionId),
      number,
      ringing: false,
      muted: fromSession ? fromSession.isMuted() : this.client.isAudioMuted(sipSession),
      videoMuted: fromSession ? fromSession.isVideoMuted() : false,
      recording: fromSession ? fromSession.isRecording() : false,
      recordingPaused: false,
      sipSession,
      conference: !!fromSession && fromSession.isConference(),
      ...extra,
    });
    this.callSessions[sessionId] = callSession;

    return callSession;
  }

}
