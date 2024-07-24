/* eslint-disable no-underscore-dangle */
import { EventEmitter } from 'events';
import { createActor } from 'xstate';
import { Invitation } from 'sip.js/lib/api/invitation';
import { SessionState } from 'sip.js/lib/api/session-state';
import { OutgoingInviteRequest } from 'sip.js/lib/core';
import { SessionDescriptionHandler } from 'sip.js/lib/platform/web';
import { SessionDescriptionHandlerOptions } from 'sip.js/lib/api';
import type { IncomingRequestMessage } from 'sip.js/lib/core/messages/incoming-request-message';

import callStateMachine, { type ActionTypes, Actions, type EstablishedActionTypes, EstablishedActions, States, EstablishedStates, type CallActorRef } from '../state-machine/call-state-machine';
import { SipCall, PeerConnection } from '../domain/types';
import IssueReporter from '../service/IssueReporter';
import { Softphone } from './softphone';
import { getSipSessionId } from '../utils/sdp';
import { assertCan, getState } from '../state-machine/utils';
import { downgradeToAudio, getLocalStream, getLocalVideoStream, getPeerConnection, getRemoteStream, getRemoteVideoStream, getStreamFromConstraints, getWebRtcStats, hasALocalVideoTrack, hasLocalVideo, hasRemoteVideo, isVideoRemotelyHeld, setLocalMediaStream, toggleVideo, upgradeToVideo } from '../utils/webrtc';

const logger = IssueReporter.loggerFor('call');

export type AcceptOptions = {
  withCamera?: boolean,
};

export type ReinviteOptions = {
  constraints?: Record<string, any>;
  conference?: boolean;
  audioOnly?: boolean;
  iceRestart?: boolean;
};

// Events
export const EVENT_CALL_ACCEPTED = 'accepted';
export const EVENT_CALL_CANCELED = 'canceled';
export const EVENT_PROGRESS = 'progress';
export const EVENT_EARLY_MEDIA = 'earlyMedia';
export const EVENT_CALL_ERROR = 'error';
export const EVENT_CALL_REJECTED = 'rejected';
export const EVENT_CALL_TERMINATING = 'terminating';
export const EVENT_CALL_ENDED = 'ended';
export const EVENT_CALL_MUTED = 'muted';
export const EVENT_CALL_UN_MUTED = 'unMuted';
export const EVENT_CALL_HELD = 'held';
export const EVENT_CALL_RESUMED = 'resumed';
export const EVENT_REINVITE = 'reinvite';
export const EVENT_TRACK = 'track';
export const EVENT_AUDIO_STREAM = 'onAudioStream';
export const EVENT_VIDEO_STREAM = 'onVideoStream';
export const EVENT_REMOVE_STREAM = 'onRemoveStream';
export const EVENT_SHARE_SCREEN_ENDING = 'onScreenShareEnding';
export const EVENT_SHARE_SCREEN_STARTED = 'onScreenShareStarted';
export const EVENT_SHARE_SCREEN_ENDED = 'onScreenShareEnded';
export const EVENT_WEB_RTC_STATS = 'webRtcStats';
export const EVENT_CAMERA_RESUMED = 'onCameraResumed';
export const EVENT_CAMERA_DISABLED = 'onCameraDisabled';
export const EVENT_TERMINATE_SOUND = 'terminateSound';

export const MESSAGE_TYPE_CHAT = 'message/TYPE_CHAT';
export const MESSAGE_TYPE_SIGNAL = 'message/TYPE_SIGNAL';
export const MESSAGE_TRACK_UPDATED = 'onTrackUpdated';

class Call extends EventEmitter {
  eventEmitter: EventEmitter;

  callActor: CallActorRef;

  // Wazo call id, used in Wazo Websocket and API
  apiId?: string;

  sipCall: SipCall;

  talkingToIds: string[];

  creationTime: Date;

  answerTime: Date;

  endTime: Date;

  phone: Softphone;

  shouldSendReinvite = false;

  currentScreenShare: Record<string, any> | null;

  constructor(sipCall: SipCall, phone: Softphone) {
    super();

    this.callActor = createActor(callStateMachine);
    this.callActor.start();

    this.creationTime = new Date();

    this.phone = phone;
    this.sipCall = sipCall;

    this._bindEvents();
  }

