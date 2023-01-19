import sdpParser from 'sdp-transform';

export const getCandidates = (rawSdp: string | null | undefined): Record<string, any>[] => {
  if (!rawSdp) {
    return [];
  }

  const sdp: any = sdpParser.parse(rawSdp);

  if (!sdp || !sdp.media) {
    return [];
  }

  return sdp.media.map((media: any) => media.candidates).flat().filter((candidate: any) => !!candidate);
};
export const parseCandidate = (candidate?: string): Record<string, any> | null => {
  if (!candidate) {
    return null;
  }

  const result: any = sdpParser.parse(candidate.indexOf('a=') === 0 ? candidate : `a=${candidate}`);
  return result.candidates ? result.candidates[0] : null;
};

const getSrflxOrRelay = (candidates: Record<string, any>[]): Record<string, any>[] => candidates.filter(candidate => candidate && (candidate.type === 'srflx' || candidate.type === 'relay'));

export const areCandidateValid = (candidates: Record<string, any>[]): boolean => getSrflxOrRelay(candidates).length > 0;
export const isSdpValid = (sdp: string | null | undefined): boolean => {
  const candidates = getCandidates(sdp);
  return areCandidateValid(candidates);
};
export const fixBundle = (sdp: string): string => {
  const parsedSdp: any = sdpParser.parse(sdp);
  const bundleIndex = parsedSdp.groups.findIndex((group: any) => group.type === 'BUNDLE');

  if (bundleIndex !== -1) {
    parsedSdp.groups[bundleIndex].mids = parsedSdp.media.map((media: any, index: any) => ('mid' in media ? media.mid : index)).join(' ');
  }

  return sdpParser.write(parsedSdp);
};
export const toggleVideoDirection = (sdp: string, direction: string | null | undefined): string => {
  const parsedSdp: any = sdpParser.parse(sdp);
  parsedSdp.media = parsedSdp.media.map((media: any) => ({ ...media,
    ...(media.type === 'video' ? {
      direction,
    } : {}),
  }));
  return sdpParser.write(parsedSdp);
};
export const getVideoDirection = (sdp: string): string | null | undefined => {
  const parsedSdp = sdpParser.parse(sdp);
  const videoMedia = parsedSdp.media.find(media => media.type === 'video');

  if (!videoMedia) {
    return null;
  }

  return videoMedia.direction;
};
export const deactivateVideoModifier = (rawDescription: Record<string, any>): Promise<Record<string, any>> => {
  const description = rawDescription;
  description.sdp = toggleVideoDirection(description.sdp, 'inactive');
  return Promise.resolve(description);
};
export const activateVideoModifier = (rawDescription: Record<string, any>): Promise<Record<string, any>> => {
  const description = rawDescription;
  description.sdp = toggleVideoDirection(description.sdp, 'sendrecv');
  return Promise.resolve(description);
};
export const hasAnActiveVideo = (sdp: string | null | undefined): boolean => {
  if (!sdp) {
    return false;
  }

  const parsedSdp = sdpParser.parse(sdp);
  return !!parsedSdp.media.find(media => media.type === 'video' && media.port > 10 && (!media.direction || media.direction !== 'inactive'));
};
export const fixSdp = (sdp: string, candidates: Record<string, any>[], forcePort = true): string => {
  const parsedSdp: any = sdpParser.parse(sdp);
  const mainCandidate = getSrflxOrRelay(candidates)[0];
  const ip = mainCandidate ? mainCandidate.ip : null;

  if (ip) {
    parsedSdp.origin.address = ip;
  }

  parsedSdp.media = parsedSdp.media.map((media: any) => {
    const port = forcePort ? mainCandidate ? mainCandidate.port : media.port : media.port;
    return { ...media,
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
export const addIcesInAllBundles = (sdp: string) => {
  const parsedSdp = sdpParser.parse(sdp);
  const mediaWithCandidate = parsedSdp.media.find(media => !!media.candidates);

  if (!mediaWithCandidate) {
    return sdp;
  }

  const {
    candidates,
  } = mediaWithCandidate;
  parsedSdp.media = parsedSdp.media.map(media => ({ ...media,
    candidates: media.candidates || candidates,
  }));
  return sdpParser.write(parsedSdp);
};
