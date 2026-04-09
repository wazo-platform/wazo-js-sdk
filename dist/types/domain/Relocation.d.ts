export type RelocationResponse = {
    completions: Array<string>;
    initiator: string;
    initiator_call: string;
    recipient_call: string;
    relocated_call: string;
    timeout: number;
};
type RelocationArguments = {
    initiatorCall?: string;
    recipientCall?: string | null | undefined;
    relocatedCall?: string | null | undefined;
};
declare class Relocation {
    static MIN_ENGINE_VERSION_REQUIRED: string;
    relocatedCall: string;
    initiatorCall: string;
    recipientCall: string;
    static parse(response: RelocationResponse): Relocation;
    constructor({ relocatedCall, initiatorCall, recipientCall, }: RelocationArguments);
}
export default Relocation;
//# sourceMappingURL=Relocation.d.ts.map