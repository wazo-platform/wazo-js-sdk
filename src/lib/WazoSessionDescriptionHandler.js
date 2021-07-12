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
import { SessionDescriptionHandlerOptions }
  from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-options';
import IssueReporter from '../service/IssueReporter';
import {
  areCandidateValid,
  fixSdp,
  parseCandidate,
  disableLocalVideo,
  fixBundle,
  fixInactiveVideo,
} from '../utils/sdp';

const wazoLogger = IssueReporter ? IssueReporter.loggerFor('webrtc-sdh') : console;
const MAX_WAIT_FOR_ICE_TRIES = 20;
const WAIT_FOR_ICE_TIMEOUT = 500;

class WazoSessionDescriptionHandler extends SessionDescriptionHandler {
  gatheredCandidates: Array<?string>;

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
    this.logger.debug('SessionDescriptionHandler.getDescription');
    if (this._peerConnection === undefined) {
      return Promise.reject(new Error('Peer connection closed.'));
    }
    // Callback on data channel creation
    this.onDataChannel = options.onDataChannel;

    // ICE will restart upon applying an offer created with the iceRestart option
    const iceRestart = options.offerOptions ? options.offerOptions.iceRestart : false;

    const isConference = options ? !!options.conference : false;

    // We should wait for ice when iceRestart (reinvite) or for the first invite
    // We shouldn't wait for ice when holding or resuming the call
    const shouldWaitForIce = iceRestart || ('constraints' in options);

    // ICE gathering timeout may be set on a per call basis, otherwise the configured default is used
    const iceTimeout = options.iceGatheringTimeout === undefined
      ? this.sessionDescriptionHandlerConfiguration.iceGatheringTimeout
      : options.iceGatheringTimeout;

    const isOffer = this._peerConnection.signalingState === 'stable';

    wazoLogger.trace('getting SDP description', { iceRestart, shouldWaitForIce, iceTimeout });

    // Fetch ice ourselves for re-invite
    this.gatheredCandidates = [];
    if (!this.peerConnectionDelegate) {
      this.peerConnectionDelegate = {};
    }
    this.peerConnectionDelegate.onicecandidate = event => {
      wazoLogger.trace('onicecandidate', event.candidate ? event.candidate.candidate : { done: true });
      if (event.candidate) {
        this.gatheredCandidates.push(parseCandidate(event.candidate.candidate));
      }
    };

    return this.getLocalMediaStream(options)
      .then(() => this.updateDirection(options, isConference))
      .then(() => this.createDataChannel(options))
      .then(() => this.createLocalOfferOrAnswer(options))
      .then((sessionDescription) => this.setLocalSessionDescription(sessionDescription))
      .then(() => this.waitForIceGatheringComplete(iceRestart, iceTimeout))
      .then(shouldWaitForIce ? this._waitForValidGatheredIce.bind(this) : this.getLocalSessionDescription.bind(this))
      .then((description: any) => {
        if (!this._peerConnection) {
          throw new Error('No peer connection to get sdh local description');
        }

        // Try to update sdp with a createOffer
        return isOffer ? this._peerConnection.createOffer(options.offerOptions || {}) : description;
      })
      .then(description => {
        const { sdp } = description;
        // Check if we got ICEs
        if (sdp.indexOf('a=candidate') !== -1) {
          return description;
        }

        wazoLogger.info('No ICE candidates found in SDP, fixing it with gathered ices', this.gatheredCandidates);

        // @TODO: find a better way to set sdp in answer.
        //  We can't call createAnswer again, so we have to put candidates manually with fixSdp
        // In reinvite, createOffer doesn't update the SDP
        return {
          type: description.type,
          // Fix sdp only when no candidates
          sdp: fixSdp(sdp, this.gatheredCandidates),
        };
      })
      .then(description => {
        const { sdp } = description;

        if (iceRestart) {
          // When downgrading to audio with a `constraints.video = false` the sdp still contains m=video with a port > 10.
          if (!options.constraints.video && sdp.match(/m=video/)) {
            return {
              type: description.type,
              sdp: disableLocalVideo(sdp),
            };
          }

          // When upgrading again to video, we've got 2 section m but a bundle containing only `0`
          return {
            type: description.type,
            sdp: fixInactiveVideo(fixBundle(sdp)),
          };
        }

        return description;
      })
      .then((sessionDescription) => this.applyModifiers(sessionDescription, modifiers))
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