  async accept(options: AcceptOptions = {}): Promise<string | null> {
    assertCan(this.callActor, Actions.ACCEPT);
    logger.info('WebRTC phone - accept call', { id: this.id, ...options });

    this._sendAction(Actions.ACCEPT);

    this.phone.holdAllCalls(this);

    this.shouldSendReinvite = false;
    this.answerTime = new Date();

    logger.info('accept call, session found', { sipId: this.id });

    return this.phone.client.answer(this.sipCall as Invitation, options.withCamera).then(() => {
      return this.id;
    }).catch(e => {
      logger.error(e);
      this.hangup();
      throw e;
    });
  }

  async reject(): Promise<boolean> {
    logger.info('call rejected', { id: this.id });
    this.eventEmitter.emit(EVENT_TERMINATE_SOUND, 'call rejected locally');

    this.shouldSendReinvite = false;

    return this.hangup();
  }

  async hangup(): Promise<boolean> {
    logger.info('call hangup', { id: this.id });
    await this.phone.client.hangup(this.sipCall);

    // Remove this call from softphone's calls
    this.phone.removeCall(this);

    return true;
  }

  forceCancel(): void {
    try {
      // @ts-ignore: private
      this.sipCall.outgoingInviteRequest.cancel();
    } catch (e) {
      logger.info('force cancel, error', e);
    }
  }

  startConference(withCalls: Call[]) {
    // @TODO
    // const participants = [this, ...withCalls].reduce((acc: Record<string, any>, call: Call) => {
    //   acc[call.talkingToIds[0]] = call;
    //   return acc;
    // }, {});

    // const adHocConference = new AdHocAPIConference({
    //   phone: this.phone,
    //   host,
    //   participants,
    // });
    // return adHocConference.start();
  }

  mute() {
    assertCan(this.callActor, EstablishedActions.MUTE);
    this._sendAction(EstablishedActions.MUTE);

    logger.info('mute call', { id: this.id });

    this.phone.client.mute(this.sipCall);

    this.eventEmitter.emit(EVENT_CALL_MUTED);
  }

  unMute() {
    assertCan(this.callActor, EstablishedActions.UN_MUTE);
    this._sendAction(EstablishedActions.UN_MUTE);

    logger.info('un-mute call', { id: this.id });

    this.phone.client.unmute(this.sipCall);

    this.eventEmitter.emit(EVENT_CALL_UN_MUTED);
  }

  async hold() {
    assertCan(this.callActor, EstablishedActions.HOLD);
    this._sendAction(EstablishedActions.HOLD);

    logger.info('hold call', { id: this.id });

    const hasVideo = hasLocalVideo(this.sipCall);

    // Stop screenshare if needed
    if (this.currentScreenShare && this.currentScreenShare.sipSessionId === this.id) {
      await this.stopScreenSharing(false);
    }

    // Downgrade to audio if needed
    if (hasVideo) {
      await downgradeToAudio(this.sipCall);
    }

    const promise = this.phone.client.hold(this.sipCall, this.isConference(), hasVideo);

    this.eventEmitter.emit(EVENT_CALL_HELD);

    return promise;
  }

  async resume() {
    assertCan(this.callActor, EstablishedActions.RESUME);
    this._sendAction(EstablishedActions.RESUME);

    const isConference = this.isConference();
    const hasVideo = hasLocalVideo(this.sipCall);
    const wasScreensharing = this.currentScreenShare && this.currentScreenShare.sipSessionId === this.id;
    const wasDesktop = this.currentScreenShare && this.currentScreenShare.desktop;

    logger.info('resume call', { id: this.id, isConference, hasVideo, wasScreensharing, wasDesktop });

    const promise = this.phone.client.unhold(this.sipCall, isConference);

    if (hasVideo) {
      const constraints = {
        audio: false,
        video: true,
        screen: wasScreensharing,
        desktop: wasDesktop,
      };
      await upgradeToVideo(this.sipCall, constraints, isConference);
    }

    const onScreenSharing = (stream: MediaStream | null | undefined) => {
      const hadVideo = this.currentScreenShare && this.currentScreenShare.hadVideo;

      if (stream) {
        this._onScreenSharing(stream, hadVideo, wasDesktop);
      }
    };

    this.eventEmitter.emit(EVENT_CALL_RESUMED);

    return promise.then(() => {
      const stream = this.getLocalVideoStream();
      if (wasScreensharing) {
        onScreenSharing(this.getLocalVideoStream());
      }

      return stream;
    });
  }

