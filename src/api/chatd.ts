import ApiRequester from '../utils/api-requester';
import type { PresenceResponse, UUID } from '../domain/types';
import Profile from '../domain/Profile';
import ChatRoom from '../domain/ChatRoom';
import type { ChatUser, ChatMessageListResponse } from '../domain/ChatMessage';
import ChatMessage from '../domain/ChatMessage';

type PresenceListResponse = {
  filtered: number;
  total: number;
  items: Array<PresenceResponse>;
};
type GetMessagesOptions = {
  direction?: string;
  limit?: number;
  order?: string;
  offset?: string;
  search?: string;
  distinct?: string;
};

// split contact status retrieval to avoid `414 Request-URI Too Large`.
const MAX_PRESENCE_FETCHED = 30;

export default ((client: ApiRequester, baseUrl: string) => ({
  updateState: (contactUuid: UUID, state: string): Promise<boolean> => client.put(`${baseUrl}/users/${contactUuid}/presences`, {
    state,
  }, null, ApiRequester.successResponseParser),

  updateStatus: (contactUuid: UUID, state: string, status: string): Promise<boolean> => {
    const body = {
      state,
      status,
    };
    return client.put(`${baseUrl}/users/${contactUuid}/presences`, body, null, ApiRequester.successResponseParser);
  },

  getState: async (contactUuid: UUID): Promise<string> => client.get(`${baseUrl}/users/${contactUuid}/presences`).then((response: PresenceResponse) => response.state),

  getContactStatusInfo: async (contactUuid: UUID): Promise<PresenceResponse> => client.get(`${baseUrl}/users/${contactUuid}/presences`).then((response: PresenceResponse) => response),

  getLineState: async (contactUuid: UUID): Promise<string> => client.get(`${baseUrl}/users/${contactUuid}/presences`).then((response: PresenceResponse) => Profile.getLinesState(response.lines)),

  async getMultipleLineState(contactUuids: Array<UUID> | null | undefined): Promise<Array<PresenceResponse>> {
    const body: any = {};
    const uuids: Array<UUID> = contactUuids || [];

    if (uuids.length > MAX_PRESENCE_FETCHED) {
      const requests = uuids.reduce((acc: Promise<PresenceResponse[]>[], _, i) => {
        if (i % MAX_PRESENCE_FETCHED === 0) {
          acc.push(this.getMultipleLineState(uuids.slice(i, i + MAX_PRESENCE_FETCHED)));
        }
        return acc;
      }, []);

      const splittedStatuses = await Promise.all(requests);

      return splittedStatuses.flat();
    }

    if (uuids.length) {
      body.user_uuid = uuids.join(',');
    }

    return client.get(`${baseUrl}/users/presences`, body).then((response: PresenceListResponse) => response.items);
  },

  getUserRooms: async (): Promise<Array<ChatRoom>> => client.get(`${baseUrl}/users/me/rooms`).then(ChatRoom.parseMany),

  createRoom: async (name: string, users: Array<ChatUser>, kind?: string): Promise<ChatRoom> => client.post(`${baseUrl}/users/me/rooms`, {
    name,
    users,
    kind,
  }).then(ChatRoom.parse),

  getRoomMessages: async (roomUuid: string, params?: GetMessagesOptions): Promise<Array<ChatMessage>> => {
    const qs = ApiRequester.getQueryString(params || {});
    return client.get(`${baseUrl}/users/me/rooms/${roomUuid}/messages${qs.length ? `?${qs}` : ''}`).then((response: ChatMessageListResponse) => ChatMessage.parseMany(response));
  },

  sendRoomMessage: async (roomUuid: string, message: ChatMessage): Promise<ChatMessage> => client.post(`${baseUrl}/users/me/rooms/${roomUuid}/messages`, message).then(ChatMessage.parse),

  getMessages: async (options: GetMessagesOptions): Promise<ChatMessageListResponse> => client.get(`${baseUrl}/users/me/rooms/messages`, options),
}));
