// @flow

import CallSession from './CallSession';
import newFrom from '../utils/new-from';
import updateFrom from '../utils/update-from';

export type SwitchboardCallItem = { caller_id_name: string, caller_id_number: string, id: string };

export type SwitchboardCallItems = {
  items: Array<SwitchboardCallItem>,
  switchboard_uuid: string,
};

export type SwitchboardAnwseredQueuedCall = {
  operator_call_id: string,
  queued_call_id: string,
  switchboard_uuid: string,
};

export type SwitchboardAnwseredHeldCall = {
  held_call_id: string,
  operator_call_id: string,
  switchboard_uuid: string,
};

type SwitchboardCallArguments = {
  id: string,
  callSession: ?CallSession,
  callerIdName: ?string,
  callerIdNumber: ?string,
  startTime: ?Date,
  participantId: ?string,
  state: string,
  switchboardName: string,
  switchboardUuid: string,
};

export type SwitchboardCallResponse = {
  callSession: ?CallSession,
  caller_id_name: ?string,
  caller_id_number: ?string,
  id: string,
  participantId: ?string,
  startTime: ?Date,
  state: string,
  switchboardName: string,
  switchboardUuid: string,
};

class SwitchboardCall {
  static STATE: Object;

  id: string;
  callSession: ?CallSession;
  callerIdName: ?string;
  callerIdNumber: ?string;
  startTime: ?Date;
  participantId: ?string;
  state: string;
  switchboardName: string;
  switchboardUuid: string;
  type: string;

  static parse(plain: SwitchboardCallResponse): SwitchboardCall {
    return new SwitchboardCall({
      id: plain.id,
      callSession: plain.callSession || null,
      callerIdName: plain.caller_id_name || null,
      callerIdNumber: plain.caller_id_number || null,
      participantId: plain.participantId || null,
      startTime: plain.startTime,
      state: plain.state,
      switchboardName: plain.switchboardName,
      switchboardUuid: plain.switchboardUuid,
    });
  }

  constructor({
    id,
    callSession,
    callerIdName,
    callerIdNumber,
    participantId,
    startTime,
    state,
    switchboardName,
    switchboardUuid,
  }: SwitchboardCallArguments = {}) {
    this.id = id;
    this.callSession = callSession;
    this.callerIdName = callerIdName;
    this.callerIdNumber = callerIdNumber;
    this.participantId = participantId;
    this.startTime = startTime;
    this.state = state;
    this.switchboardName = switchboardName;
    this.switchboardUuid = switchboardUuid;

    // Useful to compare instead of instanceof with minified code
    this.type = 'SwitchboardCall';
  }

  updateFrom(switchboardCall: SwitchboardCall) {
    updateFrom(this, switchboardCall);
  }

  static newFrom(switchboardCall: SwitchboardCall) {
    return newFrom(switchboardCall, SwitchboardCall);
  }
}

SwitchboardCall.STATE = {
  INCOMING: 'incoming',
  ONGOING: 'ongoing',
  HELD: 'held',
};

export default SwitchboardCall;