  turnCameraOn(): void {
    logger.info('turn camera on', { id: this.id });
    toggleVideo(this.sipCall, true);

    this.eventEmitter.emit(EVENT_CAMERA_RESUMED);
  }

  turnCameraOff(): void {
    logger.info('WebRTC turn camera off', { id: this.id });
    toggleVideo(this.sipCall, false);

    this.eventEmitter.emit(EVENT_CAMERA_DISABLED);
  }

  isHeld() {
    return getState(this.callActor) === EstablishedStates.HELD;
  }

  isEstablished() {
    return getState(this.callActor) === States.ESTABLISHED;
  }

  isConference(): boolean {
    return (getPeerConnection(this.sipCall) as PeerConnection)?.sfu;
  }

  transfer(target: string): void {
    logger.info('call - transfer', { id: this.id, target });

    this.phone.client.transfer(this.sipCall, target);
  }

  atxfer(): Record<string, any> | null | undefined {
    logger.info('atxfer', { id: this.id });

    return this.phone.client.atxfer(this.sipCall);
  }

  sendDigits(digits: string) {
    logger.info('WebRTC send digits', { id: this.id, digits });

    this.phone.client.sendDTMF(this.sipCall, digits);
  }

  startNetworkMonitoring(interval = 1000) {
    return this.phone.client.startNetworkMonitoring(this.sipCall, interval);
  }

  stopNetworkMonitoring() {
    return this.phone.client.stopNetworkMonitoring(this.sipCall);
  }

  async getStats(): Promise<RTCStatsReport | null | undefined> {
    return getWebRtcStats(this.sipCall);
  }

  async sendReinvite(options: ReinviteOptions = {}): Promise<OutgoingInviteRequest | void> {
    logger.info('send reinvite', { id: this.id, ...options });

    const shouldScreenShare = options.constraints?.screen;
    const isUpgrade = shouldScreenShare || options.constraints?.video;

    // Downgrade
    if (options.constraints && !isUpgrade) {
      // No reinvite needed
      this._downgradeToAudio();

      return;
    }

    if (isUpgrade) {
      const shouldReinvite = await this._upgradeToVideo(options);

      if (!shouldReinvite) {
        return;
      }
    }

    return this.phone.client.reinvite(this.sipCall, options.constraints, options.conference, options.audioOnly, options.iceRestart);
  }

  sendMessage(body: string, contentType = 'text/plain'): void {
    return this.phone.client.sendMessage(this.sipCall, body, contentType);
  }

  sendChat(content: string): void {
    this.sendMessage(JSON.stringify({ type: MESSAGE_TYPE_CHAT, content }), 'application/json');
  }

  sendSignal(content: any): void {
    this.sendMessage(JSON.stringify({ type: MESSAGE_TYPE_SIGNAL, content }), 'application/json');
  }

  async startScreenSharing(constraints: Record<string, any>): Promise<MediaStream> {
    logger.info('Call - start screen sharing', { constraints, id: this.id });
    const screenShareStream = await getStreamFromConstraints(constraints);

    if (!screenShareStream) {
      throw new Error(`Can't create media stream for screensharing with: ${JSON.stringify(constraints)}`);
    }

    const screenTrack = screenShareStream.getVideoTracks()[0];
    const pc = getPeerConnection(this.sipCall);
    const sender = pc && pc.getSenders && pc.getSenders().find((s) => s && s.track && s.track.kind === 'video');
    const localStream = getLocalStream(this.sipCall);
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

    this._onScreenSharing(screenShareStream, hadVideo, constraints.desktop);

    return screenShareStream;
  }

