// @flow
import type { ChatUser } from './ChatMessage';
import newFrom from '../utils/new-from';

export type RoomResponse = {
  name: string,
  uuid: string,
  users: Array<ChatUser>,
};

export type RootListResponse = {
  filtered: number,
  total: number,
  items: Array<RoomResponse>,
};

export default class ChatRoom {
  type: string;

  uuid: string;
  name: string;
  users: Array<ChatUser>;

  static parseMany(plain: RootListResponse): Array<ChatRoom> {
    return plain.items.map(item => ChatRoom.parse(item));
  }

  static parse(plain: RoomResponse): ChatRoom {
    return new ChatRoom({
      uuid: plain.uuid,
      name: plain.name,
      users: plain.users,
    });
  }

  static newFrom(room: ChatRoom) {
    return newFrom(room, ChatRoom);
  }

  constructor({ uuid, name, users }: Object = {}) {
    this.uuid = uuid;
    this.name = name;
    this.users = users;

    // Useful to compare instead of instanceof with minified code
    this.type = 'ChatRoom';
  }
}
