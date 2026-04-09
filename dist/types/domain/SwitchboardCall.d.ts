import CallSession from './CallSession';
export type SwitchboardCallItem = {
    caller_id_name: string;
    caller_id_number: string;
    id: string;
};
export type SwitchboardCallItems = {
    items: Array<SwitchboardCallItem>;
    switchboard_uuid: string;
};
export type SwitchboardAnwseredQueuedCall = {
    operator_call_id: string;
    queued_call_id: string;
    switchboard_uuid: string;
};
export type SwitchboardAnwseredHeldCall = {
    held_call_id: string;
    operator_call_id: string;
    switchboard_uuid: string;
};
type SwitchboardCallArguments = {
    id: string;
    callSession: CallSession | null | undefined;
    callerIdName: string | null | undefined;
    callerIdNumber: string | null | undefined;
    answerTime: Date | null | undefined;
    participantId: string | null | undefined;
    state: string;
    switchboardName: string;
    switchboardUuid: string;
};
export type SwitchboardCallResponse = {
    callSession: CallSession | null | undefined;
    caller_id_name: string | null | undefined;
    caller_id_number: string | null | undefined;
    id: string;
    participantId: string | null | undefined;
    startTime: Date | null | undefined;
    state: string;
    switchboardName: string;
    switchboardUuid: string;
};
declare class SwitchboardCall {
    static STATE: Record<string, any>;
    id: string;
    callSession: CallSession | null | undefined;
    callerIdName: string | null | undefined;
    callerIdNumber: string | null | undefined;
    answerTime: Date | null | undefined;
    participantId: string | null | undefined;
    state: string;
    switchboardName: string;
    switchboardUuid: string;
    type: string;
    static parse(plain: SwitchboardCallResponse): SwitchboardCall;
    constructor({ id, callSession, callerIdName, callerIdNumber, participantId, answerTime, state, switchboardName, switchboardUuid, }: SwitchboardCallArguments);
    updateFrom(switchboardCall: SwitchboardCall): void;
    getId(): string;
    static newFrom(switchboardCall: SwitchboardCall): any;
}
export default SwitchboardCall;
//# sourceMappingURL=SwitchboardCall.d.ts.map