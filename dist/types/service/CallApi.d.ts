import Call from '../domain/Call';
import CallLog from '../domain/CallLog';
import Line from '../domain/Line';
import Session from '../domain/Session';
import Relocation from '../domain/Relocation';
import CallSession from '../domain/CallSession';
import Transfer from '../domain/IndirectTransfer';
export default class CallApi {
    static fetchCallLogs(offset: number, limit?: number): Promise<CallLog[]>;
    static fetchDistinctCallLogs(offset: number, limit: number, distinct?: string): Promise<CallLog[]>;
    static fetchActiveCalls(): Promise<Call[]>;
    static fetchCallLogsFromDate(from: Date, number: string): Promise<CallLog[]>;
    static search(query: string, limit?: number): Promise<CallLog[]>;
    static searchBy(field: string, value: string, limit?: number): Promise<CallLog[]>;
    static fetchSIP(session: Session, line: Line | null | undefined): Promise<any>;
    static cancelCall(callSession: CallSession): Promise<boolean>;
    static makeCall(callFromLine: Line, extension: string, isMobile?: boolean, callbackAllLines?: boolean): Promise<Call | null | undefined>;
    static relocateCall(callId: string, line: number, contactIdentifier?: string): Promise<Relocation>;
    static hold(callId: string): Promise<boolean>;
    static resume(callId: string): Promise<boolean>;
    static mute(callId: string): Promise<boolean>;
    static sendDTMF(callId: string, digits: string): Promise<boolean>;
    static unmute(callId: string): Promise<boolean>;
    static transferCall(callId: string, number: string, flow: string): Promise<Transfer>;
    static cancelCallTransfer(transferId: string): Promise<boolean>;
    static confirmCallTransfer(transferId: string): Promise<boolean>;
}
//# sourceMappingURL=CallApi.d.ts.map