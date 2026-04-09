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
export declare const getCandidates: (rawSdp?: string) => Candidate[];
export declare const parseCandidate: (candidate?: string) => Candidate | null;
export declare const areCandidateValid: (candidates: Candidate[]) => boolean;
export declare const isSdpValid: (sdp: string) => boolean;
export declare const fixBundle: (sdp: string) => string;
export declare const toggleVideoDirection: (sdp: string, direction: string | null | undefined) => string;
export declare const getVideoDirection: (sdp: string) => string | null | undefined;
export declare const deactivateVideoModifier: (rawDescription: Record<string, any>) => Promise<Record<string, any>>;
export declare const activateVideoModifier: (rawDescription: Record<string, any>) => Promise<Record<string, any>>;
export declare const hasAnActiveVideo: (sdp: string | null | undefined) => boolean;
export declare const fixSdp: (sdp: string, candidates: Candidate[], forcePort?: boolean) => string;
export declare const addIcesInAllBundles: (sdp: string) => string;
//# sourceMappingURL=sdp.d.ts.map