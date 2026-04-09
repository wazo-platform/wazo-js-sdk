import ApiRequester from '../utils/api-requester';
import type { PresenceResponse, UUID } from '../domain/types';
import ChatRoom from '../domain/ChatRoom';
import type { ChatUser, ChatMessageListResponse } from '../domain/ChatMessage';
import ChatMessage from '../domain/ChatMessage';
type GetMessagesOptions = {
    direction?: string;
    limit?: number;
    order?: string;
    offset?: string;
    search?: string;
    distinct?: string;
};
declare const _default: (client: ApiRequester, baseUrl: string) => {
    updateState: (contactUuid: UUID, state: string) => Promise<boolean>;
    updateStatus: (contactUuid: UUID, state: string, status: string) => Promise<boolean>;
    getState: (contactUuid: UUID) => Promise<string>;
    getContactStatusInfo: (contactUuid: UUID) => Promise<PresenceResponse>;
    getLineState: (contactUuid: UUID) => Promise<string>;
    getMultipleLineState(contactUuids: Array<UUID> | null | undefined): Promise<Array<PresenceResponse>>;
    getUserRooms: () => Promise<Array<ChatRoom>>;
    createRoom: (name: string, users: Array<ChatUser>, kind?: string) => Promise<ChatRoom>;
    getRoomMessages: (roomUuid: string, params?: GetMessagesOptions) => Promise<Array<ChatMessage>>;
    sendRoomMessage: (roomUuid: string, message: ChatMessage) => Promise<ChatMessage>;
    getMessages: (options: GetMessagesOptions) => Promise<ChatMessageListResponse>;
};
export default _default;
//# sourceMappingURL=chatd.d.ts.map