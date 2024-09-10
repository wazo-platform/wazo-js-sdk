/* eslint-disable no-underscore-dangle, no-param-reassign, no-restricted-syntax */
import type { SessionDescriptionHandler } from 'sip.js/lib/platform/web/session-description-handler/session-description-handler';
import type { SessionDescriptionHandlerFactoryOptions } from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-factory-options';
import type { SessionDescriptionHandlerConfiguration } from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration';
import { defaultPeerConnectionConfiguration } from 'sip.js/lib/platform/web/session-description-handler/peer-connection-configuration-default';
import { stripVideo } from 'sip.js/lib/platform/web';

import WazoSessionDescriptionHandler, { wazoMediaStreamFactory } from '../lib/WazoSessionDescriptionHandler';
import { SipCall, PeerConnection, UserAgentOptions, WebRtcConfig, UserAgentConfigOverrides } from '../domain/types';
import { getSipCallId, getVideoDirection, hasAnActiveVideo, makeURI, replaceLocalIpModifier } from './sdp';
import IssueReporter from '../service/IssueReporter';
import { lastIndexOf } from './array';

type Candidate = {
  foundation: string,
  component: string,
  protocol: string,
  priority: number,
  ip: string,
  port: number,
  type: string,
  relatedAddress?: string,
  relatedPort?: number,
  tcpType?: string
};

type Constraint = MediaTrackConstraintSet | boolean | undefined;

const logger = IssueReporter.loggerFor('webrtc');

// setting a 24hr timeout and letting the backend define the actual value
const NO_ANSWER_TIMEOUT = 60 * 60 * 24; // in seconds
const DEFAULT_ICE_TIMEOUT = 3000;

const privateIpRegex = /^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\..*/;

export const isWeb = (): boolean => typeof window === 'object' && typeof document === 'object';

export const isFirefox = (): boolean => isWeb() && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export const isAPrivateIp = (ip: string): boolean => privateIpRegex.exec(ip) == null;

export const getIceServers = (ip: string): Array<{ urls: Array<string> }> => {
  if (isAPrivateIp(ip)) {
    return [{
      urls: ['stun:stun.l.google.com:19302', 'stun:stun4.l.google.com:19302'],
    }];
  }

  return [];
};

export const parseCandidate = (line: string) => {
  let parts;

  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  const candidate: Candidate = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7],
  };

  for (let i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;

      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;

      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;

      default:
        // Unknown extensions are silently ignored.
        break;
    }
  }

  return candidate;
};

export const getPeerConnection = (sipCall: SipCall): RTCPeerConnection | null | undefined => {
  if (!sipCall) {
    return null;
  }

  return sipCall.sessionDescriptionHandler ? (sipCall.sessionDescriptionHandler as SessionDescriptionHandler).peerConnection : null;
};

export const getLocalStream = (sipCall: SipCall): MediaStream | null => {
  return (sipCall?.sessionDescriptionHandler as SessionDescriptionHandler)?.localMediaStream || null;
};

export const getLocalTracks = (sipCall: SipCall): MediaStreamTrack[] => {
  const localStream = getLocalStream(sipCall);

  if (!localStream) {
    return [];
  }

  return localStream.getTracks();
};

export const getRemoteStream = (sipCall: SipCall): MediaStream | null => {
  return (sipCall?.sessionDescriptionHandler as SessionDescriptionHandler)?.remoteMediaStream || null;
};

export const isVideoTrack = (track: MediaStreamTrack): boolean => track.kind === 'video' && track.readyState === 'live';

export const hasLocalVideo = (sipCall: SipCall): boolean => getLocalTracks(sipCall).some(isVideoTrack);

export const hasALocalVideoTrack = (sipCall: SipCall): boolean => getLocalTracks(sipCall).some(track => track.kind === 'video');

export const getLocalVideoStream = (sipCall: SipCall): MediaStream | null | undefined => (hasLocalVideo(sipCall) ? getLocalStream(sipCall) : null);