  async stopScreenSharing(restoreLocalStream = true): Promise<OutgoingInviteRequest | void | null> {
    if (!this.currentScreenShare) {
      return;
    }

    logger.info('call - stop screen sharing', { restoreLocalStream });
    let reinvited: OutgoingInviteRequest | null | void = null;

    try {
      if (this.currentScreenShare.stream) {
        this.currentScreenShare.stream.getTracks()
          .filter((track: MediaStreamTrack) => track.enabled && track.kind === 'video')
          .forEach((track: MediaStreamTrack) => track.stop());
      }

      if (restoreLocalStream) {
        const conference = this.isConference();

        // When stopping screenshare and we had video before that, we have to re-upgrade
        // When upgrading directly to screenshare (eg: we don't have a videoLocalStream to replace)
        // We have to downgrade to audio.
        const screenshareStopped = this.currentScreenShare.hadVideo;
        const constraints = {
          audio: false,
          video: screenshareStopped,
        };

        // We have to remove the video sender to be able to re-upgrade to video in `sendReinvite` below
        this._downgradeToAudio(false);

        // Wait for the track to be removed, unless the video sender won't have a null track in `_upgradeToVideo`.
        await new Promise(resolve => setTimeout(resolve, 500));
        reinvited = await this.sendReinvite({ constraints, conference });
      }
    } catch (e: any) {
      console.warn(e);
    }

    this.eventEmitter.emit(EVENT_SHARE_SCREEN_ENDED);
    this.currentScreenShare = null;

    return reinvited;
  }

  onScreenShareReinvite(response: any, desktop: boolean) {
    const localStream = getLocalStream(this.sipCall);
    logger.info('Updrading directly in screensharing mode', { id: this.id, tracks: localStream?.getTracks() });

    this._onScreenSharing(localStream as MediaStream, false, desktop);
  }

  onAccepted() {
    this.emit(EVENT_CALL_ACCEPTED);
  }

  onProgress() {
    this.emit(EVENT_PROGRESS);
  }

  onEarlyMedia() {
    this.emit(EVENT_EARLY_MEDIA);
  }

  onTrack(event: RTCTrackEvent | MediaStreamTrackEvent) {
    this.emit(EVENT_TRACK, event);
  }

  onError(error: Error) {
    this.emit(EVENT_CALL_ERROR, error);
  }

  onRejected() {
    this.endTime = new Date();

    this.emit(EVENT_CALL_REJECTED);

    this.phone.removeCall(this);
  }

  onNetworkStats(stats: Record<string, any>, previousStats: Record<string, any>) {
    this.emit(EVENT_WEB_RTC_STATS, stats, previousStats);
  }

  getRemoteStream() {
    return getRemoteStream(this.sipCall);
  }

  getRemoteVideoStream() {
    return getRemoteVideoStream(this.sipCall);
  }

  hasRemoteVideo() {
    return hasRemoteVideo(this.sipCall);
  }

  hasLocalVideo() {
    return hasLocalVideo(this.sipCall);
  }

  getLocalStream() {
    return getLocalStream(this.sipCall);
  }

  getLocalVideoStream() {
    return getLocalVideoStream(this.sipCall);
  }

  hasALocalVideoTrack() {
    return hasALocalVideoTrack(this.sipCall);
  }

  isVideoRemotelyHeld() {
    return isVideoRemotelyHeld(this.sipCall);
  }

  onReinvite(request: IncomingRequestMessage, updatedCalleeName: string, updatedNumber: string, hadRemoteVideo: boolean) {
    this.emit(EVENT_REINVITE, request, updatedCalleeName, updatedNumber, hadRemoteVideo);
  }

  get id() {
    return getSipSessionId(this.sipCall);
  }

  get number() {
    const identity = this.sipCall.remoteIdentity || this.sipCall.assertedIdentity;
    // @ts-ignore: private
    return identity ? identity.uri._normal.user : null;
  }

