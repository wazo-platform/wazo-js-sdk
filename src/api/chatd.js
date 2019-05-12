/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, Token } from '../domain/types';
import Profile from '../domain/Profile';
import ChatRoom from '../domain/ChatRoom';
import type { ChatUser, ChatMessageListResponse } from '../domain/ChatMessage';
import ChatMessage from '../domain/ChatMessage';

export type PresenceResponse = {
  lines: Array<{ id: number, state: string }>,
  sessions: Array<{ mobile: boolean, uuid: string }>,
  state: string,
  status: string,
  user_uuid: string,
};

type PresenceListResponse = {
  filtered: number,
  total: number,
  items: Array<PresenceResponse>,
};

export default (client: ApiRequester, baseUrl: string) => ({
  updatePresence: (token: Token, contactUuid: UUID, state: string): Promise<Boolean> =>
    client.put(`${baseUrl}/users/${contactUuid}/presences`, { state }, token, ApiRequester.successResponseParser),

  updateStatus: (token: Token, contactUuid: UUID, state: string, status: string): Promise<Boolean> => {
    const body = { state, status };

    return client.put(`${baseUrl}/users/${contactUuid}/presences`, body, token, ApiRequester.successResponseParser);
  },

  getPresence: async (token: Token, contactUuid: UUID): Promise<string> =>
    client
      .get(`${baseUrl}/users/${contactUuid}/presences`, null, token)
      .then((response: PresenceResponse) => response.state),

  getContactStatusInfo: async (token: Token, contactUuid: UUID): Promise<PresenceResponse> =>
    client.get(`${baseUrl}/users/${contactUuid}/presences`, null, token).then((response: PresenceResponse) => response),

  getLineState: async (token: Token, contactUuid: UUID): Promise<string> =>
    client
      .get(`${baseUrl}/users/${contactUuid}/presences`, null, token)
      .then((response: PresenceResponse) => Profile.getLinesState(response.lines)),

  getMultipleLineState: async (token: Token, contactUuids: Array<UUID>): Promise<string> =>
    client
      .get(`${baseUrl}/users/presences`, { user_uuid: contactUuids.join(',') }, token)
      .then((response: PresenceListResponse) => response.items),

  getUserRooms: async (token: Token): Promise<Array<ChatRoom>> =>
    client.get(`${baseUrl}/users/me/rooms`, null, token).then(ChatRoom.parseMany),

  createRoom: async (token: Token, name: string, users: Array<ChatUser>): Promise<ChatRoom> =>
    client.post(`${baseUrl}/users/me/rooms`, { name, users }, token).then(ChatRoom.parse),

  getRoomMessages: async (token: Token, roomUuid: string): Promise<Array<ChatMessage>> =>
    client
      .get(`${baseUrl}/users/me/rooms/${roomUuid}/messages`, null, token)
      .then((response: ChatMessageListResponse) => ChatMessage.parseMany(response, roomUuid)),

  sendRoomMessage: async (token: Token, roomUuid: string, message: ChatMessage): Promise<ChatMessage> =>
    client.post(`${baseUrl}/users/me/rooms/${roomUuid}/messages`, message, token).then(ChatMessage.parse),
});