  async _waitForValidGatheredIce(): Object {
    let tries = 0;

    while (!areCandidateValid(this.gatheredCandidates) && tries < MAX_WAIT_FOR_ICE_TRIES) {
      wazoLogger.trace('SessionDescriptionHandler._waitForValidGatheredIce, waiting for ice', {
        tries,
        max: MAX_WAIT_FOR_ICE_TRIES,
      });

      tries++;

      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, WAIT_FOR_ICE_TIMEOUT));
    }

    if (tries >= MAX_WAIT_FOR_ICE_TRIES) {
      const errorMsg = 'No valid candidates found, can\'t answer the call';
      const error = new Error(errorMsg);
      wazoLogger.error(errorMsg, { tries, max: MAX_WAIT_FOR_ICE_TRIES });

      // Emit an error, because sip.js catches the exception and switch to status Terminated.
      this.eventEmitter.emit('error', error);

      wazoLogger.error('No valid candidates found', { tries, candidates: JSON.stringify(this.gatheredCandidates) });
    }

    // eslint-disable-next-line
    wazoLogger.trace('Found valid candidates', { tries, candidates: JSON.stringify(this.gatheredCandidates) });

    return this.getLocalSessionDescription();
  }

  // Overridden to send `inactive` in conference
  updateDirection(options?: SessionDescriptionHandlerOptions, isConference: boolean = false): Promise<void> {
    if (this._peerConnection === undefined) {
      return Promise.reject(new Error('Peer connection closed.'));
    }

    // Waiting for `getTransceivers` API on mobile
    if (!this.isWeb) {
      return Promise.resolve();
    }

    switch (this._peerConnection.signalingState) {
      case 'stable': {
        // if we are stable, assume we are creating a local offer
        this.logger.debug('SessionDescriptionHandler.updateDirection - setting offer direction');
        // determine the direction to offer given the current direction and hold state
        const directionToOffer = (currentDirection: Object): Object => {
          if (isConference) {
            return options && options.hold ? 'inactive' : 'sendrecv';
          }

          switch (currentDirection) {
            case 'inactive':
              return options && options.hold ? 'inactive' : 'recvonly';
            case 'recvonly':
              return options && options.hold ? 'inactive' : 'recvonly';
            case 'sendonly':
              return options && options.hold ? 'sendonly' : 'sendrecv';
            case 'sendrecv':
              return options && options.hold ? 'sendonly' : 'sendrecv';
            case 'stopped':
              return 'stopped';
            default:
              throw new Error('Should never happen');
          }
        };
        // set the transceiver direction to the offer direction
        this._peerConnection.getTransceivers().forEach((transceiver) => {
          if (transceiver.direction /* guarding, but should always be true */) {
            const offerDirection = directionToOffer(transceiver.direction);
            if (transceiver.direction !== offerDirection) {
              // eslint-disable-next-line no-param-reassign
              transceiver.direction = offerDirection;
            }
          }
        });
      }
        break;
      case 'have-remote-offer': {
        // if we have a remote offer, assume we are creating a local answer
        this.logger.debug('SessionDescriptionHandler.updateDirection - setting answer direction');

        // FIXME: This is not the correct way to determine the answer direction as it is only
        // considering first match in the offered SDP and using that to determine the answer direction.
        // While that may be fine for our current use cases, it is not a generally correct approach.
        // determine the offered direction
        const offeredDirection = ((): 'inactive' | 'recvonly' | 'sendonly' | 'sendrecv' => {
          const description = this._peerConnection.remoteDescription;
          if (!description) {
            throw new Error('Failed to read remote offer');
          }
          const searchResult = /a=sendrecv\r\n|a=sendonly\r\n|a=recvonly\r\n|a=inactive\r\n/.exec(description.sdp);
          if (searchResult) {
            switch (searchResult[0]) {
              case 'a=inactive\r\n':
                return 'inactive';
              case 'a=recvonly\r\n':
                return 'recvonly';
              case 'a=sendonly\r\n':
                return 'sendonly';
              case 'a=sendrecv\r\n':
                return 'sendrecv';
              default:
                throw new Error('Should never happen');
            }
          }
          return 'sendrecv';
        })();

        // determine the answer direction based on the offered direction and our hold state
        const answerDirection = ((): 'inactive' | 'recvonly' | 'sendonly' | 'sendrecv' => {
          switch (offeredDirection) {
            case 'inactive':
              return 'inactive';
            case 'recvonly':
              return 'sendonly';
            case 'sendonly':
              return options && options.hold ? 'inactive' : 'recvonly';
            case 'sendrecv':
              return options && options.hold ? 'sendonly' : 'sendrecv';
            default:
              throw new Error('Should never happen');
          }
        })();

        // set the transceiver direction to the answer direction
        this._peerConnection.getTransceivers().forEach((transceiver) => {
          if (transceiver.direction /* guarding, but should always be true */) {
            if (transceiver.direction !== 'stopped' && transceiver.direction !== answerDirection) {
              // eslint-disable-next-line no-param-reassign
              transceiver.direction = answerDirection;
            }
          }
        });
      }
        break;
      case 'have-local-offer':
      case 'have-local-pranswer':
      case 'have-remote-pranswer':
      case 'closed':
      default:
        return Promise.reject(new Error(`Invalid signaling state ${this._peerConnection.signalingState}`));
    }
    return Promise.resolve();
  }
}

export default WazoSessionDescriptionHandler;
