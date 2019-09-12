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
  requested_extension: string,
  start: string,
};

type Response = {
  filtered: number,
  items: Array<CallLogResponse>,
  total: number,
};

type CallLogArguments = {
  answer: Date,
  answered: boolean,
  newMissedCall?: boolean,
  callDirection: string,
  destination: {
    extension: string,
    name: string,
  },
  source: {
    extension: string,
    name: string,
  },
  id: number,
  duration: number,
  start: Date,
  end: Date,
};

export default class CallLog {
  type: string;

  answer: Date;
  answered: boolean;
  newMissedCall: boolean;
  callDirection: string;
  destination: {
    extension: string,
    name: string,
  };

  source: {
    extension: string,
    name: string,
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
        extension: plain.destination_extension || plain.requested_extension,
        name: plain.destination_name || '',
      },
      source: {
        extension: plain.source_extension,
        name: plain.source_name,
      },
      id: plain.id,
      duration: (plain.duration || 0) * 1000, // duration is in seconds
      start: moment(plain.start).toDate(),
      end: moment(plain.end).toDate(),
    });
  }

  static parseNew(plain: CallLogResponse, session: Session): CallLog {
    return new CallLog({
      answer: moment(plain.answer).toDate(),
      answered: plain.answered,
      callDirection: plain.call_direction,
      destination: {
        extension: plain.destination_extension || plain.requested_extension,
        name: plain.destination_name || '',
      },
      source: {
        extension: plain.source_extension,
        name: plain.source_name,
      },
      id: plain.id,
      duration: (plain.duration || 0) * 1000, // duration is in seconds
      start: moment(plain.start).toDate(),
      end: moment(plain.end).toDate(),
      // @TODO: FIXME add verification declined vs missed call
      newMissedCall: session && session.hasExtension(plain.destination_extension) && !plain.answered,
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
    end,
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

    // Useful to compare instead of instanceof with minified code
    this.type = 'CallLog';
  }

  isFromSameParty(other: CallLog, session: Session): boolean {
    return this.theOtherParty(session).extension === other.theOtherParty(session).extension;
  }

  theOtherParty(session: Session): { extension: string, name: string } {
    if (this.callDirection === 'inbound') {
      return this.source;
    }

    if (this.callDirection === 'outbound') {
      return this.destination;
    }

    return session.hasExtension(this.source.extension) ? this.destination : this.source;
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

  isAnswered(): boolean {
    return this.answered;
  }

  isOutgoing(session: Session): boolean {
    if (this.callDirection === 'internal') {
      return session.hasExtension(this.source.extension);
    }

    return this.callDirection === 'outbound';
  }

  isIncoming(session: Session): boolean {
    if (this.callDirection === 'internal') {
      return session.hasExtension(this.destination.extension);
    }

    return this.callDirection === 'inbound';
  }

  isAnOutgoingCall(session: Session): boolean {
    console.warn(`@wazo/sdk 
      CallLog.isAnOutgoingcall(session) method is obsolete.
      Please use CallLog.isOutgoing(session).
    `);

    return session.hasExtension(this.source.extension) && this.answered;
  }

  isAMissedOutgoingCall(session: Session): boolean {
    return session.hasExtension(this.source.extension) && !this.answered;
  }

  isAnIncomingCall(session: Session): boolean {
    console.warn(`@wazo/sdk
      CallLog.isAnIncomingCall(session) method is obsolete.
      Please use CallLog.isIncoming(session).
    `);

    return session.hasExtension(this.destination.extension) && this.answered;
  }

  isADeclinedCall(session: Session): boolean {
    return !this.answered && session.hasExtension(this.destination.extension);
  }
}
