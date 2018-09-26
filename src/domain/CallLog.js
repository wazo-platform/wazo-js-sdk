// @flow

import { Record } from 'immutable';
import moment from 'moment';

import Session from './Session';

type CallLogResponse = {
  answer: string,
  answered: boolean,
  call_direction: string,
  destination_extension: string,
  destination_name: ?string,
  duration: number,
  end: string,
  id: number,
  source_extension: string,
  source_name: string,
  start: string
};

type Response = {
  filtered: number,
  items: Array<CallLogResponse>,
  total: number
};

const CallLogRecord = Record({
  answer: undefined,
  answered: undefined,
  newMissedCall: false,
  callDirection: undefined,
  destination: undefined,
  source: undefined,
  id: undefined,
  duration: undefined,
  start: undefined,
  end: undefined
});

export default class CallLog extends CallLogRecord {
  answer: moment;
  answered: boolean;
  newMissedCall: boolean;
  callDirection: string;
  destination: {
    extension: string,
    name: string
  };

  source: {
    extension: string,
    name: string
  };

  id: number;
  duration: Number;
  start: moment;
  end: moment;

  static merge(current: Array<CallLog>, toMerge: Array<CallLog>): Array<?CallLog> {
    const onlyUnique = (value, index, self) => self.indexOf(value) === index;

    const allLogs: Array<CallLog> = current.concat(toMerge);
    const onlyUniqueIds: Array<number> = allLogs.map(c => c.id).filter(onlyUnique);

    return onlyUniqueIds.map(id => allLogs.find(log => log.id === id));
  }

  static parseMany(plain: Response): Array<CallLog> {
    return plain.items.map(item => CallLog.parse(item));
  }

  static parse(plain: CallLogResponse): CallLog {
    return new CallLog({
      answer: moment(plain.answer),
      answered: plain.answered,
      callDirection: plain.call_direction,
      destination: {
        extension: plain.destination_extension,
        name: plain.destination_name
      },
      source: {
        extension: plain.source_extension,
        name: plain.source_name
      },
      id: plain.id,
      duration: (plain.duration || 0) * 1000, // duration is in seconds
      start: moment(plain.start),
      end: moment(plain.end)
    });
  }

  static parseNew(plain: CallLogResponse, session: Session): CallLog {
    return new CallLog({
      answer: moment(plain.answer),
      answered: plain.answered,
      callDirection: plain.call_direction,
      destination: {
        extension: plain.destination_extension,
        name: plain.destination_name
      },
      source: {
        extension: plain.source_extension,
        name: plain.source_name
      },
      id: plain.id,
      duration: (plain.duration || 0) * 1000, // duration is in seconds
      start: moment(plain.start),
      end: moment(plain.end),
      // @TODO: FIXME add verification declined vs missed call
      newMissedCall: plain.destination_extension === session.primaryNumber() && !plain.answered
    });
  }

  isFromSameParty(other: CallLog, session: Session): boolean {
    return this.theOtherParty(session).extension === other.theOtherParty(session).extension;
  }

  theOtherParty(session: Session): { extension: string, name: string } {
    if (this.source.extension === session.primaryNumber()) {
      return this.destination;
    }
    return this.source;
  }

  isNewMissedCall(): boolean {
    return this.newMissedCall;
  }

  acknowledgeCall(): CallLog {
    return this.set('newMissedCall', false);
  }

  isAcknowledged(): boolean {
    return this.newMissedCall;
  }

  isAnOutgoingCall(session: Session): boolean {
    return this.source.extension === session.primaryNumber() && this.answered;
  }

  isAMissedOutgoingCall(session: Session): boolean {
    return this.source.extension === session.primaryNumber() && !this.answered;
  }

  isAnIncomingCall(session: Session): boolean {
    return this.destination.extension === session.primaryNumber() && this.answered;
  }

  isADeclinedCall(session: Session): boolean {
    return this.destination.extension === session.primaryNumber() && !this.answered;
  }
}
