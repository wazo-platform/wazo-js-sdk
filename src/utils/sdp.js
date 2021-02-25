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

export const fixSdp = (sdp: string, candidates: Object[]): string => {
  const parsedSdp = sdpParser.parse(sdp);
  const mainCandidate = getSrflxOrRelay(candidates)[0];
  const ip = mainCandidate ? mainCandidate.ip : null;

  if (ip) {
    parsedSdp.origin.address = ip;
  }

  parsedSdp.media = parsedSdp.media.map(media => ({
    ...media,
    candidates: (media.candidates || []).concat(candidates),
  }));

  let fixed = sdpParser.write(parsedSdp);

  if (ip) {
    fixed = fixed.replace(/IN IP4 0.0.0.0/g, `IN IP4 ${ip}`);
  }

  return fixed;
};
