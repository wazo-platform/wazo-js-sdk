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
    parsedSdp.groups[bundleIndex].mids = parsedSdp.media.map((media, index) => index).join(' ');
  }

  return sdpParser.write(parsedSdp);
};

export const fixInactiveVideo = (sdp: string): string => {
  const parsedSdp = sdpParser.parse(sdp);
  if (parsedSdp.media[1].type === 'video' && parsedSdp.media[1].direction === 'inactive') {
    delete parsedSdp.media[1].direction;
  }

  return sdpParser.write(parsedSdp);
};

export const disableLocalVideo = (sdp: string): string => {
  const parsedSdp = sdpParser.parse(sdp);
  if (parsedSdp.media[1].type === 'video' && parsedSdp.media[1].port > 10) {
    parsedSdp.media[1].port = 0;
  }

  return sdpParser.write(parsedSdp);
};

export const removeLocalVideo = (sdp: string): string => {
  const parsedSdp = sdpParser.parse(sdp);
  if (parsedSdp.media[1].type === 'video' && parsedSdp.media[1].port > 10) {
    parsedSdp.media.splice(1, 1);
    return fixBundle(sdpParser.write(parsedSdp));
  }

  return sdp;
};

export const fixSdp = (sdp: string, candidates: Object[]): string => {
  const parsedSdp = sdpParser.parse(sdp);
  const mainCandidate = getSrflxOrRelay(candidates)[0];
  const ip = mainCandidate ? mainCandidate.ip : null;

  if (ip) {
    parsedSdp.origin.address = ip;
  }

  parsedSdp.media = parsedSdp.media.map(media => ({
    ...media,
    port: mainCandidate ? mainCandidate.port : media.port,
    candidates: (media.candidates || []).concat(candidates),
  }));

  let fixed = sdpParser.write(parsedSdp);

  if (ip) {
    fixed = fixed.replace(/IN IP4 0.0.0.0/g, `IN IP4 ${ip}`);
  }

  return fixed;
};
