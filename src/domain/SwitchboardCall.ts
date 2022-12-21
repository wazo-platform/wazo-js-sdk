import CallSession from './CallSession';
import newFrom from '../utils/new-from';
import updateFrom from '../utils/update-from';

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

class SwitchboardCall {
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

  static parse(plain: SwitchboardCallResponse): SwitchboardCall {
    return new SwitchboardCall({
      id: plain.id,
      callSession: plain.callSession || null,
      callerIdName: plain.caller_id_name || null,
      callerIdNumber: plain.caller_id_number || null,
      participantId: plain.participantId || null,
      answerTime: plain.startTime,
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
    answerTime,
    state,
    switchboardName,
    switchboardUuid,
  }: SwitchboardCallArguments = {}) {
    this.id = id;
    this.callSession = callSession;
    this.callerIdName = callerIdName;
    this.callerIdNumber = callerIdNumber;
    this.participantId = participantId;
    this.answerTime = answerTime;
    this.state = state;
    this.switchboardName = switchboardName;
    this.switchboardUuid = switchboardUuid;
    // Useful to compare instead of instanceof with minified code
    this.type = 'SwitchboardCall';
  }

  updateFrom(switchboardCall: SwitchboardCall) {
    updateFrom(this, switchboardCall);
  }

  getId() {
    return this.id;
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
