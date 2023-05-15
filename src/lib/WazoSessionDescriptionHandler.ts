/* global RTCSessionDescriptionInit, navigator */
import EventEmitter from 'events';
import type { Logger } from 'sip.js/lib/core/log/logger';
import type { MediaStreamFactory } from 'sip.js/lib/platform/web/session-description-handler/media-stream-factory';
import type { SessionDescriptionHandlerConfiguration } from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration';
import { SessionDescriptionHandler } from 'sip.js/lib/platform/web/session-description-handler/session-description-handler';
import { SessionDescriptionHandlerOptions } from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-options';
import { Inviter, Invitation } from 'sip.js/lib/api';
import IssueReporter from '../service/IssueReporter';
import { addIcesInAllBundles, fixSdp, parseCandidate } from '../utils/sdp';

const wazoLogger = IssueReporter ? IssueReporter.loggerFor('webrtc-sdh') : console;
// Customized mediaStreamFactory allowing to send screensharing stream directory when upgrading
export const wazoMediaStreamFactory = (constraints: Record<string, any>): Promise<MediaStream> => {
  // @see sip.js/lib/platform/web/session-description-handler/media-stream-factory-default
  if (!constraints.audio && !constraints.video) {
    return Promise.resolve(new MediaStream());
  }

  if (navigator.mediaDevices === undefined) {
    return Promise.reject(new Error('Media devices not available in insecure contexts.'));
  }

  // We have to make a `getUserMedia` on desktop but a `getDisplayMedia` in browsers when screensharing
  if (constraints.screen && !constraints.desktop) {
    return navigator.mediaDevices.getDisplayMedia.call(navigator.mediaDevices, constraints);
  }

  return navigator.mediaDevices.getUserMedia.call(navigator.mediaDevices, constraints);
};

class WazoSessionDescriptionHandler extends SessionDescriptionHandler {
  gatheredCandidates: Array<string | null | undefined>;

  eventEmitter: EventEmitter;

  isWeb: boolean;

  session: Inviter | Invitation;

  // eslint-disable-next-line @typescript-eslint/default-param-last
  constructor(logger: Logger, mediaStreamFactory: MediaStreamFactory, sessionDescriptionHandlerConfiguration: SessionDescriptionHandlerConfiguration, isWeb: boolean, session: Inviter | Invitation) {
    super(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration);
    this.eventEmitter = new EventEmitter();
    this.isWeb = isWeb;
    this.session = session;
  }

  on(event: string, callback: (...args: Array<any>) => any) {
    this.eventEmitter.on(event, callback);
  }

  off(event: string, callback: (...args: Array<any>) => any) {
    this.eventEmitter.removeListener(event, callback);
  }

  setRemoteSessionDescription(sessionDescription: RTCSessionDescriptionInit): Promise<void> {
    try {
      const result = super.setRemoteSessionDescription(sessionDescription);
      this.eventEmitter.emit('setDescription', sessionDescription);
      return result;
    } catch (error) {
      this.logger.error(`SessionDescriptionHandler.setRemoteSessionDescription: ${error}`);
      throw error;
    }
  }

