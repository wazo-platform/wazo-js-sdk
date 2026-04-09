export type ChatUser = {
    tenant_uuid: string;
    uuid: string;
    wazo_uuid: string;
};
export type ChatMessageResponseRoom = {
    uuid: string | null | undefined;
};
export type ChatMessageResponse = {
    alias: string;
    content: string;
    created_at: string;
    tenant_uuid: string;
    user_uuid: string;
    uuid: string;
    wazo_uuid: string;
    room: ChatMessageResponseRoom | null | undefined;
};
export type ChatMessageListResponse = {
    filtered: number;
    total: number;
    items: Array<ChatMessageResponse>;
};
export default class ChatMessage {
    type: string;
    uuid: string;
    content: string;
    date: Date;
    alias: string;
    userUuid: string;
    roomUuid: string | null | undefined;
    read: boolean;
    static parseMany(plain: ChatMessageListResponse): Array<ChatMessage>;
    static parse(plain: ChatMessageResponse): ChatMessage;
    static newFrom(message: ChatMessage): any;
    constructor({ uuid, date, content, userUuid, alias, roomUuid, read, }?: Record<string, any>);
    is(other: ChatMessage): boolean;
    isIncoming(userUuid: string): boolean;
    acknowledge(): this;
}
//# sourceMappingURL=ChatMessage.d.ts.map