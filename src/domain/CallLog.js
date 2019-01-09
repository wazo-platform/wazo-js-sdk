// @flow
import moment from 'moment';

import Session from './Session';
import newFrom from '../utils/new-from';

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

type CallLogArguments = {
  answer: Date,
  answered: boolean,
  newMissedCall?: boolean,
  callDirection: string,
  destination: {
    extension: string,
    name: string
  },
  source: {
    extension: string,
    name: string
  },
  id: number,
  duration: number,
  start: Date,
  end: Date
};

export default class CallLog {
  answer: Date;
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
  duration: number;
  start: Date;
  end: Date;

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
      answer: moment(plain.answer).toDate(),
      answered: plain.answered,
      callDirection: plain.call_direction,
      destination: {
        extension: plain.destination_extension,
        name: plain.destination_name || ''
      },
      source: {
        extension: plain.source_extension,
        name: plain.source_name
      },
      id: plain.id,
      duration: (plain.duration || 0) * 1000, // duration is in seconds
      start: moment(plain.start).toDate(),
      end: moment(plain.end).toDate()
    });
  }

  static parseNew(plain: CallLogResponse, session: Session): CallLog {
    return new CallLog({
      answer: moment(plain.answer).toDate(),
      answered: plain.answered,
      callDirection: plain.call_direction,
      destination: {
        extension: plain.destination_extension,
        name: plain.destination_name || ''
      },
      source: {
        extension: plain.source_extension,
        name: plain.source_name
      },
      id: plain.id,
      duration: (plain.duration || 0) * 1000, // duration is in seconds
      start: moment(plain.start).toDate(),
      end: moment(plain.end).toDate(),
      // @TODO: FIXME add verification declined vs missed call
      newMissedCall: plain.destination_extension === session.primaryNumber() && !plain.answered
    });
  }

  static newFrom(profile: CallLog) {
    return newFrom(profile, CallLog);
  }

  constructor({
    answer,
    answered,
    callDirection,
    destination,
    source,
    id,
    duration,
    start,
    end
  }: CallLogArguments = {}) {
    this.answer = answer;
    this.answered = answered;
    this.callDirection = callDirection;
    this.destination = destination;
    this.source = source;
    this.id = id;
    this.duration = duration;
    this.start = start;
    this.end = end;
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
    this.newMissedCall = false;

    return this;
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
    return !this.answered && session.allNumbers().some(number => number === this.destination.extension);
  }
}
