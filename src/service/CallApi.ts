import ApiCall from '../domain/Call';
import Call from '../voice/call';
import CallLog from '../domain/CallLog';
import Line from '../domain/Line';
import Session from '../domain/Session';
import Relocation from '../domain/Relocation';
import getApiClient from './getApiClient';
import Transfer from '../domain/IndirectTransfer';

export default class CallApi {
  static async fetchCallLogs(offset: number, limit?: number): Promise<CallLog[]> {
    return getApiClient().callLogd.listCallLogs(offset, limit);
  }

  static async fetchDistinctCallLogs(offset: number, limit: number, distinct = 'peer_exten'): Promise<CallLog[]> {
    return getApiClient().callLogd.listDistinctCallLogs(offset, limit, distinct);
  }

  static async fetchActiveCalls(): Promise<ApiCall[]> {
    return getApiClient().calld.listCalls();
  }

  static async fetchCallLogsFromDate(from: Date, number: string): Promise<CallLog[]> {
    return getApiClient().callLogd.listCallLogsFromDate(from, number);
  }

  static async search(query: string, limit?: number): Promise<CallLog[]> {
    return getApiClient().callLogd.search(query, limit);
  }

  static async searchBy(field: string, value: string, limit?: number): Promise<CallLog[]> {
    return getApiClient().callLogd.searchBy(field, value, limit);
  }

  static async fetchSIP(session: Session, line: Line | null | undefined): Promise<any> {
    const lineToUse = line || session.primaryLine();
    return getApiClient().confd.getUserLineSip(session.uuid as string, lineToUse ? <unknown>lineToUse.id as string : '');
  }

  static async cancelCall(call: Call): Promise<boolean> {
    return getApiClient().calld.cancelCall(call.apiId || '');
  }

  static async makeCall(callFromLine: Line, extension: string, isMobile = false, callbackAllLines = false): Promise<ApiCall | null | undefined> {
    const lineId = callFromLine ? callFromLine.id : null;
    const response = await getApiClient().calld.makeCall(extension, isMobile, lineId, callbackAllLines);
    return ApiCall.parse(response);
  }

  static async relocateCall(callId: string, line: number, contactIdentifier?: string): Promise<Relocation> {
    return getApiClient().calld.relocateCall(callId, 'line', line, contactIdentifier);
  }

  static async hold(callId: string): Promise<boolean> {
    return getApiClient().calld.hold(callId);
  }

  static async resume(callId: string): Promise<boolean> {
    return getApiClient().calld.resume(callId);
  }

  static async mute(callId: string): Promise<boolean> {
    return getApiClient().calld.mute(callId);
  }

  static async sendDTMF(callId: string, digits: string): Promise<boolean> {
    return getApiClient().calld.sendDTMF(callId, digits);
  }

  static async unmute(callId: string): Promise<boolean> {
    return getApiClient().calld.unmute(callId);
  }

  static async transferCall(callId: string, number: string, flow: string): Promise<Transfer> {
    return getApiClient().calld.transferCall(callId, number, flow);
  }

  static async cancelCallTransfer(transferId: string): Promise<boolean> {
    return getApiClient().calld.cancelCallTransfer(transferId);
  }

  static async confirmCallTransfer(transferId: string): Promise<boolean> {
    return getApiClient().calld.confirmCallTransfer(transferId);
  }

}