export const getRemoteTracks = (sipCall: SipCall): MediaStreamTrack[] => {
  const remoteStream = getRemoteStream(sipCall);

  if (!remoteStream) {
    return [];
  }

  return remoteStream.getTracks();
};

export const isVideoRemotelyHeld = (sipCall: SipCall): boolean => {
  const pc = getPeerConnection(sipCall);
  const sdp = pc && pc.remoteDescription ? pc.remoteDescription.sdp : null;

  if (!sdp) {
    return false;
  }

  const videoDirection = getVideoDirection(sdp);
  return videoDirection === 'sendonly';
};

export const hasRemoteVideo = (sipCall: SipCall): boolean => getRemoteTracks(sipCall).some(isVideoTrack);

export const hasARemoteVideoTrack = (sipCall: SipCall): boolean => getRemoteTracks(sipCall).some(track => track.kind === 'video');

export const getRemoteVideoStream = (sipCall: SipCall): MediaStream | null | undefined => {
  if (isVideoRemotelyHeld(sipCall)) {
    return null;
  }

  return hasRemoteVideo(sipCall) ? getRemoteStream(sipCall) : null;
};

export const getRemoteVideoStreamFromPc = (sipCall: SipCall): MediaStream | null | undefined => {
  const pc = getPeerConnection(sipCall) as PeerConnection;

  if (!pc) {
    return null;
  }

  return pc.getRemoteStreams().find((stream: MediaStream) => !!stream.getVideoTracks().length);
};

export const hasVideoTrack = (sipCall: SipCall): boolean => hasLocalVideo(sipCall) || hasRemoteVideo(sipCall);

export const hasAVideoTrack = (sipCall: SipCall): boolean => hasALocalVideoTrack(sipCall) || hasARemoteVideoTrack(sipCall);

// eslint-disable-next-line no-unused-vars
export const sessionWantsToDoVideo = (sipCall: SipCall): boolean => {
  if (!sipCall) {
    return false;
  }

  const {
    body,
  } = sipCall.request || sipCall;
  // Sometimes with InviteClientContext the body is in the body attribute ...
  const sdp = typeof body === 'object' && body ? body.body : body;
  if (!sdp) {
    return (sipCall.sessionDescriptionHandler as any)?.localMediaStreamConstraints?.video;
  }

  return hasAnActiveVideo(sdp);
};

export const getWebRtcStats = async (sipCall: SipCall): Promise<RTCStatsReport | null> => {
  const pc = getPeerConnection(sipCall) as PeerConnection;

  if (!pc) {
    return null;
  }

  return pc.getStats(null);
};

export const toggleAudio = (sipCall: SipCall, muteAudio: boolean): void => {
  const sdh = sipCall.sessionDescriptionHandler as SessionDescriptionHandler;
  const pc = (sdh?.peerConnection || null) as PeerConnection;

  if (!pc) {
    return;
  }

  if (pc.getSenders) {
    pc.getSenders().forEach((sender) => {
      if (sender && sender.track && sender.track.kind === 'audio') {
        // eslint-disable-next-line
        sender.track.enabled = !muteAudio;
      }
    });
  } else {
    pc.getLocalStreams().forEach((stream: MediaStream) => {
      stream.getAudioTracks().forEach(track => {
        // eslint-disable-next-line
        track.enabled = !muteAudio;
      });
    });
  }
};

export const toggleVideo = (sipCall: SipCall, muteCamera: boolean): void => {
  const sdh = sipCall.sessionDescriptionHandler as SessionDescriptionHandler;
  const pc = sdh?.peerConnection as PeerConnection;

  if (pc?.getSenders) {
    pc.getSenders().forEach((sender) => {
      if (sender && sender.track && sender.track.kind === 'video') {
        // eslint-disable-next-line
        sender.track.enabled = !muteCamera;
      }
    });
  } else {
    pc.getLocalStreams().forEach((stream: MediaStream) => {
      stream.getVideoTracks().forEach(track => {
        // eslint-disable-next-line
        track.enabled = !muteCamera;
      });
    });
  }
};

