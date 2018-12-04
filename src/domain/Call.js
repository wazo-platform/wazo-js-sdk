// @flow

import moment from 'moment';
import newFrom from '../utils/new-from';

type CallResponse = {
  call_id: string,
  peer_caller_id_name: string,
  peer_caller_id_number: string,
  status: string,
  creation_time: string,
  on_hold: boolean,
  user_uuid: string,
};

type CallArguments = {
  id: number,
  calleeName: string,
  calleeNumber: string,
  onHold: boolean,
  status: string,
  startingTime: Date,
  originUuid: string,
};

export default class Call {
  id: number;
  calleeName: string;
  calleeNumber: string;
  onHold: boolean;
  status: string;
  startingTime: Date;
  originUuid: string;

  static parseMany(plain: Array<CallResponse>): Array<Call> {
    return plain.map((plainCall: CallResponse) => Call.parse(plainCall));
  }

  static parse(plain: CallResponse): Call {
    return new Call({
      id: +plain.call_id,
      calleeName: plain.peer_caller_id_name,
      calleeNumber: plain.peer_caller_id_number,
      onHold: plain.on_hold,
      status: plain.status,
      startingTime: moment(plain.creation_time).toDate(),
      originUuid: plain.user_uuid,
    });
  }

  static newFrom(call: Call) {
    return newFrom(call, Call);
  }

  constructor({ id, calleeName, calleeNumber, onHold, status, startingTime, originUuid }: CallArguments = {}) {
    this.id = id;
    this.calleeName = calleeName;
    this.calleeNumber = calleeNumber;
    this.onHold = onHold;
    this.status = status;
    this.startingTime = startingTime;
    this.originUuid = originUuid;
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

  isFrom(uuid: string): boolean {
    return this.originUuid === uuid;
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
