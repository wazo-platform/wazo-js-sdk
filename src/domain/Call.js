// @flow

import newFrom from '../utils/new-from';

type CallResponse = {
  call_id: string,
  peer_caller_id_name: string,
  peer_caller_id_number: string,
  status: string,
  creation_time: string
};

type CallArguments = {
  id: number,
  calleeName: string,
  calleeNumber: string,
  status: string,
  startingTime: Date
};

export default class Call {
  id: number;
  calleeName: string;
  calleeNumber: string;
  status: string;
  startingTime: Date;

  static parseMany(plain: Array<CallResponse>): Array<Call> {
    return plain.map((plainCall: CallResponse) => Call.parse(plainCall));
  }

  static parse(plain: CallResponse): Call {
    return new Call({
      id: +plain.call_id,
      calleeName: plain.peer_caller_id_name,
      calleeNumber: plain.peer_caller_id_number,
      status: plain.status,
      startingTime: new Date(plain.creation_time)
    });
  }

  static newFrom(profile: Call) {
    return newFrom(profile, Call);
  }

  constructor({ id, calleeName, calleeNumber, status, startingTime }: CallArguments = {}) {
    this.id = id;
    this.calleeName = calleeName;
    this.calleeNumber = calleeNumber;
    this.status = status;
    this.startingTime = startingTime;
  }

  separateCalleeName(): { firstName: string, lastName: string } {
    const names = this.calleeName.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');

    return { firstName, lastName };
  }

  is(other: Call): boolean {
    return this.id === other.id;
  }

  hasACalleeName(): boolean {
    return this.calleeName.length > 0;
  }

  isUp(): boolean {
    return this.status === 'Up';
  }

  isDown(): boolean {
    return this.status === 'Down';
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
}