export const isVideoMuted = (sipCall: SipCall): boolean => {
  const sdh = sipCall.sessionDescriptionHandler as SessionDescriptionHandler;
  const pc = sdh?.peerConnection as PeerConnection;
  if (!pc) {
    return true;
  }

  if (pc?.getSenders) {
    for (const sender of pc.getSenders()) {
      if (sender && sender.track && sender.track.kind === 'video') {
        return !sender.track.enabled;
      }
    }
  } else {
    for (const stream of pc.getLocalStreams()) {
      // eslint-disable-next-line no-unreachable-loop
      for (const track of stream.getVideoTracks()) {
        return !track.enabled;
      }
    }
  }

  return true;
};

export const cleanupStream = (stream: MediaStream): void => {
  stream.getTracks().filter(track => track.enabled).forEach(track => track.stop());
};

export const setLocalMediaStream = (sipCall: SipCall, newStream: MediaStream): void => {
  logger.info('setting local media stream', {
    id: getSipCallId(sipCall),
    tracks: newStream ? newStream.getTracks() : null,
  });

  if (sipCall.sessionDescriptionHandler) {
    // eslint-disable-next-line no-underscore-dangle
    // @ts-ignore: protected
    sipSession.sessionDescriptionHandler._localMediaStream = newStream;
  }
};

export const updateRemoteStream = (sipCall: SipCall, allTracks = true): void => {
  const remoteStream = getRemoteStream(sipCall);
  const pc = getPeerConnection(sipCall);

  logger.info('Updating remote stream', {
    id: getSipCallId(sipCall),
    tracks: remoteStream ? remoteStream.getTracks() : null,
    receiverTracks: pc && pc.getReceivers ? pc.getReceivers().map((receiver) => receiver.track) : null,
  });

  if (!pc || !remoteStream) {
    return;
  }

  remoteStream.getTracks().forEach(track => {
    if (allTracks || track.kind === 'video') {
      remoteStream.removeTrack(track);
    }
  });

  if (pc.getReceivers) {
    pc.getReceivers().forEach((receiver) => {
      if (allTracks || receiver.track.kind === 'video') {
        remoteStream.addTrack(receiver.track);
      }
    });
  }
};

export const isAudioOnly = (sipCall: SipCall): boolean => {
  return Boolean(sipCall.sessionDescriptionHandlerModifiersReInvite.find(modifier => modifier === stripVideo));
};

// @ts-ignore: media constraints
export const getAudioConstraints = (audio: Constraint): MediaTrackConstraints | boolean => (audio?.deviceId?.exact ? audio : true);

export const getVideoConstraints = (video: Constraint = false): MediaTrackConstraints | boolean => {
  if (!video) {
    return false;
  }

  // @ts-ignore: media constraints
  return video?.deviceId?.exact ? video : true;
};

// eslint-disable-next-line no-unused-vars
const getRtcOptions = () => {
  return {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: false,
    },
  };
};

export const getMediaConfiguration = (enableVideo: boolean, conference = false, constraints: Record<string, any> | null | undefined = null): Record<string, any> => {
  const screenSharing = constraints && 'screen' in constraints ? constraints.screen : false;
  const isDesktop = constraints && 'desktop' in constraints ? constraints.desktop : false;
  const withAudio = constraints && 'audio' in constraints ? constraints.audio : true;
  const mandatoryVideo = constraints && typeof constraints.video === 'object' ? constraints.video.mandatory : {};

  logger.info('Retrieving media a configuration', { enableVideo, screenSharing, isDesktop, withAudio, constraints });

  return {
    constraints: {
      // Exact constraint are not supported with `getDisplayMedia` and we must have a video=false in desktop screenshare
      audio: screenSharing ? !isDesktop : withAudio ? getAudioConstraints(true) : false,
      video: screenSharing ? isDesktop ? {
        mandatory: {
          chromeMediaSource: 'desktop',
          ...(mandatoryVideo || {}),
        },
      } : {
        cursor: 'always',
      } : getVideoConstraints(enableVideo),
      screen: screenSharing,
      desktop: isDesktop,
      conference,
    },
    enableVideo,
    conference,
    offerOptions: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: enableVideo,
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: enableVideo,
      },
    },
  };
};