  // Overridden to avoid to fix ice-candidates missing in the SDP in react-native and chrome canary.
  getDescription(options: Record<string, any> = {}, modifiers?: Array<(...args: Array<any>) => any>): Promise<any> {
    this.logger.debug('SessionDescriptionHandler.getDescription');

    if (this._peerConnection === undefined) {
      return Promise.reject(new Error('Peer connection closed.'));
    }

    // Callback on data channel creation
    // @ts-ignore
    this.onDataChannel = options.onDataChannel;
    // ICE will restart upon applying an offer created with the iceRestart option
    const iceRestart = options.offerOptions ? options.offerOptions.iceRestart : false;
    const isConference = options ? !!options.conference : false;
    const audioOnly = options ? !!options.audioOnly : false;
    // We should wait for ice when iceRestart (reinvite) or for the first invite
    // We shouldn't wait for ice when holding or resuming the call
    // We shouldn't wait for ice when receiving a reinvite (eg: pendingReinviteAck = true)
    // @ts-ignore
    const shouldWaitForIce = !this.session.pendingReinviteAck && (iceRestart || 'constraints' in options);
    // ICE gathering timeout may be set on a per call basis, otherwise the configured default is used
    const iceTimeout = options.iceGatheringTimeout === undefined ? this.sessionDescriptionHandlerConfiguration?.iceGatheringTimeout : options.iceGatheringTimeout;
    wazoLogger.trace('getting SDP description', {
      iceRestart,
      shouldWaitForIce,
      iceTimeout,
    });
    // Fetch ice ourselves for re-invite
    this.gatheredCandidates = [];

    if (!this.peerConnectionDelegate) {
      this.peerConnectionDelegate = {};
    }

    this.peerConnectionDelegate.onicecandidate = event => {
      wazoLogger.trace('onicecandidate', event.candidate ? event.candidate.candidate : {
        done: true,
      });

      if (event.candidate) {
        // @ts-ignore @REEVALUATE
        this.gatheredCandidates.push(parseCandidate(event.candidate.candidate));

        // When receiving a `srflx` or a `relay` candidate, consider the negotiation done.
        if (event.candidate.candidate.indexOf('srflx') !== -1 || event.candidate.candidate.indexOf('relay') !== -1) {
          wazoLogger.info('A valid ice was found, triggering ice gathering complete callback.', {
            ice: event.candidate.candidate,
          });
          this.iceGatheringComplete();
        }
      }
    };

    return this.getLocalMediaStream(options).then(() => this.updateDirection(options, isConference, audioOnly)).then(() => this.createDataChannel(options)).then(() => {
      if (isConference && options.constraints && !options.constraints.video && !('hold' in options) && !audioOnly) {
        // Add a video an empty bundle to be able to replaceTrack when joining a conference without video
        if (this.peerConnection?.addTransceiver) {
          this.peerConnection.addTransceiver('video', {
            streams: [this._localMediaStream],
            direction: 'sendrecv',
          });
        }
      }
    })
      .then(() => this.createLocalOfferOrAnswer(options))
      .then((sessionDescription: any) => this.setLocalSessionDescription(sessionDescription))
      .then(() => this.waitForIceGatheringComplete(iceRestart, iceTimeout))
      .then(() => this.getLocalSessionDescription())
      .then((description: any) => {
        const {
          sdp,
        } = description;

        // Check if we got ICEs
        if (sdp.indexOf('a=candidate') !== -1) {
          return {
            type: description.type,
            sdp: addIcesInAllBundles(sdp),
          };
        }

        wazoLogger.info('No ICE candidates found in SDP, fixing it with gathered ices', this.gatheredCandidates);
        // @TODO: find a better way to set sdp in answer.
        //  We can't call createAnswer again, so we have to put candidates manually with fixSdp
        // In reinvite, createOffer doesn't update the SDP
        return {
          type: description.type,
          // Fix sdp only when no candidates
          // @ts-ignore
          sdp: fixSdp(sdp, this.gatheredCandidates, options && options.constraints ? options.constraints.video : false),
        };
      })
      .then((sessionDescription: any) => this.applyModifiers(sessionDescription, modifiers))
      .then((sessionDescription: any) => ({
        body: sessionDescription.sdp,
        contentType: 'application/sdp',
      }))
      .catch((error: Error) => {
        wazoLogger.error('error when creating media', error);
        this.logger.error(`SessionDescriptionHandler.getDescription failed - ${error}`);
        throw error;
      });
  }

  // Overridden to avoid to use peerConnection.getReceivers and peerConnection.getSenders in react-native
  sendDtmf(tones: string, options: {
    duration: number;
    interToneGap: number;
  } = { duration: 0, interToneGap: 0 }): boolean {
    if (this.isWeb) {
      return super.sendDtmf(tones, options);
    }

    this.logger.debug(`DTMF sent via INFO: ${tones.toString()}`);
    const body = {
      contentDisposition: 'render',
      contentType: 'application/dtmf-relay',
      content: `Signal=${tones}\r\nDuration=${options.duration || 1000}`,
    };
    const requestOptions = {
      body,
    };
    // @ts-ignore @REEVALUATE: session.info is asynched
    return this.session.info({
      requestOptions,
    });
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

    // Closing senders via getLocalStreams, `getLocalStreams` is deprecated, we have to check if it exists.
    // @ts-ignore
    if (this.peerConnection?.getLocalStreams) {
      // @ts-ignore
      this.peerConnection?.getLocalStreams().forEach(stream => {
        stream.getTracks()
          .filter((track: MediaStreamTrack) => track.enabled)
          .forEach((track: MediaStreamTrack) => track.stop());
      });

      // Closing receivers via getRemoteStreams
      // @ts-ignore
      this.peerConnection?.getRemoteStreams().forEach(stream => {
        stream.getTracks()
          .filter((track: MediaStreamTrack) => track.enabled)
          .forEach((track: MediaStreamTrack) => track.stop());
      });
    }

    if (this._dataChannel) {
      this._dataChannel.close();
    }

    this._peerConnection.close();

    this._peerConnection = undefined;
  }

