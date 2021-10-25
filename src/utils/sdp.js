/* @flow */
import sdpParser from 'sdp-transform';

export const getCandidates = (rawSdp: ?string): Object[] => {
  if (!rawSdp) {
    return [];
  }

  const sdp = sdpParser.parse(rawSdp);
  if (!sdp || !sdp.media) {
    return [];
  }

  return sdp.media.map(media => media.candidates).flat().filter(candidate => !!candidate);
};

export const parseCandidate = (candidate: ?string): ?Object => {
  if (!candidate) {
    return null;
  }
  const result = sdpParser.parse(candidate.indexOf('a=') === 0 ? candidate : `a=${candidate}`);

  return result.candidates ? result.candidates[0] : null;
};

const getSrflxOrRelay = (candidates: Object[]): Object[] =>
  candidates
    .filter(candidate => candidate && (candidate.type === 'srflx' || candidate.type === 'relay'));

export const areCandidateValid = (candidates: Object[]): boolean =>
  getSrflxOrRelay(candidates)
    .length > 0;

export const isSdpValid = (sdp: ?string): boolean => {
  const candidates = getCandidates(sdp);

  return areCandidateValid(candidates);
};

export const fixBundle = (sdp: string): string => {
  const parsedSdp = sdpParser.parse(sdp);
  const bundleIndex = parsedSdp.groups.findIndex(group => group.type === 'BUNDLE');
  if (bundleIndex !== -1) {
    parsedSdp.groups[bundleIndex].mids = parsedSdp.media
      .map((media, index) => ('mid' in media ? media.mid : index)).join(' ');
  }

  return sdpParser.write(parsedSdp);
};

export const toggleVideoDirection = (sdp: string, direction: ?string): string => {
  const parsedSdp = sdpParser.parse(sdp);
  parsedSdp.media = parsedSdp.media.map(media => ({
    ...media,
    ...(media.type === 'video' ? { direction } : {}),
  }));

  return sdpParser.write(parsedSdp);
};

export const getVideoDirection = (sdp: string): ?string => {
  const parsedSdp = sdpParser.parse(sdp);
  const videoMedia = parsedSdp.media.find(media => media.type === 'video');
  if (!videoMedia) {
    return null;
  }

  return videoMedia.direction;
};

export const deactivateVideoModifier = (rawDescription: Object): Promise<Object> => {
  const description = rawDescription;
  description.sdp = toggleVideoDirection(description.sdp, 'inactive');

  return Promise.resolve(description);
};

export const activateVideoModifier = (rawDescription: Object): Promise<Object> => {
  const description = rawDescription;
  description.sdp = toggleVideoDirection(description.sdp, 'sendrecv');

  return Promise.resolve(description);
};

export const hasAnActiveVideo = (sdp: ?string): boolean => {
  if (!sdp) {
    return false;
  }

  const parsedSdp = sdpParser.parse(sdp);

  return !!parsedSdp.media.find(media =>
    media.type === 'video' && media.port > 10 && (!media.direction || media.direction !== 'inactive'));
};

export const fixSdp = (sdp: string, candidates: Object[], forcePort: boolean = true): string => {
  const parsedSdp = sdpParser.parse(sdp);
  const mainCandidate = getSrflxOrRelay(candidates)[0];
  const ip = mainCandidate ? mainCandidate.ip : null;

  if (ip) {
    parsedSdp.origin.address = ip;
  }

  parsedSdp.media = parsedSdp.media.map(media => {
    const port = forcePort ? (mainCandidate ? mainCandidate.port : media.port) : media.port;
    return {
      ...media,
      port,
      candidates: (media.candidates || []).concat(candidates),
      direction: port < 10 ? 'inactive' : media.direction,
    };
  });

  let fixed = sdpParser.write(parsedSdp);

  if (ip) {
    fixed = fixed.replace(/IN IP4 0.0.0.0/g, `IN IP4 ${ip}`);
  }

  return fixed;
};