export const getStreamFromConstraints = async (constraints: Record<string, any>, conference = false): Promise<MediaStream | null | undefined> => {
  const video = constraints && constraints.video;
  const { constraints: newConstraints } = getMediaConfiguration(video, conference, constraints);
  let newStream: MediaStream & { local?: boolean } | null = null;

  try {
    newStream = await wazoMediaStreamFactory(newConstraints);
  } catch (e: any) { // Nothing to do when the user cancel the screensharing prompt
  }

  if (!newStream) {
    return null;
  }

  newStream.local = true;
  return newStream;
};

export const createUaOptions = (config: WebRtcConfig, uaOptionsOverrides: UserAgentConfigOverrides = {}, audio: Constraint = false, video: Constraint = false): UserAgentOptions => {
  let { host } = config;
  let port: number | string = config.port || 443;

  if (config.websocketSip) {
    const webSocketSip = config.websocketSip.split(':');
    [host] = webSocketSip;
    port = Number(webSocketSip[1]);
  }
  const { userUuid } = config;

  const uaOptions: UserAgentOptions = {
    noAnswerTimeout: NO_ANSWER_TIMEOUT,
    authorizationUsername: config.authorizationUser,
    authorizationPassword: config.password,
    displayName: config.displayName,
    hackIpInContact: true,
    contactParams: {
      transport: 'wss',
    },
    logBuiltinEnabled: config.log ? config.log.builtinEnabled : null,
    logLevel: config.log ? config.log.logLevel : null,
    logConnector: config.log ? config.log.connector : null,
    uri: makeURI(config.authorizationUser || '', config.host),
    userAgentString: config.userAgentString || 'wazo-sdk',
    reconnectionAttempts: 10000,
    reconnectionDelay: 5,

    // @ts-ignore
    sessionDescriptionHandlerFactory: (sipCall: SipCall, options: SessionDescriptionHandlerFactoryOptions = {}) => {
      const uaLogger = sipCall.userAgent.getLogger('sip.WazoSessionDescriptionHandler');

      const iceGatheringTimeout = 'peerConnectionOptions' in options ? (options.peerConnectionOptions as any).iceGatheringTimeout || DEFAULT_ICE_TIMEOUT : DEFAULT_ICE_TIMEOUT;
      const sdhOptions: SessionDescriptionHandlerConfiguration = { ...options,
        iceGatheringTimeout,
        peerConnectionConfiguration: { ...defaultPeerConnectionConfiguration(),
          ...(options.peerConnectionConfiguration || {}),
        },
      };
      return new WazoSessionDescriptionHandler(uaLogger, wazoMediaStreamFactory, sdhOptions, isWeb(), sipCall as SipCall);
    },
    transportOptions: {
      traceSip: uaOptionsOverrides?.traceSip || false,
      wsServers: `wss://${host}:${port}/api/asterisk/ws${userUuid ? `?userUuid=${userUuid}` : ''}`,
    },
    sessionDescriptionHandlerFactoryOptions: {
      modifiers: [replaceLocalIpModifier],
      alwaysAcquireMediaFirst: isFirefox(),
      constraints: {
        audio: getAudioConstraints(audio),
        video: getVideoConstraints(video),
      },
      peerConnectionOptions: {
        iceCheckingTimeout: config.iceCheckingTimeout || 1000,
        iceGatheringTimeout: config.iceCheckingTimeout || 1000,
        rtcConfiguration: {
          rtcpMuxPolicy: 'require',
          iceServers: getIceServers(config.host),
          ...getRtcOptions(),
          ...(uaOptionsOverrides?.peerConnectionOptions || {}),
        },
      },
      // Configuration used in SDH to create the PeerConnection
      peerConnectionConfiguration: {
        rtcpMuxPolicy: 'require',
        iceServers: getIceServers(config.host),
        ...(uaOptionsOverrides?.peerConnectionOptions || {}),
      },
    },
  };

  delete uaOptionsOverrides?.traceSip;

  return {
    ...uaOptions,
    ...uaOptionsOverrides,
  };
};