  // Overridden to send `inactive` in conference
  updateDirection(options?: SessionDescriptionHandlerOptions, isConference = false, audioOnly = false): Promise<void> {
    if (this._peerConnection === undefined) {
      return Promise.reject(new Error('Peer connection closed.'));
    }

    // Waiting for `getTransceivers` API on mobile
    if (!this.isWeb) {
      return Promise.resolve();
    }

    switch (this._peerConnection.signalingState) {
      case 'stable':
        {
          // if we are stable, assume we are creating a local offer
          this.logger.debug('SessionDescriptionHandler.updateDirection - setting offer direction');

          // determine the direction to offer given the current direction and hold state
          const directionToOffer = (currentDirection: string, transceiver: Record<string, any>)
          /* RTCRtpTransceiver */
          : Record<string, any> | string => {
            if (isConference) {
              if (audioOnly && transceiver.receiver.track && transceiver.receiver.track.kind === 'video') {
                return 'sendonly';
              }

              return options && options.hold ? 'sendonly' : 'sendrecv';
            }

            switch (currentDirection) {
              case 'inactive':
                return options && options.hold ? 'inactive' : isConference && !audioOnly ? 'sendrecv' : 'recvonly';

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
          this._peerConnection.getTransceivers().forEach(transceiver => {
            if (transceiver.direction
            /* guarding, but should always be true */
            ) {
              const offerDirection = directionToOffer(transceiver.direction, transceiver);

              if (transceiver.direction !== offerDirection) {
                // @ts-ignore - @REEVALUATE
                // eslint-disable-next-line no-param-reassign
                transceiver.direction = offerDirection;
              }
            }
          });
        }
        break;

      case 'have-remote-offer':
        {
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
          this._peerConnection.getTransceivers().forEach(transceiver => {
            // @ts-ignore
            if (transceiver.stopped) {
              return;
            }

            if (transceiver.direction
            /* guarding, but should always be true */
            ) {
              const {
                receiver,
              } = transceiver;

              if (isConference && audioOnly && receiver.track && receiver.track.kind === 'video') {
                // eslint-disable-next-line no-param-reassign
                transceiver.direction = 'inactive';
                return;
              }

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

  // Overridden to not reuse video track in SFU mode
  setLocalMediaStream(stream: MediaStream) {
    this.logger.debug('SessionDescriptionHandler.setLocalMediaStream');

    if (!this._peerConnection) {
      throw new Error('Peer connection undefined.');
    }

    const pc: any = this._peerConnection;
    const {
      sfu,
    } = pc;
    const localStream = this._localMediaStream;
    const trackUpdates: Array<Promise<void>> = [];

    const updateTrack = (newTrack: MediaStreamTrack): void => {
      const {
        kind,
      } = newTrack;

      if (kind !== 'audio' && kind !== 'video') {
        throw new Error(`Unknown new track kind ${kind}.`);
      }

      const sender = pc.getSenders && pc.getSenders().find((otherSender: any) => otherSender.track && otherSender.track.kind === kind);

      // Do not reuse sender video tracks in SFU
      if (sender && (!sfu || newTrack.kind === 'audio')) {
        if (sender.track) {
          // eslint-disable-next-line no-param-reassign
          newTrack.enabled = sender.track.enabled;
        }

        trackUpdates.push(new Promise(resolve => {
          this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - replacing sender ${kind} track`);
          resolve(null);
        }).then(() => sender.replaceTrack(newTrack).then(() => {
          const oldTrack = localStream.getTracks().find(localTrack => localTrack.kind === kind);

          if (oldTrack) {
            oldTrack.stop();
            localStream.removeTrack(oldTrack);
            // @ts-ignore
            SessionDescriptionHandler.dispatchRemoveTrackEvent(localStream, oldTrack);
          }

          localStream.addTrack(newTrack);
          // @ts-ignore
          SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
        }).catch((error: Error) => {
          this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to replace sender ${kind} track`);
          throw error;
        })));
      } else {
        trackUpdates.push(new Promise(resolve => {
          this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - adding sender ${kind} track`);
          resolve(null);
        }).then(() => {
          // Review: could make streamless tracks a configurable option?
          // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack#Usage_notes
          try {
            if (pc.addTrack) {
              pc.addTrack(newTrack, localStream);
            } else {
              pc.addStream(localStream);
            }
          } catch (error) {
            this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to add sender ${kind} track`);
            throw error;
          }

          localStream.addTrack(newTrack);
          // @ts-ignore
          SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
        }));
      }
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

  // Overridden to avoid replacing constraints with `localMediaStreamConstraints`
  getLocalMediaStream(options: Record<string, any>): Promise<any> {
    this.logger.debug('WazoSessionDescriptionHandler.getLocalMediaStream');

    if (this._peerConnection === undefined) {
      return Promise.reject(new Error('Peer connection closed.'));
    }

    let constraints = options.constraints ? { ...options.constraints,
    } : {};

    // if we already have a local media stream...
    // @ts-ignore
    if (this.localMediaStreamConstraints) {
      // if constraints have not changed, do not get a new media stream
      // @ts-ignore
      if (JSON.stringify(this.localMediaStreamConstraints.audio) === JSON.stringify(constraints.audio) && JSON.stringify(this.localMediaStreamConstraints.video) === JSON.stringify(constraints.video)) {
        return Promise.resolve();
      }
    } else if (constraints.audio === undefined && constraints.video === undefined) {
      // if no constraints have been specified, default to audio for initial media stream
      constraints = {
        audio: true,
      };
    }

    // @ts-ignore
    this.localMediaStreamConstraints = constraints;
    // @ts-ignore
    return this.mediaStreamFactory(constraints, this).then(mediaStream => {
      this.setLocalMediaStream(mediaStream);
      return mediaStream;
    });
  }

}

export default WazoSessionDescriptionHandler;
