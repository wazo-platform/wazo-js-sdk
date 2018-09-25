// @flow

import { Record } from 'immutable';
import moment from 'moment';

type CallResponse = {
  call_id: string,
  peer_caller_id_name: string,
  peer_caller_id_number: string,
  status: string,
  creation_time: string
};

const CallRecord = Record({
  id: undefined,
  calleeName: undefined,
  calleeNumber: undefined,
  status: undefined,
  startingTime: undefined
});

export default class Call extends CallRecord {
  id: number;
  calleeName: string;
  calleeNumber: string;
  status: string;
  startingTime: moment;

  static parseMany(plain: Array<CallResponse>): Array<Call> {
    return plain.map((plainCall: CallResponse) => Call.parse(plainCall));
  }

  static parse(plain: CallResponse): Call {
    return new Call({
      id: plain.call_id,
      calleeName: plain.peer_caller_id_name,
      calleeNumber: plain.peer_caller_id_number,
      status: plain.status,
      startingTime: moment(plain.creation_time)
    });
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