export const downgradeToAudio = (sipCall: SipCall): void => {
  // Release local video stream when downgrading to audio
  const sessionDescriptionHandler = sipCall.sessionDescriptionHandler as SessionDescriptionHandler;
  const localStream = sessionDescriptionHandler?.localMediaStream;
  const pc = sessionDescriptionHandler?.peerConnection;
  const videoTracks = localStream.getVideoTracks();

  // Remove video senders
  if (pc?.getSenders) {
    pc.getSenders().filter((sender) => sender.track && sender.track.kind === 'video').forEach((videoSender) => {
      videoSender.replaceTrack(null);
    });
  }

  videoTracks.forEach((videoTrack: MediaStreamTrack) => {
    videoTrack.enabled = false;
    videoTrack.stop();
    localStream.removeTrack(videoTrack);
  });
};

// Returns true if a re-INVITE is required
export const upgradeToVideo = async (sipCall: SipCall, constraints: Record<string, any>, isConference: boolean): Promise<MediaStream | undefined> => {
  const pc = getPeerConnection(sipCall) as PeerConnection;
  // Check if a video sender already exists
  let videoSender;

  if (isConference) {
    // We search for the last transceiver without `video-` in the mid (video- means remote transceiver)
    const transceivers = pc?.getTransceivers() || [];
    const transceiverIdx = lastIndexOf(transceivers, transceiver => transceiver.sender.track === null && transceiver.mid && transceiver.mid.indexOf('video') === -1);
    videoSender = transceiverIdx !== -1 ? transceivers[transceiverIdx].sender : null;
  } else {
    videoSender = pc && pc.getSenders && pc.getSenders().find((sender) => sender.track === null);
  }

  if (!videoSender) {
    // When no video sender found, it means that we're in the first video upgrade in 1:1
    return;
  }

  // Reuse bidirectional video stream
  const newStream = await getStreamFromConstraints(constraints);

  if (!newStream) {
    console.warn(`Can't create media stream with: ${JSON.stringify(constraints || {})}`);
    return;
  }

  // Add previous local audio track
  if (constraints && !constraints.audio) {
    const localVideoStream: MediaStream = (sipCall.sessionDescriptionHandler as SessionDescriptionHandler)?.localMediaStream;
    const localAudioTrack = localVideoStream.getTracks().find(track => track.kind === 'audio');

    if (localAudioTrack) {
      newStream.addTrack(localAudioTrack);
    }
  }

  const videoTrack = newStream.getVideoTracks()[0];

  if (videoTrack) {
    videoSender.replaceTrack(videoTrack);
  }

  setLocalMediaStream(sipCall, newStream);
  return newStream;
};

