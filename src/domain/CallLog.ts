import moment from 'moment';
import newFrom from '../utils/new-from';
import Session from './Session';
import type { RecordingResponse } from './Recording';
import Recording from './Recording';
import { ApiParams } from '../types/api';

// note: 24.14 fixes requested (first contact reached) and destination (last contact reached)
export const CALL_LOG_VALID_REQUESTED_VERSION = '24.14';

export type CallLogResponse = {
  answer: string | null | undefined;
  answered: boolean;
  call_direction: CallDirection;
  destination_extension: string;
  destination_name: string;
  destination_user_uuid: string | null;
  duration: number;
  end: string | null | undefined;
  id: number;
  source_extension: string;
  source_name: string;
  source_user_uuid: string | null;
  recordings: RecordingResponse[];
  requested_extension: string;
  requested_name: string;
  requested_user_uuid: string | null;
  start: string;
};

export type Response = {
  filtered: number;
  items: Array<CallLogResponse>;
  total: number;
};

export type CallDirection = 'internal' | 'inbound' | 'outbound';

export type CallStatus = 'answered' | 'blocked' | 'unknown';

type LogOrigin = {
  extension: string;
  name: string;
  uuid?: string | null;
};

type DestinationLogOrigin = LogOrigin & {
  plainExtension: string;
  plainName: string | null;
};

type CallLogArguments = {
  answer: Date | null | undefined;
  answered: boolean;
  newMissedCall?: boolean;
  callDirection: CallDirection;
  destination: DestinationLogOrigin;
  requested: LogOrigin;
  source: LogOrigin;
  id: number;
  duration: number;
  start: Date;
  end: Date | null | undefined;
  recordings: Recording[];
};

type CallLogSpecificQueryParams = {
  call_direction?: CallDirection;
  call_status?: CallStatus;
  number?: string;
  tags?: string[];
  user_uuid?: string;
  from_id?: number;
  distinct?: string;
  recorded?: boolean;
  conversation_id?: string;
};

export type CallLogQueryParams = ApiParams<CallLogSpecificQueryParams>;

export default class CallLog {
  type: string;

  answer: Date | null | undefined;

  answered: boolean;

  newMissedCall: boolean;

  callDirection: CallDirection;

  destination: DestinationLogOrigin;

  requested: LogOrigin;

  recordings: Recording[];

  source: LogOrigin;

  id: number;

  duration: number;

  start: Date;

  end: Date | null | undefined;

  static merge(current: Array<CallLog>, toMerge: Array<CallLog>): Array<CallLog | null | undefined> {
    const onlyUnique = (value: number, index: number, self: number[]) => self.indexOf(value) === index;

    const allLogs: Array<CallLog> = current.concat(toMerge);
    const onlyUniqueIds: Array<number> = allLogs.map(c => c.id).filter(onlyUnique);
    return onlyUniqueIds.map(id => allLogs.find(log => log && log.id === id));
  }

  static parseMany(plain: Response): Array<CallLog> {
    if (!plain || !plain.items) {
      return [];
    }

    return plain.items.map(item => CallLog.parse(item));
  }

  static parse(plain: CallLogResponse): CallLog {
    return new CallLog({
      answer: plain.answer ? moment(plain.answer).toDate() : null,
      answered: plain.answered,
      callDirection: plain.call_direction,
      destination: {
        // @TEMP: Temporarily assuming empty numbers are meetings
        // which is admittedly a very dangerous assumption. Did i mention it was temporary?
        uuid: plain.destination_user_uuid,
        name: plain.requested_name || plain.destination_name || '',
        extension: plain.requested_extension || plain.destination_extension || `meeting-${plain.requested_name || plain.destination_name || ''}`,
        plainExtension: plain.destination_extension,
        plainName: plain.destination_name,
      },
      requested: {
        uuid: plain.requested_user_uuid,
        name: plain.requested_name || '',
        extension: plain.requested_extension,
      },
      source: {
        uuid: plain.source_user_uuid,
        name: plain.source_name,
        extension: plain.source_extension,
      },
      id: plain.id,
      duration: (plain.duration || 0) * 1000,
      // duration is in seconds
      start: moment(plain.start).toDate(),
      end: plain.end ? moment(plain.end).toDate() : null,
      recordings: Recording.parseMany(plain.recordings || []),
    });
  }

  static parseNew(plain: CallLogResponse, session: Session): CallLog {
    const callLog: CallLog = CallLog.parse(plain);
    callLog.newMissedCall = session && plain.destination_user_uuid === session.uuid && !plain.answered;
    return callLog;
  }

  static newFrom(profile: CallLog) {
    return newFrom(profile, CallLog);
  }

  constructor({
    answer,
    answered,
    callDirection,
    destination,
    requested,
    source,
    id,
    duration,
    start,
    end,
    recordings,
  }: CallLogArguments) {
    this.answer = answer;
    this.answered = answered;
    this.callDirection = callDirection;
    this.destination = destination;
    this.requested = requested;
    this.source = source;
    this.id = id;
    this.duration = duration;
    this.start = start;
    this.end = end;
    this.recordings = recordings || [];
    // Useful to compare instead of instanceof with minified code
    this.type = 'CallLog';
  }

  isFromSameParty(other: CallLog, session: Session): boolean {
    return this.theOtherParty(session).extension === other.theOtherParty(session).extension;
  }

  theOtherParty(session: Session): LogOrigin {
    if (this.callDirection === 'inbound') {
      return this.source;
    }

    if (this.callDirection === 'outbound') {
      return this.destination;
    }

    return session?.hasExtension(this.source.extension) ? this.destination : this.source;
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
      return session.hasExtension(this.destination.plainExtension)
        || session.hasExtension(this.requested.extension)
        || session.uuid === this.destination.uuid
        || session.uuid === this.requested.uuid;
    }

    return this.callDirection === 'inbound';
  }

  // Example of call flow: User A => User B (No anwser forward) => User C or external number
  isIncomingAndForwarded(session: Session): boolean {
    if (!session.hasEngineVersionGte(CALL_LOG_VALID_REQUESTED_VERSION) || !this.isIncoming(session)) {
      return false;
    }

    return this.requested.extension !== this.destination.plainExtension;
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

  getRecordings() {
    return this.recordings;
  }

}
