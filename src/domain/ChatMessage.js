// @flow
import moment from 'moment';

import newFrom from '../utils/new-from';

export type ChatUser = {
  tenant_uuid: string,
  uuid: string,
  wazo_uuid: string,
};

export type ChatMessageResponseRoom = {
  uuid: ?string,
};

export type ChatMessageResponse = {
  alias: string,
  content: string,
  created_at: string,
  tenant_uuid: string,
  user_uuid: string,
  uuid: string,
  wazo_uuid: string,
  room: ?ChatMessageResponseRoom,
};

export type ChatMessageListResponse = {
  filtered: number,
  total: number,
  items: Array<ChatMessageResponse>,
};

export default class ChatMessage {
  type: string;

  uuid: string;
  content: string;
  date: Date;
  alias: string;
  userUuid: string;
  roomUuid: ?string;
  read: boolean;

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
      read: true,
      roomUuid: plain.room ? plain.room.uuid : null,
    });
  }

  static newFrom(message: ChatMessage) {
    return newFrom(message, ChatMessage);
  }

  constructor({ uuid, date, content, userUuid, alias, roomUuid, read }: Object = {}) {
    this.uuid = uuid;
    this.date = date;
    this.content = content;
    this.userUuid = userUuid;
    this.alias = alias;
    this.roomUuid = roomUuid;

    // @TODO: change after message read status available
    this.read = read;

    // Useful to compare instead of instanceof with minified code
    this.type = 'ChatMessage';
  }

  is(other: ChatMessage) {
    return this.uuid === other.uuid;
  }

  isIncoming(userUuid: string) {
    return this.userUuid !== userUuid;
  }

  acknowledge() {
    // @TODO: change after message read status available
    this.read = true;
    return this;
  }
}
