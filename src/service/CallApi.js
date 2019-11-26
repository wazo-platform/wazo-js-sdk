// @flow

import Call from '../domain/Call';
import CallLog from '../domain/CallLog';
import Line from '../domain/Line';
import Session from '../domain/Session';
import Relocation from '../domain/Relocation';
import CallSession from '../domain/CallSession';

import getApiClient from './getApiClient';

export default class CallApi {
  static async fetchCallLogs(offset: number, limit: number): Promise<Call[]> {
    return getApiClient().callLogd.listCallLogs(offset, limit);
  }

  static async fetchDistinctCallLogs(offset: number, limit: number, distinct: string = 'peer_exten'): Promise<Call[]> {
    return getApiClient().callLogd.listDistinctCallLogs(offset, limit, distinct);
  }

  static async fetchActiveCalls(): Promise<Call[]> {
    return getApiClient().ctidNg.listCalls();
  }

  static async fetchCallLogsFromDate(from: Date, number: string): Promise<CallLog[]> {
    return getApiClient().callLogd.listCallLogsFromDate(from, number);
  }

  static async search(query: string, limit: number): Promise<CallLog[]> {
    return getApiClient().callLogd.search(query, limit);
  }

  static async fetchSIP(session: Session, line: ?Line): Promise<any> {
    const lineToUse = line || session.primaryLine();
    return getApiClient().confd.getUserLineSip(session.uuid, lineToUse ? lineToUse.id : null);
  }

  static async cancelCall(callSession: CallSession): Promise<void> {
    return getApiClient().ctidNg.cancelCall(callSession.callId);
  }

  static async makeCall(callFromLine: Line, extension: string, isMobile: boolean = false): Promise<?Call> {
    const lineId = callFromLine ? callFromLine.id : null;

    const response = await getApiClient().ctidNg.makeCall(extension, isMobile, lineId);
    return Call.parse(response);
  }

  static async relocateCall(callId: string, line: number, contactIdentifier?: string): Promise<Relocation> {
    return getApiClient().ctidNg.relocateCall(callId, 'line', line, contactIdentifier);
  }
}
