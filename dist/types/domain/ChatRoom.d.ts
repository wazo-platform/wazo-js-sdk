import type { ChatUser } from './ChatMessage';
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
    static parseMany(plain: RootListResponse): Array<ChatRoom>;
    static parse(plain: RoomResponse): ChatRoom;
    static newFrom(room: ChatRoom): any;
    constructor({ uuid, name, users, kind, }?: Record<string, any>);
}
//# sourceMappingURL=ChatRoom.d.ts.map