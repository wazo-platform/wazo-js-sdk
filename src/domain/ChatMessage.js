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
  roomUuid: ?string;
  read: boolean;

  static parseMany(plain: ChatMessageListResponse, roomUuid: ?string = null): Array<ChatMessage> {
    return plain.items.map(item => ChatMessage.parse(item, roomUuid));
  }

  static parse(plain: ChatMessageResponse, roomUuid: ?string = null): ChatMessage {
    return new ChatMessage({
      uuid: plain.uuid,
      date: moment(plain.created_at).toDate(),
      content: plain.content,
      alias: plain.alias,
      userUuid: plain.user_uuid,
      roomUuid,
    });
  }

  static newFrom(message: ChatMessage) {
    return newFrom(message, ChatMessage);
  }

  constructor({ uuid, date, content, userUuid, alias, roomUuid }: Object = {}) {
    this.uuid = uuid;
    this.date = date;
    this.content = content;
    this.userUuid = userUuid;
    this.alias = alias;
    this.roomUuid = roomUuid;

    // @TODO: change after message read status available
    this.read = true;
  }

  is(other: ChatMessage) {
    return this.uuid === other.uuid;
  }

  isIncoming(userUuid: string) {
    return this.userUuid !== userUuid;
  }
}
