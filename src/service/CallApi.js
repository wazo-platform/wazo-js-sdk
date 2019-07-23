// @flow

import Call from '../domain/Call';
import CallLog from '../domain/CallLog';
import Line from '../domain/Line';
import Session from '../domain/Session';
import Relocation from '../domain/Relocation';
import CallSession from '../domain/CallSession';

import getApiClient from './getApiClient';

export default class CallApi {
  static async fetchCallLogs(server: string, session: Session, offset: number, limit: number): Promise<Call[]> {
    return getApiClient(server).callLogd.listCallLogs(session.token, offset, limit);
  }

  static async fetchActiveCalls(server: string, session: Session): Promise<Call[]> {
    return getApiClient(server).ctidNg.listCalls(session.token);
  }

  async fetchCallLogsFromDate(server: string, token: string, from: Date, number: string): Promise<CallLog[]> {
    return getApiClient(server).callLogd.listCallLogsFromDate(token, from, number);
  }

  static async search(server: string, session: Session, query: string, limit: number): Promise<CallLog[]> {
    return getApiClient(server).callLogd.search(session.token, query, limit);
  }

  static async fetchSIP(server: string, session: Session, line: ?Line): Promise<any> {
    const lineToUse = line || session.primaryLine();
    return getApiClient(server).confd.getSIP(session.token, session.uuid, lineToUse ? lineToUse.id : null);
  }

  static async cancelCall(server: string, session: Session, callSession: CallSession): Promise<void> {
    return getApiClient(server).ctidNg.cancelCall(session.token, callSession.callId);
  }

  static async makeCall(server: string, session: Session, callFromLine: Line, extension: string): Promise<?Call> {
    if (!callFromLine) {
      return null;
    }
    const response = await getApiClient(server).ctidNg.makeCall(session.token, extension, false, callFromLine.id);
    return Call.parse(response);
  }

  static async relocateCall(
    server: string,
    session: Session,
    callId: string,
    line: number,
    contactIdentifier?: string,
  ): Promise<Relocation> {
    return getApiClient(server).ctidNg.relocateCall(session.token, callId, 'line', line, contactIdentifier);
  }
}