  _bindEvents() {
    if (this.sipCall instanceof Invitation) {
      // Monkey patch to know when canceled with the CANCEL message
      const onCancel = (this.sipCall as Invitation)._onCancel.bind(this.sipCall);

      this.sipCall._onCancel = (message: IncomingRequestMessage) => {
        logger.trace('call - on sip session canceled', { callId: message.callId, id: this.id });
        onCancel(message);
        const elsewhere = message.data.indexOf('cause=26') !== -1 && message.data.indexOf('completed elsewhere') !== -1;

        this.eventEmitter.emit(EVENT_CALL_CANCELED, elsewhere);
      };
    }

    this.sipCall.stateChange.addListener((newState: SessionState) => {
      switch (newState) {
        case SessionState.Terminating:
          logger.info('call terminating', { id: this.id });
          this.eventEmitter.emit(EVENT_CALL_TERMINATING);
          break;

        case SessionState.Terminated:
        {
          logger.info('call terminated', { id: this.id });

          // Should be called before `_onCallTerminated` or the callCount will not decrement...
          this.endTime = new Date();

          return this.eventEmitter.emit(EVENT_CALL_ENDED);
        }

        default:
          break;
      }
    });

    if (!this.sipCall.sessionDescriptionHandler) {
      return;
    }

    // Video events
    const sdh = this.sipCall.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sdh.peerConnection as PeerConnection;

    if (!peerConnection) {
      logger.warn('no peer connection', { id: this.id });
      return;
    }

    peerConnection.ontrack = (rawEvent: RTCTrackEvent) => {
      const event = rawEvent;
      const [stream] = event.streams;
      const kind = event && event.track && event.track.kind;
      logger.info('on track stream called on the peer connection', {
        id: this.id,
        streamId: stream ? stream.id : null,
        tracks: stream ? stream.getTracks() : null,
        kind,
      });

      if (kind === 'audio') {
        return this.eventEmitter.emit(EVENT_AUDIO_STREAM, stream);
      }

      return this.eventEmitter.emit(EVENT_VIDEO_STREAM, stream, event.track.id, event);
    };

    peerConnection.onremovestream = (event: any) => {
      logger.info('on remove stream called on the peer connection', {
        id: event.stream.id,
        tracks: event.stream.getTracks(),
      });
      this.eventEmitter.emit(EVENT_REMOVE_STREAM, event.stream);
    };

    // Client events
  }

  _downgradeToAudio(withMessage = true) {
    logger.info('Downgrade to audio', { id: this.id, withMessage });

    downgradeToAudio(this.sipCall);

    if (withMessage) {
      this._sendReinviteMessage(false);
    }

    return true;
  }

  // Returns true if we need to send a re-INVITE request
  async _upgradeToVideo(options: ReinviteOptions = {}): Promise<boolean> {
    logger.info('Upgrade to video', { id: this.id, ...options });

    const shouldScreenShare = options.constraints?.screen;
    const desktop = options.constraints?.desktop;
    const sdhOptions = this.sipCall.sessionDescriptionHandlerOptionsReInvite;
    const wasAudioOnly = (sdhOptions as SessionDescriptionHandlerOptions & { audioOnly: boolean })?.audioOnly;
    const newStream = await upgradeToVideo(this.sipCall, options.constraints || {}, !!options.conference);

    // If no stream is returned, it means we have to reinvite
    if (!newStream) {
      return true;
    }

    this._sendReinviteMessage(true);

    if (shouldScreenShare) {
      this._onScreenSharing(newStream, false, desktop);
    }

    // We have to reinvite to change the direction on the bundle when upgrading from an audioOnly conference
    if (options.conference && wasAudioOnly) {
      return true;
    }

    // No reinvite needed here
    return false;
  }

  _sendReinviteMessage(isUpgrade: boolean) {
    logger.info('Sending reinvite message', { id: this.id, isUpgrade });

    // Have to send the message after a delay due to latency to update the remote peer
    setTimeout(() => {
      this.sendMessage(JSON.stringify({
        type: MESSAGE_TYPE_SIGNAL,
        content: {
          type: MESSAGE_TRACK_UPDATED,
          update: isUpgrade ? 'upgrade' : 'downgrade',
          sipCallId: this.id,
          callId: this.apiId,
          number: this.number,
        },
      }));
    }, 2500);
  }

  _onScreenSharing(screenStream: MediaStream, hadVideo: boolean, desktop?: boolean | null | undefined) {
    const screenTrack = screenStream.getVideoTracks()[0];
    const pc = this.phone.client.getPeerConnection(this.id);
    const sender = pc && pc.getSenders && pc.getSenders().find((s) => s && s.track && s.track.kind === 'video');

    logger.info('WebRTC phone - on screensharing', { hadVideo, id: this.id, screenTrack });

    if (screenTrack) {
      screenTrack.onended = () => {
        logger.info('WebRTC phone - on screenshare ended', { hadVideo, id: this.id, screenTrack });

        this.eventEmitter.emit(EVENT_SHARE_SCREEN_ENDING);
      };
    }

    this.currentScreenShare = {
      stream: screenStream,
      hadVideo,
      sender,
      desktop,
    };

    setLocalMediaStream(this.sipCall, screenStream);
    this.eventEmitter.emit(EVENT_SHARE_SCREEN_STARTED, screenStream);
  }

  _sendAction(action: ActionTypes | EstablishedActionTypes) {
    this.callActor.send({ type: action });
  }
}

export default Call;
