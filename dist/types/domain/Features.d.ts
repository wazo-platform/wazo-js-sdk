export declare const FEATURES: string[];
export declare const getScopeName: (featureName: string) => string;
declare class Features {
    _hasChat: boolean;
    _hasVideo: boolean;
    _hasCallRecording: boolean;
    _hasFax: boolean;
    _hasMobileDoubleCall: boolean;
    _hasMobileGsm: boolean;
    _hasMeeting: boolean;
    _hasCallerID: boolean;
    constructor();
    fetchAccess(): Promise<void>;
    hasChat(): boolean;
    hasVideo(): boolean;
    hasCallRecording(): boolean;
    hasFax(): boolean;
    hasMobileDoubleCall(): boolean;
    hasMobileGsm(): boolean;
    hasMeeting(): boolean;
    hasCallerID(): boolean;
    _hasFeatures(scopes: Record<string, any>, featureName: string): boolean;
}
declare const _default: Features;
export default _default;
//# sourceMappingURL=Features.d.ts.map