export const fetchNetworkStats = async (sipCall: SipCall, lastNetworkStats: Record<string, any>): Promise<Record<string, any> | null | undefined> => {
  const stats = sipCall ? await getWebRtcStats(sipCall) : null;
  if (!stats) {
    return Promise.resolve(null);
  }

  const networkStats: Record<string, any> = {
    audioBytesSent: 0,
    videoBytesSent: 0,
    videoBytesReceived: 0,
    audioBytesReceived: 0,
  };
  const lastAudioSent = lastNetworkStats ? lastNetworkStats.audioBytesSent : 0;
  const lastAudioContentSent = lastNetworkStats ? lastNetworkStats.audioContentSent : 0;
  const lastVideoSent = lastNetworkStats ? lastNetworkStats.videoBytesSent : 0;
  const lastAudioReceived = lastNetworkStats ? lastNetworkStats.audioBytesReceived : 0;
  const lastAudioContentReceived = lastNetworkStats ? lastNetworkStats.audioContentReceived : 0;
  const lastVideoReceived = lastNetworkStats ? lastNetworkStats.videoBytesReceived : 0;
  const lastTransportSent = lastNetworkStats ? lastNetworkStats.transportSent : 0;
  const lastTransportReceived = lastNetworkStats ? lastNetworkStats.transportReceived : 0;
  let audioBytesSent = 0; // content + header

  let audioBytesReceived = 0; // content + header

  let audioContentSent = 0; // useful to detect blank call

  let audioContentReceived = 0;
  let videoBytesSent = 0;
  let videoBytesReceived = 0;
  let transportSent = 0;
  let transportReceived = 0;
  let packetsLost = 0;
  stats.forEach(report => {
    if (report.type === 'outbound-rtp' && report.kind === 'audio') {
      audioBytesSent += Number(report.bytesSent) + Number(report.headerBytesSent);
      audioContentSent += Number(report.bytesSent);
    }

    if (report.type === 'remote-outbound-rtp' && report.kind === 'audio') {
      audioBytesSent += Number(report.bytesSent);
    }

    if (report.type === 'outbound-rtp' && report.kind === 'video') {
      videoBytesSent += Number(report.bytesSent) + Number(report.headerBytesSent);
    }

    if (report.type === 'inbound-rtp' && report.kind === 'audio') {
      packetsLost += Number(report.packetsLost);
      networkStats.packetsReceived = Number(report.packetsReceived);
      audioBytesReceived += Number(report.bytesReceived) + Number(report.headerBytesReceived);
      audioContentReceived += Number(report.bytesReceived);
    }

    if (report.type === 'inbound-rtp' && report.kind === 'video') {
      videoBytesReceived += Number(report.bytesReceived) + Number(report.headerBytesReceived);
    }

    if (report.type === 'outbound-rtp' && report.kind === 'video') {
      if ('framesPerSecond' in report) {
        networkStats.framesPerSecond = Number(report.framesPerSecond);
      }

      if ('framerateMean' in report) {
        // framerateMean is only available in FF
        networkStats.framesPerSecond = Math.round(report.framerateMean);
      }
    }

    if (report.type === 'remote-inbound-rtp' && report.kind === 'audio') {
      packetsLost += Number(report.packetsLost);
      networkStats.roundTripTime = Number(report.roundTripTime);
      networkStats.jitter = Number(report.jitter);
    }

    if (report.type === 'remote-inbound-rtp' && report.kind === 'video') {
      packetsLost += Number(report.packetsLost);
    }

    if (report.type === 'transport') {
      transportSent += Number(report.bytesSent);
      transportReceived += Number(report.bytesReceived);
    }
  });
  networkStats.packetsLost = packetsLost;
  networkStats.totalAudioBytesSent = audioBytesSent;
  networkStats.audioBytesSent = audioBytesSent - lastAudioSent;
  networkStats.totalAudioBytesReceived = audioBytesReceived - lastAudioReceived;
  networkStats.audioBytesReceived = audioBytesReceived;
  networkStats.totalAudioContentSent = audioContentSent;
  networkStats.audioContentSent = audioContentSent - lastAudioContentSent;
  networkStats.totalAudioBytesReceived = audioContentReceived - lastAudioContentReceived;
  networkStats.audioContentReceived = audioContentReceived;
  networkStats.totalVideoBytesSent = videoBytesSent;
  networkStats.videoBytesSent = videoBytesSent - lastVideoSent;
  networkStats.totalVideoBytesReceived = videoBytesReceived;
  networkStats.videoBytesReceived = videoBytesReceived - lastVideoReceived;
  networkStats.totalTransportSent = transportSent - lastTransportSent;
  networkStats.transportSent = transportSent;
  networkStats.totalTransportReceived = transportReceived;
  networkStats.transportReceived = transportReceived - lastTransportReceived;
  networkStats.bandwidth = networkStats.audioBytesSent + networkStats.audioBytesReceived + networkStats.videoBytesSent + networkStats.videoBytesReceived + networkStats.transportReceived + networkStats.transportSent;

  return networkStats;
};
