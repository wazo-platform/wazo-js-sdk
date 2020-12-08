/* global RTCSessionDescriptionInit */
// @flow
import EventEmitter from 'events';

import type { Session } from 'sip.js/lib/core/session';
import type { Logger } from 'sip.js/lib/core/log/logger';
import type { MediaStreamFactory } from 'sip.js/lib/platform/web/session-description-handler/media-stream-factory';
import type SessionDescriptionHandlerConfiguration
  from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration';
import { SessionDescriptionHandler }
  from 'sip.js/lib/platform/web/session-description-handler/session-description-handler';
import IssueReporter from '../service/IssueReporter';

const wazoLogger = IssueReporter.loggerFor('webrtc-sdh');

class WazoSessionDescriptionHandler extends SessionDescriptionHandler {
  constructor(
    logger: Logger,
    mediaStreamFactory: MediaStreamFactory,
    sessionDescriptionHandlerConfiguration?: SessionDescriptionHandlerConfiguration,
    isWeb: boolean,
    session: Session,
  ) {
    super(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration);

    this.eventEmitter = new EventEmitter();
    this.isWeb = isWeb;
    this.session = session;
  }

  on(event: string, callback: Function) {
    this.eventEmitter.on(event, callback);
  }

  off(event: string, callback: Function) {
    this.eventEmitter.removeListener(event, callback);
  }

  // $FlowFixMe
  setRemoteSessionDescription(sessionDescription: RTCSessionDescriptionInit): Promise<void> {
    const result = super.setRemoteSessionDescription(sessionDescription);

    this.eventEmitter.emit('setDescription', sessionDescription);

    return result;
  }

  // Overridden to avoid to fix ice-candidates missing in the SDP in react-native and chrome canary.
  getDescription(options?: Object = {}, modifiers?: Array<Function>): Promise<any> {
    const isReinvite = !('disableVideo' in options);
    if (isReinvite) {
      // Calling createOffer twice in a reinvite create `undefined` sdp in modifiers
      return super.getDescription(options, modifiers);
    }
    this.logger.debug('SessionDescriptionHandler.getDescription');
    if (this._peerConnection === undefined) {
      return Promise.reject(new Error('Peer connection closed.'));
    }
    // Callback on data channel creation
    this.onDataChannel = options.onDataChannel;

    // ICE will restart upon applying an offer created with the iceRestart option
    const iceRestart = options.offerOptions ? options.offerOptions.iceRestart : false;

    // ICE gathering timeout may be set on a per call basis, otherwise the configured default is used
    const iceTimeout = options.iceGatheringTimeout === undefined
      ? this.sessionDescriptionHandlerConfiguration.iceGatheringTimeout
      : options.iceGatheringTimeout;

    const isOffer = this._peerConnection.signalingState === 'stable';

    // Fetch ice ourselves for re-invite
    const gatheredIces = [];
    if (!this.peerConnectionDelegate) {
      this.peerConnectionDelegate = {};
    }
    this.peerConnectionDelegate.onicecandidate = event => {
      wazoLogger.info('onicecandidate', event.candidate ? event.candidate.candidate : { done: true });
      if (event.candidate) {
        gatheredIces.push(event.candidate.candidate);
      }
    };

    return this.getLocalMediaStream(options)
      .then(() => this.createDataChannel(options))
      .then(() => this.createLocalOfferOrAnswer(options))
      .then((sessionDescription) => this.applyModifiers(sessionDescription, modifiers))
      .then((sessionDescription) => this.setLocalSessionDescription(sessionDescription))
      .then(() => this.waitForIceGatheringComplete(iceRestart, iceTimeout))
      .then((description: any) =>
        (isOffer && this._peerConnection ? this._peerConnection.createOffer(options.offerOptions || {}) : description))
      .then((sessionDescription) => this.applyModifiers(sessionDescription, modifiers))
      .then((sessionDescription: any) =>
        (isOffer ? this.setLocalSessionDescription(sessionDescription) : sessionDescription))
      .then(() => this.getLocalSessionDescription())
      .then((localDescription) => {
        // Avoid immutable errors
        const newDescription = JSON.parse(JSON.stringify(localDescription));
        // Add ice candidates if not present
        if (newDescription && newDescription.sdp.indexOf('a=candidate') === -1) {
          gatheredIces.forEach(ice => {
            // eslint-disable-next-line
            newDescription.sdp += `a=${ice}${"\n"}`;
          });
        }
        return newDescription;
      })
      .then((sessionDescription) => ({ body: sessionDescription.sdp, contentType: 'application/sdp' }))
      .catch((error) => {
        wazoLogger.error('error when creating media', error);
        this.logger.error(`SessionDescriptionHandler.getDescription failed - ${error}`);
        throw error;
      });
  }

  // Overridden to avoid to use peerConnection.getReceivers and peerConnection.getSenders in react-native
  setLocalMediaStream(stream: MediaStream): Promise<void> {
    if (this.isWeb) {
      return super.setLocalMediaStream(stream);
    }
    this.logger.debug('SessionDescriptionHandler.setLocalMediaStream');

    if (!this._peerConnection) {
      throw new Error('Peer connection undefined.');
    }
    const pc = this._peerConnection;
    const localStream = this._localMediaStream;
    const trackUpdates: Array<Promise<void>> = [];

    const updateTrack = (newTrack: MediaStreamTrack): void => {
      const { kind } = newTrack;
      if (kind !== 'audio' && kind !== 'video') {
        throw new Error(`Unknown new track kind ${kind}.`);
      }

      trackUpdates.push(
        new Promise((resolve) => {
          this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - adding sender ${kind} track`);
          resolve();
        }).then(() => {
          // Review: could make streamless tracks a configurable option?
          // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack#Usage_notes
          try {
            pc.addStream(localStream);
          } catch (error) {
            wazoLogger.error('set local stream error', error);

            this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to add sender ${kind} track`);
            throw error;
          }
          localStream.addTrack(newTrack);
          SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
        }),
      );
    };

    // update peer connection audio tracks
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length) {
      updateTrack(audioTracks[0]);
    }

    // update peer connection video tracks
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length) {
      updateTrack(videoTracks[0]);
    }

    return trackUpdates.reduce((p, x) => p.then(() => x), Promise.resolve());
  }

  // Overridden to avoid to use peerConnection.getReceivers and peerConnection.getSenders in react-native
  sendDtmf(tones: string, options: { duration: number; interToneGap: number } = {}): boolean {
    if (this.isWeb) {
      return super.sendDtmf(tones, options);
    }

    this.logger.debug(`DTMF sent via INFO: ${tones.toString()}`);

    const body = {
      contentDisposition: 'render',
      contentType: 'application/dtmf-relay',
      content: `Signal=${tones}\r\nDuration=${options.duration || 1000}`,
    };
    const requestOptions = { body };

    return this.session.info({ requestOptions });
  }

  // Overridden to avoid to use peerConnection.getReceivers and peerConnection.getSenders in react-native
  close(): void {
    wazoLogger.info('closing sdh');

    if (this.isWeb) {
      return super.close();
    }

    // react-native
    this.logger.debug('SessionDescriptionHandler.close');
    if (this._peerConnection === undefined) {
      return;
    }

    // Closing senders via getLocalStreams
    this.peerConnection.getLocalStreams().forEach(stream => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });

    // Closing receivers via getRemoteStreams
    this.peerConnection.getRemoteStreams().forEach(stream => {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    });

    if (this._dataChannel) {
      this._dataChannel.close();
    }
    this._peerConnection.close();
    this._peerConnection = undefined;
  }
}

export default WazoSessionDescriptionHandler;
