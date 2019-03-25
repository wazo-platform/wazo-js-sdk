// @flow
import moment from 'moment';

import newFrom from '../utils/new-from';

export type ChatUser = {
  tenant_uuid: string,
  uuid: string,
  wazo_uuid: string,
};

export type ChatMessageResponse = {
  alias: string,
  content: string,
  created_at: string,
  tenant_uuid: string,
  user_uuid: string,
  uuid: string,
  wazo_uuid: string,
};

export type ChatMessageListResponse = {
  filtered: number,
  total: number,
  items: Array<ChatMessageResponse>,
};

export default class ChatMessage {
  uuid: string;
  content: string;
  date: Date;
  alias: string;
  userUuid: string;

  static parseMany(plain: ChatMessageListResponse): Array<ChatMessage> {
    return plain.items.map(item => ChatMessage.parse(item));
  }

  static parse(plain: ChatMessageResponse): ChatMessage {
    return new ChatMessage({
      uuid: plain.uuid,
      date: moment(plain.created_at).toDate(),
      content: plain.content,
      alias: plain.alias,
      userUuid: plain.user_uuid,
    });
  }

  // static parseMessageSent(plain: PlainMessageResponse): ChatMessage {
  //   return new ChatMessage({
  //     id: uuid(),
  //     date: new Date(),
  //     message: plain.msg,
  //     direction: 'sent',
  //     destination: {
  //       serverId: plain.to[0],
  //       userId: plain.to[1],
  //     },
  //     source: {
  //       serverId: plain.from[0],
  //       userId: plain.from[1],
  //     },
  //     read: true,
  //   });
  // }
  //
  // static parseMessageReceived(plain: PlainMessageResponse): ChatMessage {
  //   return new ChatMessage({
  //     id: uuid(),
  //     date: new Date(),
  //     message: plain.msg,
  //     direction: 'received',
  //     destination: {
  //       serverId: plain.to[0],
  //       userId: plain.to[1],
  //     },
  //     source: {
  //       serverId: plain.from[0],
  //       userId: plain.from[1],
  //     },
  //     read: false,
  //   });
  // }

  static newFrom(message: ChatMessage) {
    return newFrom(message, ChatMessage);
  }

  constructor({ uuid, date, content, userUuid, alias }: Object = {}) {
    this.uuid = uuid;
    this.date = date;
    this.content = content;
    this.userUuid = userUuid;
    this.alias = alias;
  }

  is(other: ChatMessage) {
    return this.uuid === other.uuid;
  }

  // isIncoming() {
  //   return this.direction === 'received';
  // }
  //
  // acknowledge() {
  //   this.read = true;
  //
  //   return this;
  // }
  //
  // getTheOtherParty() {
  //   if (this.direction === 'sent') {
  //     return this.destination.userId;
  //   }
  //   return this.source.userId;
  // }
}
