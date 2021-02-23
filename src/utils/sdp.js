/* @flow */
import sdpParser from 'sdp-transform';

export const getCandidates = (rawSdp: string) => {
  const sdp = sdpParser.parse(rawSdp);

  return sdp.media.map(media => media.candidates).flat().filter(candidate => !!candidate);
};

export const isSdpValid = (sdp: string) => {
  const candidates = getCandidates(sdp);

  return candidates.filter(candidate => candidate.type === 'srflx' || candidate.type === 'relay').length > 0;
};
