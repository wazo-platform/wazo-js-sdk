// @flow

import type {
  SwitchboardCallItems,
  SwitchboardAnwseredQueuedCall,
  SwitchboardAnwseredHeldCall,
} from '../domain/SwitchboardCall';
import type { ChatMessageResponse } from '../domain/ChatMessage';
import ChatRoom from '../domain/ChatRoom';

type WebSocketBaseMessage = {
  op: string,
  origin_uuid: string,
  required_acl: string,
};

export type ExternalAuth = { external_auth_name: string, user_uuid: string };
export type CallMessage = {
  call_id: string,
  caller_id_number: string,
  creation_time: string,
  dialed_extension: String,
  on_hold: boolean,
  peer_caller_id_name: string,
  peer_caller_id_number: string,
  status: string,
};
export type CallEventMessage = { call_id: string, user_uuid: string };
export type ChatMessageEvent = { from: string[], msg: string, to: string[] };
export type FavoriteEvent = { source: string, source_entry_id: string, user_uuid: string, xivo_uuid: string };
export type VoicemailDataEvent = {
  caller_id_name: string,
  caller_id_num: string,
  duration: number,
  folder: { name: string, type: string },
  id: string,
  timestamp: number,
};
export type VoicemailEvent = {
  message: VoicemailDataEvent,
  message_id: string,
  user_uuid: string,
  voicemail_id: number,
};
export type CallLogEvent = {
  answer: string,
  answered: boolean,
  call_direction: string,
  destination_extension: string,
  destination_internal_context: ?any,
  destination_internal_extension: ?any,
  destination_line_id: ?any,
  destination_name: string,
  destination_user_uuid: ?any,
  duration: number,
  end: string,
  id: number,
  requested_context: string,
  requested_extension: string,
  requested_internal_context: ?any,
  requested_internal_extension: ?any,
  source_extension: string,
  source_internal_context: string,
  source_internal_extension: string,
  source_line_id: number,
  source_name: string,
  source_user_uuid: string,
  start: string,
};
export type UserStatusUpdateEvent = { status: string, user_uuid: string };
export type DoNotDisturbUpdateEvent = { enabled: boolean, user_uuid: string };
export type EndpointStatusUpdateEvent = { endpoint_id: string, status: string };

export type PresencesReadEvent = {
  lines: Array<{ id: number, state: string }>,
  sessions: Array<any>,
  state: string,
  status: string,
  tenant_uuid: string,
  uuid: string,
};

export type RoomParticipantUpdate = {
  admin: boolean,
  call_id: string,
  caller_id_name: string,
  caller_id_number: string,
  conference_id: number,
  id: string,
  language: string,
  muted: boolean,
  user_uuid: string,
};

export type FaxOutboundFailedEvent = {
  call_id: string,
  caller_id: string,
  context: string,
  error: string,
  extension: string,
  id: string,
  tenant_uuid: string,
  user_uuid: string,
};

export type FaxOutboundSucceededEvent = {
  call_id: string,
  caller_id: string,
  context: string,
  error: string,
  extension: string,
  id: string,
  tenant_uuid: string,
  user_uuid: string,
};

type CallCreated = WebSocketBaseMessage & { data: CallMessage, name: 'call_created' };
type CallUpdated = WebSocketBaseMessage & { data: CallMessage, name: 'call_updated' };
type CallEnded = WebSocketBaseMessage & { data: CallMessage, name: 'call_ended' };
type CallHeld = WebSocketBaseMessage & { data: CallEventMessage, name: 'call_held' };
type CallResumed = WebSocketBaseMessage & { data: CallEventMessage, name: 'call_resumed' };
type ChatMessageSent = WebSocketBaseMessage & { data: ChatMessageEvent, name: 'chatd_user_room_created' };
type ChatRoomCreate = WebSocketBaseMessage & { data: ChatRoom, name: 'chatd_user_room_message_created' };
type VoicemailCreated = WebSocketBaseMessage & { data: VoicemailEvent, name: 'user_voicemail_message_created' };
type UpdateDoNotDisturb = WebSocketBaseMessage & { data: DoNotDisturbUpdateEvent, name: 'users_services_dnd_updated' };
type VoicemailDeleted = WebSocketBaseMessage & { data: VoicemailEvent, name: 'user_voicemail_message_deleted' };
type FavoriteAdded = WebSocketBaseMessage & { data: FavoriteEvent, name: 'favorite_added' };
type FavoriteDeleted = WebSocketBaseMessage & { data: FavoriteEvent, name: 'favorite_deleted' };
type NewCallLog = WebSocketBaseMessage & { data: CallLogEvent, name: 'call_log_user_created' };
type UserStatusUpdate = WebSocketBaseMessage & { data: UserStatusUpdateEvent, name: 'user_status_update' };
type EndpointStatusUpdate = WebSocketBaseMessage & { data: EndpointStatusUpdateEvent, name: 'endpoint_status_update' };
type ExternalAuthAdded = WebSocketBaseMessage & { data: ExternalAuth, name: 'auth_user_external_auth_added' };
type ExternalAuthDeleted = WebSocketBaseMessage & { data: ExternalAuth, name: 'auth_user_external_auth_deleted' };
type PresencesRead = WebSocketBaseMessage & { data: PresencesReadEvent, name: 'chatd_presence_updated' };
type ParticipantJoinedRoom = WebSocketBaseMessage & {
  data: RoomParticipantUpdate,
  name: 'conference_user_participant_joined',
};
type ParticipantLeftRoom = WebSocketBaseMessage & {
  data: RoomParticipantUpdate,
  name: 'conference_user_participant_left',
};
type SwitchboardQueuedCallsUpdated = WebSocketBaseMessage & {
  data: SwitchboardCallItems,
  name: 'switchboard_queued_calls_updated',
};
type SwitchboardQueuedCallAnswered = WebSocketBaseMessage & {
  data: SwitchboardAnwseredQueuedCall,
  name: 'switchboard_queued_call_answered',
};
type SwitchboardHeldCallsUpdated = WebSocketBaseMessage & { data: any, name: 'switchboard_held_calls_updated' };
type SwitchboardHeldCallAnswered = WebSocketBaseMessage & {
  data: SwitchboardAnwseredHeldCall,
  name: 'switchboard_held_call_answered',
};
type FaxOutboundFailed = WebSocketBaseMessage & { data: FaxOutboundFailedEvent, name: 'fax_outbound_user_failed' };
type FaxOutboundSucceeded = WebSocketBaseMessage & {
  data: FaxOutboundSucceededEvent,
  name: 'fax_outbound_user_succeeded',
};

export type WebSocketMessage =
  | CallCreated
  | CallUpdated
  | CallEnded
  | CallHeld
  | CallResumed
  | NewCallLog
  | ChatMessageSent
  | (WebSocketBaseMessage & ChatMessageResponse)
  | ChatRoomCreate
  | VoicemailCreated
  | UpdateDoNotDisturb
  | VoicemailDeleted
  | FavoriteAdded
  | FavoriteDeleted
  | UserStatusUpdate
  | EndpointStatusUpdate
  | ExternalAuthAdded
  | ExternalAuthDeleted
  | PresencesRead
  | SwitchboardQueuedCallsUpdated
  | SwitchboardQueuedCallAnswered
  | SwitchboardHeldCallsUpdated
  | SwitchboardHeldCallAnswered
  | ParticipantJoinedRoom
  | ParticipantLeftRoom
  | FaxOutboundFailed
  | FaxOutboundSucceeded;
