// @flow

import moment from 'moment';
import { Record } from 'immutable';

type MessageResponse = {
  caller_id_name: string,
  caller_id_num: string,
  duration: Number,
  id: string,
  folder: Object,
  timestamp: number
};

type Response = {
  id: string,
  name: string,
  number: string,
  folders: Array<{
    id: string,
    name: string,
    type: string,
    messages: Array<MessageResponse>
  }>
};

const VoicemailRecord = Record({
  id: undefined,
  date: undefined,
  duration: undefined,
  caller: {
    name: undefined,
    number: undefined
  },
  unread: undefined
});

export default class Voicemail extends VoicemailRecord {
  id: string;
  date: moment;
  duration: moment.Duration;
  caller: {
    name: string,
    number: string
  };

  unread: boolean;

  static parse(plain: MessageResponse): Voicemail {
    return new Voicemail({
      id: plain.id,
      date: moment.unix(plain.timestamp),
      duration: moment.duration(plain.duration, 'seconds'),
      caller: {
        name: plain.caller_id_name,
        number: plain.caller_id_num
      },
      unread: plain.folder ? plain.folder.type === 'new' : undefined
    });
  }

  static parseMany(plain: Response): Array<Voicemail> {
    const plainUnread = plain.folders.filter(folder => folder.type === 'new')[0].messages;
    const plainRead = plain.folders.filter(folder => folder.type === 'old')[0].messages;

    const unread = plainUnread.map(message => Voicemail.parse(message)).map(voicemail => voicemail.set('unread', true));
    const read = plainRead.map(message => Voicemail.parse(message)).map(voicemail => voicemail.set('unread', false));

    return [...unread, ...read];
  }

  is(other: Voicemail): boolean {
    return other && this.id === other.id;
  }

  acknowledge() {
    return this.set('unread', false);
  }

  contains(query: string): boolean {
    if (!query) {
      return true;
    }
    return this.caller.name.toUpperCase().includes(query.toUpperCase()) || this.caller.number.includes(query);
  }
}
