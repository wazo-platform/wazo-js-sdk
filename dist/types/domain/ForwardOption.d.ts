type Response = {
    destination: string;
    enabled: boolean;
};
export type ForwardName = 'busy' | 'noanswer' | 'unconditional';
export declare const FORWARD_KEYS: {
    BUSY: 'busy';
    NO_ANSWER: 'noanswer';
    UNCONDITIONAL: 'unconditional';
};
type ForwardOptionArguments = {
    destination?: string;
    enabled?: boolean;
    key?: ForwardName;
};
export default class ForwardOption {
    destination: string | undefined;
    enabled: boolean | undefined;
    key: ForwardName | undefined;
    static parse(plain: Response, key: ForwardName): ForwardOption;
    static newFrom(profile: ForwardOption): any;
    constructor({ destination, enabled, key, }?: ForwardOptionArguments);
    setDestination(number: string): ForwardOption;
    setEnabled(enabled: boolean): ForwardOption;
    is(other: ForwardOption): boolean;
}
export {};
//# sourceMappingURL=ForwardOption.d.ts.map