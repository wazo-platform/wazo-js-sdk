import CallSession from './CallSession';
export type IndirectTransferArguments = {
    status?: string;
    id?: string;
    destinationId: string;
    sourceId: string;
};
type Reponse = {
    id: string;
    initiator_uuid: string;
    transferred_call: string;
    initiator_call: string;
    recipient_call: string;
    status: string;
    flow: string;
};
export default class IndirectTransfer {
    status: string | null | undefined;
    id: string | null | undefined;
    sourceId: string;
    destinationId: string;
    constructor({ sourceId, destinationId, status, id, }: IndirectTransferArguments);
    static parseFromCallSession(source: CallSession, destination: CallSession): IndirectTransfer;
    static parseFromApi(plain: Reponse): IndirectTransfer;
    destinationIs(callSession: CallSession): boolean;
    sourceIs(callSession: CallSession): boolean;
    updateFrom(indirectTransfer: IndirectTransfer): void;
    static newFrom(indirectTransfer: IndirectTransfer): any;
}
export {};
//# sourceMappingURL=IndirectTransfer.d.ts.map