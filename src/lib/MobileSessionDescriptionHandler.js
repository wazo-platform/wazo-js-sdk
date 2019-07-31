/* eslint-disable */
// @see: https://github.com/onsip/SIP.js/blob/0.13.8/src/Web/SessionDescriptionHandler.ts
import EventEmitter from 'events';
import { SessionDescriptionHandlerObserver } from 'sip.js/lib/Web/SessionDescriptionHandlerObserver';

// Avoid issue with sip.js :
// `window.addEventListener` is not a function. (In 'window.addEventListener("unload",this.unloadListener)')`
if (!window.addEventListener) {
  window.addEventListener = () => {};
  window.removeEventListener = () => {};
}

/* SessionDescriptionHandler
 * @class PeerConnection helper Class.
 * @param {SIP.Session} session
 * @param {Object} [options]
 */
export default SIPMethods =>
  class MobileSessionDescriptionHandler extends EventEmitter {
    /**
     * @param {SIP.Session} session
     * @param {Object} [options]
     */
    static defaultFactory(session, options) {
      const logger = session.ua.getLogger('sip.invitecontext.sessionDescriptionHandler', session.id);
      const observer = new SessionDescriptionHandlerObserver(session, options);

      return new MobileSessionDescriptionHandler(logger, observer, options);
    }

    constructor(logger, observer, options) {
      super();

      // TODO: Validate the options
      this.options = options || {};

      this.logger = logger;
      this.observer = observer;
      this.dtmfSender = null;

      this.shouldAcquireMedia = true;

      this.CONTENT_TYPE = 'application/sdp';

      this.C = {};
      this.C.DIRECTION = {
        NULL: null,
        SENDRECV: 'sendrecv',
        SENDONLY: 'sendonly',
        RECVONLY: 'recvonly',
        INACTIVE: 'inactive',
      };

      this.logger.log('SessionDescriptionHandlerOptions: ' + JSON.stringify(this.options));

      this.direction = this.C.DIRECTION.NULL;

      this.modifiers = this.options.modifiers || [];
      if (!Array.isArray(this.modifiers)) {
        this.modifiers = [this.modifiers];
      }

      var environment = global.window || global;
      this.WebRTC = {
        MediaStream: environment.MediaStream,
        getUserMedia: environment.navigator.mediaDevices.getUserMedia.bind(environment.navigator.mediaDevices),
        RTCPeerConnection: environment.RTCPeerConnection,
        RTCSessionDescription: environment.RTCSessionDescription,
      };

      this.iceGatheringDeferred = null;
      this.iceGatheringTimeout = false;
      this.iceGatheringTimer = null;

      this.initPeerConnection(this.options.peerConnectionOptions);

      this.constraints = this.checkAndDefaultConstraints(this.options.constraints);
    }

    /**
     * Destructor
     */
    close() {
      this.logger.log('closing PeerConnection');
      // have to check signalingState since this.close() gets called multiple times
      if (this.peerConnection && this.peerConnection.signalingState !== 'closed') {
        if (this.peerConnection.getSenders) {
          this.peerConnection.getSenders().forEach(function(sender) {
            if (sender.track) {
              sender.track.stop();
            }
          });
        } else {
          this.logger.warn('Using getLocalStreams which is deprecated');
          this.peerConnection.getLocalStreams().forEach(function(stream) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
          });
        }
        if (this.peerConnection.getReceivers) {
          this.peerConnection.getReceivers().forEach(function(receiver) {
            if (receiver.track) {
              receiver.track.stop();
            }
          });
        } else {
          this.logger.warn('Using getRemoteStreams which is deprecated');
          this.peerConnection.getRemoteStreams().forEach(function(stream) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
          });
        }
        this.resetIceGatheringComplete();
        this.peerConnection.close();
      }
    }

    /**
     * Gets the local description from the underlying media implementation
     * @param {Object} [options] Options object to be used by getDescription
     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
     * @param {Array} [modifiers] Array with one time use description modifiers
     * @returns {Promise} Promise that resolves with the local description to be used for the session
     */
    getDescription(options, modifiers) {
      options = options || {};
      if (options.peerConnectionOptions) {
        this.initPeerConnection(options.peerConnectionOptions);
      }

      this.shouldAcquireMedia = true;

      modifiers = modifiers || [];
      if (!Array.isArray(modifiers)) {
        modifiers = [modifiers];
      }
      modifiers = modifiers.concat(this.modifiers);

      return Promise.resolve()
        .then(
          function() {
            if (this.shouldAcquireMedia) {
              return this.acquire(JSON.parse(JSON.stringify(this.constraints))).then(
                function() {
                  this.shouldAcquireMedia = false;
                }.bind(this)
              );
            }
          }.bind(this)
        )
        .then(
          function() {
            return this.createOfferOrAnswer(options.RTCOfferOptions, modifiers);
          }.bind(this)
        )
        .then(
          function(description) {
            this.emit('getDescription', description);
            return {
              body: description.sdp,
              contentType: this.CONTENT_TYPE,
            };
          }.bind(this)
        );
    }

    /**
     * Check if the Session Description Handler can handle the Content-Type described by a SIP Message
     * @param {String} contentType The content type that is in the SIP Message
     * @returns {boolean}
     */
    hasDescription(contentType) {
      return contentType === this.CONTENT_TYPE;
    }

    /**
     * The modifier that should be used when the session would like to place the call on hold
     * @param {String} [sdp] The description that will be modified
     * @returns {Promise} Promise that resolves with modified SDP
     */
    holdModifier(description) {
      if (!/a=(sendrecv|sendonly|recvonly|inactive)/.test(description.sdp)) {
        description.sdp = description.sdp.replace(/(m=[^\r]*\r\n)/g, '$1a=sendonly\r\n');
      } else {
        description.sdp = description.sdp.replace(/a=sendrecv\r\n/g, 'a=sendonly\r\n');
        description.sdp = description.sdp.replace(/a=recvonly\r\n/g, 'a=inactive\r\n');
      }
      return Promise.resolve(description);
    }

    /**
     * Set the remote description to the underlying media implementation
     * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation
     * @param {Object} [options] Options object to be used by getDescription
     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options
     * @param {Array} [modifiers] Array with one time use description modifiers
     * @returns {Promise} Promise that resolves once the description is set
     */
    setDescription(sessionDescription, options, modifiers) {
      var self = this;

      options = options || {};
      if (options.peerConnectionOptions) {
        this.initPeerConnection(options.peerConnectionOptions);
      }

      modifiers = modifiers || [];
      if (!Array.isArray(modifiers)) {
        modifiers = [modifiers];
      }
      modifiers = modifiers.concat(this.modifiers);

      var description = {
        type: this.hasOffer('local') ? 'answer' : 'offer',
        sdp: sessionDescription,
      };

      return Promise.resolve()
        .then(
          function() {
            // Media should be acquired in getDescription unless we need to do it sooner for some reason (FF61+)
            if (this.shouldAcquireMedia && this.options.alwaysAcquireMediaFirst) {
              return this.acquire(this.constraints).then(
                function() {
                  this.shouldAcquireMedia = false;
                }.bind(this)
              );
            }
          }.bind(this)
        )
        .then(function() {
          return SIPMethods.Utils.reducePromises(modifiers, description);
        })
        .catch(e => {
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError(
            'setDescription',
            e,
            'The modifiers did not resolve successfully'
          );
          this.logger.error(error.message);
          self.emit('peerConnection-setRemoteDescriptionFailed', error);
          throw error;
        })
        .then(function(modifiedDescription) {
          self.emit('setDescription', modifiedDescription);

          return self.peerConnection.setRemoteDescription(new self.WebRTC.RTCSessionDescription(modifiedDescription));
        })
        .catch(e => {
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          // Check the original SDP for video, and ensure that we have want to do audio fallback
          if (/^m=video.+$/gm.test(sessionDescription) && !options.disableAudioFallback) {
            // Do not try to audio fallback again
            options.disableAudioFallback = true;
            // Remove video first, then do the other modifiers
            return this.setDescription(
              sessionDescription,
              options,
              [SIPMethods.Web.Modifiers.stripVideo].concat(modifiers)
            );
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError('setDescription', e);
          this.logger.error(error.error);
          this.emit('peerConnection-setRemoteDescriptionFailed', error);
          throw error;
        })
        .then(function setRemoteDescriptionSuccess() {
          if (self.peerConnection.getReceivers) {
            self.emit('setRemoteDescription', self.peerConnection.getReceivers());
          } else {
            self.emit('setRemoteDescription', self.peerConnection.getRemoteStreams());
          }
          self.emit('confirmed', self);
        });
    }

    /**
     * Send DTMF via RTP (RFC 4733)
     * @param {String} tones A string containing DTMF digits
     * @param {Object} [options] Options object to be used by sendDtmf
     * @returns {boolean} true if DTMF send is successful, false otherwise
     */
    sendDtmf(tones, options) {
      if (!this.dtmfSender && this.hasBrowserGetSenderSupport()) {
        var senders = this.peerConnection.getSenders();
        if (senders.length > 0) {
          this.dtmfSender = senders[0].dtmf;
        }
      }
      if (!this.dtmfSender && this.hasBrowserTrackSupport()) {
        var streams = this.peerConnection.getLocalStreams();
        if (streams.length > 0) {
          var audioTracks = streams[0].getAudioTracks();
          if (audioTracks.length > 0) {
            this.dtmfSender = this.peerConnection.createDTMFSender(audioTracks[0]);
          }
        }
      }
      if (!this.dtmfSender) {
        return false;
      }
      try {
        this.dtmfSender.insertDTMF(tones, options.duration, options.interToneGap);
      } catch (e) {
        if (e.type === 'InvalidStateError' || e.type === 'InvalidCharacterError') {
          this.logger.error(e);
          return false;
        } else {
          throw e;
        }
      }
      this.logger.log('DTMF sent via RTP: ' + tones.toString());
      return true;
    }

    getDirection() {
      return this.direction;
    }

    // Internal functions
    createOfferOrAnswer(RTCOfferOptions, modifiers) {
      var self = this;
      var methodName;
      var pc = this.peerConnection;

      RTCOfferOptions = RTCOfferOptions || {};

      methodName = self.hasOffer('remote') ? 'createAnswer' : 'createOffer';

      return pc[methodName](RTCOfferOptions)
        .catch(e => {
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError(
            'createOfferOrAnswer',
            e,
            'peerConnection-' + methodName + 'Failed'
          );
          this.emit('peerConnection-' + methodName + 'Failed', error);
          throw error;
        })
        .then(function(sdp) {
          return SIPMethods.Utils.reducePromises(modifiers, self.createRTCSessionDescriptionInit(sdp));
        })
        .then(function(sdp) {
          self.resetIceGatheringComplete();
          return pc.setLocalDescription(new self.WebRTC.RTCSessionDescription(sdp));
        })
        .catch(e => {
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError(
            'createOfferOrAnswer',
            e,
            'peerConnection-SetLocalDescriptionFailed'
          );
          this.emit('peerConnection-SetLocalDescriptionFailed', error);
          throw error;
        })
        .then(function onSetLocalDescriptionSuccess() {
          return self.waitForIceGatheringComplete();
        })
        .then(function readySuccess() {
          var localDescription = self.createRTCSessionDescriptionInit(self.peerConnection.localDescription);
          return SIPMethods.Utils.reducePromises(modifiers, localDescription);
        })
        .then(function(localDescription) {
          self.setDirection(localDescription.sdp);
          return localDescription;
        })
        .then(localDescription =>
          // @see https://github.com/oney/react-native-webrtc/issues/242#issuecomment-290452014
          // @see https://github.com/oney/RCTWebRTCDemo/blob/master/main.js#L103
          methodName === 'createOffer' && !modifiers.length ? pc[methodName](RTCOfferOptions) : localDescription
        )
        .catch(e => {
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError('createOfferOrAnswer', e);
          this.logger.error(error);
          throw error;
        });
    }

    // Creates an RTCSessionDescriptionInit from an RTCSessionDescription
    createRTCSessionDescriptionInit(RTCSessionDescription) {
      return {
        type: RTCSessionDescription.type,
        sdp: RTCSessionDescription.sdp,
      };
    }

    addDefaultIceCheckingTimeout(peerConnectionOptions) {
      if (peerConnectionOptions.iceCheckingTimeout === undefined) {
        peerConnectionOptions.iceCheckingTimeout = 5000;
      }

      return peerConnectionOptions;
    }

    addDefaultIceServers(rtcConfiguration) {
      if (!rtcConfiguration.iceServers) {
        rtcConfiguration.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
      }
      return rtcConfiguration;
    }

    checkAndDefaultConstraints(constraints) {
      let defaultConstraints = { audio: true, video: constraints.video };

      constraints = constraints || defaultConstraints;
      // Empty object check
      if (Object.keys(constraints).length === 0 && constraints.constructor === Object) {
        return defaultConstraints;
      }

      return constraints;
    }

    hasBrowserTrackSupport() {
      return Boolean(this.peerConnection.addTrack);
    }

    hasBrowserGetSenderSupport() {
      return Boolean(this.peerConnection.getSenders);
    }

    initPeerConnection(options) {
      var self = this;
      options = options || {};
      options = this.addDefaultIceCheckingTimeout(options);
      options.rtcConfiguration = options.rtcConfiguration || {};
      options.rtcConfiguration = this.addDefaultIceServers(options.rtcConfiguration);

      this.logger.log('initPeerConnection');

      if (this.peerConnection) {
        this.logger.log('Already have a peer connection for this session. Tearing down.');
        this.resetIceGatheringComplete();
        this.peerConnection.close();
      }

      this.peerConnection = new this.WebRTC.RTCPeerConnection(options.rtcConfiguration);

      this.logger.log('New peer connection created');

      if ('ontrack' in this.peerConnection) {
        this.peerConnection.addEventListener('track', function(e) {
          self.logger.log('track added');
          self.observer.trackAdded();
          self.emit('addTrack', e);
        });
      } else {
        this.logger.warn('Using onaddstream which is deprecated');
        this.peerConnection.onaddstream = function(e) {
          self.logger.log('stream added');
          self.emit('addStream', e);
        };
      }

      this.peerConnection.onicecandidate = function(e) {
        self.emit('iceCandidate', e);
        if (e.candidate) {
          self.logger.log(
            'ICE candidate received: ' + (e.candidate.candidate === null ? null : e.candidate.candidate.trim())
          );
        } else if (e.candidate === null) {
          // indicates the end of candidate gathering
          self.logger.log('ICE candidate gathering complete');
          self.triggerIceGatheringComplete();
        }
      };

      this.peerConnection.onicegatheringstatechange = function() {
        self.logger.log('RTCIceGatheringState changed: ' + this.iceGatheringState);
        switch (this.iceGatheringState) {
          case 'gathering':
            self.emit('iceGathering', this);
            if (!self.iceGatheringTimer && options.iceCheckingTimeout) {
              self.iceGatheringTimeout = false;
              self.iceGatheringTimer = setTimeout(function() {
                self.logger.log(
                  'RTCIceChecking Timeout Triggered after ' + options.iceCheckingTimeout + ' milliseconds'
                );
                self.iceGatheringTimeout = true;
                self.triggerIceGatheringComplete();
              }, options.iceCheckingTimeout);
            }
            break;
          case 'complete':
            self.triggerIceGatheringComplete();
            break;
        }
      };

      this.peerConnection.oniceconnectionstatechange = function() {
        //need e for commented out case
        var stateEvent;

        switch (this.iceConnectionState) {
          case 'new':
            stateEvent = 'iceConnection';
            break;
          case 'checking':
            stateEvent = 'iceConnectionChecking';
            break;
          case 'connected':
            stateEvent = 'iceConnectionConnected';
            break;
          case 'completed':
            stateEvent = 'iceConnectionCompleted';
            break;
          case 'failed':
            stateEvent = 'iceConnectionFailed';
            break;
          case 'disconnected':
            stateEvent = 'iceConnectionDisconnected';
            break;
          case 'closed':
            stateEvent = 'iceConnectionClosed';
            break;
          default:
            self.logger.warn('Unknown iceConnection state:', this.iceConnectionState);
            return;
        }
        self.emit(stateEvent, this);
      };
    }

    acquire(constraints) {
      // Default audio & video to true
      constraints = this.checkAndDefaultConstraints(constraints);

      return new Promise(
        function(resolve, reject) {
          /*
           * Make the call asynchronous, so that ICCs have a chance
           * to define callbacks to `userMediaRequest`
           */
          this.logger.log('acquiring local media');
          this.emit('userMediaRequest', constraints);

          if (constraints.audio || constraints.video) {
            // Avoid exception on immutable object, can't use destructuring because android crashes
            this.WebRTC.getUserMedia(JSON.parse(JSON.stringify(constraints)))
              .then(
                function(streams) {
                  this.observer.trackAdded();
                  this.emit('userMedia', streams);
                  resolve(streams);
                }.bind(this)
              )
              .catch(
                function(e) {
                  this.emit('userMediaFailed', e);
                  reject(e);
                }.bind(this)
              );
          } else {
            // Local streams were explicitly excluded.
            resolve([]);
          }
        }.bind(this)
      )
        .catch(e => {
          // TODO: This propogates downwards
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError(
            'acquire',
            e,
            'unable to acquire streams'
          );
          this.logger.error(error.message);
          this.logger.error(error.error);
          throw error;
        })
        .then(
          function acquireSucceeded(streams) {
            this.logger.log('acquired local media streams');
            try {
              // Remove old tracks
              if (this.peerConnection.removeTrack) {
                this.peerConnection.getSenders().forEach(function(sender) {
                  this.peerConnection.removeTrack(sender);
                }, this);
              }
              return streams;
            } catch (e) {
              return Promise.reject(e);
            }
          }.bind(this)
        )
        .catch(e => {
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError(
            'acquire',
            e,
            'error removing streams'
          );
          this.logger.error(error.message);
          this.logger.error(error.error);
          throw error;
        })
        .then(
          function addStreams(streams) {
            try {
              streams = [].concat(streams);
              streams.forEach(function(stream) {
                if (this.peerConnection.addTrack) {
                  stream.getTracks().forEach(function(track) {
                    this.peerConnection.addTrack(track, stream);
                  }, this);
                } else {
                  // Chrome 59 does not support addTrack
                  this.peerConnection.addStream(stream);
                }
              }, this);
            } catch (e) {
              return Promise.reject(e);
            }
            return Promise.resolve();
          }.bind(this)
        )
        .catch(e => {
          if (e instanceof SIPMethods.Exceptions.SessionDescriptionHandlerError) {
            throw e;
          }
          const error = new SIPMethods.Exceptions.SessionDescriptionHandlerError('acquire', e, 'error adding stream');
          this.logger.error(error.message);
          this.logger.error(error.error);
          throw error;
        });
    }

    hasOffer(where) {
      var offerState = 'have-' + where + '-offer';

      return this.peerConnection.signalingState === offerState;
    }

    // ICE gathering state handling
    isIceGatheringComplete() {
      return this.peerConnection.iceGatheringState === 'complete' || this.iceGatheringTimeout;
    }

    resetIceGatheringComplete() {
      this.iceGatheringTimeout = false;

      if (this.iceGatheringTimer) {
        clearTimeout(this.iceGatheringTimer);
        this.iceGatheringTimer = null;
      }

      if (this.iceGatheringDeferred) {
        this.iceGatheringDeferred.reject();
        this.iceGatheringDeferred = null;
      }
    }

    setDirection(sdp) {
      var match = sdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);
      if (match === null) {
        this.direction = this.C.DIRECTION.NULL;
        this.observer.directionChanged();
        return;
      }
      var direction = match[1];
      switch (direction) {
        case this.C.DIRECTION.SENDRECV:
        case this.C.DIRECTION.SENDONLY:
        case this.C.DIRECTION.RECVONLY:
        case this.C.DIRECTION.INACTIVE:
          this.direction = direction;
          break;
        default:
          this.direction = this.C.DIRECTION.NULL;
          break;
      }
      this.observer.directionChanged();
    }

    triggerIceGatheringComplete() {
      if (this.isIceGatheringComplete()) {
        this.emit('iceGatheringComplete', this);

        if (this.iceGatheringTimer) {
          clearTimeout(this.iceGatheringTimer);
          this.iceGatheringTimer = null;
        }

        if (this.iceGatheringDeferred) {
          this.iceGatheringDeferred.resolve();
          this.iceGatheringDeferred = null;
        }
      }
    }

    waitForIceGatheringComplete() {
      if (this.isIceGatheringComplete()) {
        return Promise.resolve();
      } else if (!this.isIceGatheringDeferred) {
        this.iceGatheringDeferred = SIPMethods.Utils.defer();
      }
      return this.iceGatheringDeferred.promise;
    }
  };
