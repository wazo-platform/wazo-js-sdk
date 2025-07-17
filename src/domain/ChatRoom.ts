import type { ChatUser } from './ChatMessage';
import newFrom from '../utils/new-from';

export type RoomResponse = {
  name: string;
  uuid: string;
  users: Array<ChatUser>;
  kind?: string;
};
export type RootListResponse = {
  filtered: number;
  total: number;
  items: Array<RoomResponse>;
};
export default class ChatRoom {
  type: string;

  uuid: string;

  name: string;

  users: Array<ChatUser>;

  kind?: string;

  static parseMany(plain: RootListResponse): Array<ChatRoom> {
    if (!plain || !plain.items) {
      return [];
    }

    return plain.items.map(item => ChatRoom.parse(item));
  }

  static parse(plain: RoomResponse): ChatRoom {
    return new ChatRoom({
      uuid: plain.uuid,
      name: plain.name,
      users: plain.users,
      kind: plain.kind,
    });
  }

  static newFrom(room: ChatRoom) {
    return newFrom(room, ChatRoom);
  }

  constructor({
    uuid,
    name,
    users,
    kind,
  }: Record<string, any> = {}) {
    this.uuid = uuid;
    this.name = name;
    this.users = users;
    this.kind = kind;
    // Useful to compare instead of instanceof with minified code
    this.type = 'ChatRoom';
  }

}
