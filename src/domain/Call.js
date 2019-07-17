// @flow

import moment from 'moment';
import newFrom from '../utils/new-from';

type CallResponse = {
  call_id: string,
  sip_call_id: string,
  caller_id_name: string,
  caller_id_number: string,
  peer_caller_id_name: string,
  peer_caller_id_number: string,
  dialed_extension: string,
  status: string,
  is_caller: boolean,
  creation_time: string,
  on_hold: boolean,
};

type CallArguments = {
  id: string,
  sipCallId: string,
  isCaller: boolean,
  callerName: string,
  callerNumber: string,
  calleeName: string,
  calleeNumber: string,
  dialedExtension: string,
  onHold: boolean,
  status: string,
  startingTime: Date,
};

export default class Call {
  type: string;

  id: string;
  sipCallId: string;
  callerName: string;
  callerNumber: string;
  calleeName: string;
  calleeNumber: string;
  dialedExtension: string;
  isCaller: boolean;
  onHold: boolean;
  status: string;
  startingTime: Date;

  static parseMany(plain: Array<CallResponse>): Array<Call> {
    return plain.map((plainCall: CallResponse) => Call.parse(plainCall));
  }

  static parse(plain: CallResponse): Call {
    return new Call({
      id: plain.call_id,
      sipCallId: plain.sip_call_id,
      callerName: plain.caller_id_name,
      callerNumber: plain.caller_id_number,
      calleeName: plain.peer_caller_id_name,
      calleeNumber: plain.peer_caller_id_number,
      dialedExtension: plain.dialed_extension,
      isCaller: plain.is_caller,
      onHold: plain.on_hold,
      status: plain.status,
      startingTime: moment(plain.creation_time).toDate(),
    });
  }

  static newFrom(call: Call) {
    return newFrom(call, Call);
  }

  constructor({
    id,
    sipCallId,
    callerName,
    callerNumber,
    calleeName,
    calleeNumber,
    dialedExtension,
    isCaller,
    onHold,
    status,
    startingTime,
  }: CallArguments = {}) {
    this.id = id;
    this.sipCallId = sipCallId;
    this.callerName = callerName;
    this.callerNumber = callerNumber;
    this.calleeName = calleeName;
    this.calleeNumber = calleeNumber;
    this.dialedExtension = dialedExtension;
    this.onHold = onHold;
    this.isCaller = isCaller;
    this.status = status;
    this.startingTime = startingTime;

    // Useful to compare instead of instanceof with minified code
    this.type = 'Call';
  }

  getElapsedTimeInSeconds(): number {
    const now = Date.now();
    return (now - this.startingTime) / 1000;
  }

  separateCalleeName(): { firstName: string, lastName: string } {
    const names = this.calleeName.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');

    return { firstName, lastName };
  }

  is(other: ?Call): boolean {
    return !!other && this.id === other.id;
  }

  hasACalleeName(): boolean {
    return this.calleeName.length > 0;
  }

  hasNumber(number: string): boolean {
    return this.calleeNumber === number;
  }

  isUp(): boolean {
    return this.status === 'Up';
  }

  isDown(): boolean {
    return this.status === 'Down';
  }

  isRinging(): boolean {
    return this.isRingingIncoming() || this.isRingingOutgoing();
  }

  isRingingIncoming(): boolean {
    return this.status === 'Ringing';
  }

  isRingingOutgoing(): boolean {
    return this.status === 'Ring';
  }

  isFromTransfer(): boolean {
    return this.status === 'Down' || this.status === 'Ringing';
  }

  isOnHold(): boolean {
    return this.onHold;
  }

  putOnHold(): void {
    this.onHold = true;
  }

  resume(): void {
    this.onHold = false;
  }
}
