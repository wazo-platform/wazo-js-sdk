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

export const areCandidateValid = (candidates: Object[]): boolean =>
  candidates
    .filter(candidate => candidate && (candidate.type === 'srflx' || candidate.type === 'relay'))
    .length > 0;

export const isSdpValid = (sdp: ?string): boolean => {
  const candidates = getCandidates(sdp);

  return areCandidateValid(candidates);
};
