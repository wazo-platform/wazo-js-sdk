import sdpParser from 'sdp-transform';

export type Candidate = {
  foundation: string;
  component: number;
  transport: string;
  priority: number | string;
  ip: string;
  port: number;
  type: string;
  raddr?: string | undefined;
  rport?: number | undefined;
  tcptype?: string | undefined;
  generation?: number | undefined;
  'network-id'?: number | undefined;
  'network-cost'?: number | undefined;
};

export const getCandidates = (rawSdp?: string): Candidate[] => {
  if (!rawSdp) {
    return [];
  }

  const sdp = sdpParser.parse(rawSdp);

  if (!sdp || !sdp.media) {
    return [];
  }

  // @ts-ignore: Type 'undefined' is not assignable to type 'Candidate'
  return sdp.media.map((media) => media.candidates).flat().filter((candidate) => !!candidate);
};
export const parseCandidate = (candidate?: string): Candidate | null => {
  if (!candidate) {
    return null;
  }

  const result = sdpParser.parse(candidate.indexOf('a=') === 0 ? candidate : `a=${candidate}`);
  // @ts-ignore: heads up -- Property 'candidates' does not exist on type 'SessionDescription'
  return result.candidates ? result.candidates[0] : null;
};

const getSrflxOrRelay = (candidates: Candidate[]): Candidate[] => candidates.filter(candidate => candidate && (candidate.type === 'srflx' || candidate.type === 'relay'));

export const areCandidateValid = (candidates: Candidate[]): boolean => (candidates ? getSrflxOrRelay(candidates).length > 0 : false);
export const isSdpValid = (sdp: string): boolean => {
  const candidates = getCandidates(sdp);
  return areCandidateValid(candidates);
};
export const fixBundle = (sdp: string): string => {
  const parsedSdp = sdpParser.parse(sdp);
  const bundleIndex = parsedSdp.groups?.findIndex((group) => group.type === 'BUNDLE');

  if (bundleIndex !== -1) {
    // @ts-ignore
    parsedSdp.groups[bundleIndex].mids = parsedSdp.media.map((media, index) => ('mid' in media ? media.mid : index)).join(' ');
  }

  return sdpParser.write(parsedSdp);
};
export const toggleVideoDirection = (sdp: string, direction: string | null | undefined): string => {
  const parsedSdp = sdpParser.parse(sdp);
  // @ts-ignore: heads up -- odd rewriting of sdp.media
  parsedSdp.media = parsedSdp.media.map(media => ({ ...media,
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
export const fixSdp = (sdp: string, candidates: Candidate[], forcePort = true): string => {
  const parsedSdp = sdpParser.parse(sdp);
  const mainCandidate = getSrflxOrRelay(candidates as Candidate[])[0];
  const ip = mainCandidate ? mainCandidate.ip : null;

  if (ip) {
    // @ts-ignore
    parsedSdp.origin.address = ip;
  }

  parsedSdp.media = parsedSdp.media.map((media) => {
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
