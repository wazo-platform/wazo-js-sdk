type Candidate = {
    foundation: string;
    component: string;
    protocol: string;
    priority: number;
    ip: string;
    port: number;
    type: string;
    relatedAddress?: string;
    relatedPort?: number;
    tcpType?: string;
};
export declare const parseCandidate: (line: string) => Candidate;
export {};
//# sourceMappingURL=webrtc.d.ts.map