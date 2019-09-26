// @flow

import Call from '../domain/Call';
import CallLog from '../domain/CallLog';
import Line from '../domain/Line';
import Session from '../domain/Session';
import Relocation from '../domain/Relocation';
import CallSession from '../domain/CallSession';

import getApiClient from './getApiClient';

export default class CallApi {
  static async fetchCallLogs(server: string, offset: number, limit: number): Promise<Call[]> {
    return getApiClient(server).callLogd.listCallLogs(offset, limit);
  }

  static async fetchActiveCalls(server: string): Promise<Call[]> {
    return getApiClient(server).ctidNg.listCalls();
  }

  static async fetchCallLogsFromDate(server: string, from: Date, number: string): Promise<CallLog[]> {
    return getApiClient(server).callLogd.listCallLogsFromDate(from, number);
  }

  static async search(server: string, query: string, limit: number): Promise<CallLog[]> {
    return getApiClient(server).callLogd.search(query, limit);
  }

  static async fetchSIP(server: string, session: Session, line: ?Line): Promise<any> {
    const lineToUse = line || session.primaryLine();
    return getApiClient(server).confd.getUserLineSip(session.uuid, lineToUse ? lineToUse.id : null);
  }

  static async cancelCall(server: string, session: Session, callSession: CallSession): Promise<void> {
    return getApiClient(server).ctidNg.cancelCall(callSession.callId);
  }

  static async makeCall(
    server: string,
    callFromLine: Line,
    extension: string,
    isMobile: boolean = false,
  ): Promise<?Call> {
    const lineId = callFromLine ? callFromLine.id : null;

    const response = await getApiClient(server).ctidNg.makeCall(extension, isMobile, lineId);
    return Call.parse(response);
  }

  static async relocateCall(
    server: string,
    callId: string,
    line: number,
    contactIdentifier?: string,
  ): Promise<Relocation> {
    return getApiClient(server).ctidNg.relocateCall(callId, 'line', line, contactIdentifier);
  }
}
