// @flow

import SIP from 'sip.js';

import ApiClient from './api-client';
import WebRTCClient from './web-rtc-client';
import WebSocketClient, { SOCKET_EVENTS } from './websocket-client';
import Emitter from './utils/Emitter';

// Domain
import BadResponse from './domain/BadResponse';
import ServerError from './domain/ServerError';
import Call from './domain/Call';
import CallLog from './domain/CallLog';
import ChatMessage from './domain/ChatMessage';
import ChatRoom from './domain/ChatRoom';
import Contact from './domain/Contact';
import COUNTRIES from './domain/Country';
import ForwardOption, { FORWARD_KEYS } from './domain/ForwardOption';
import Line from './domain/Line';
import NotificationOptions from './domain/NotificationOptions';
import Profile, { STATE as PROFILE_STATE, LINE_STATE } from './domain/Profile';
import Session from './domain/Session';
import Voicemail from './domain/Voicemail';
import Relocation from './domain/Relocation';
import Conference from './domain/Conference';
import Room from './domain/Room';
import CallSession from './domain/CallSession';
import IndirectTransfer from './domain/IndirectTransfer';
import SwitchboardCall from './domain/SwitchboardCall';
import type {
  NewContact as NewContactType,
  ContactResponse as ContactResponseType,
  ContactsResponse as ContactsResponseType,
  ContactPersonalResponse as ContactPersonalResponseType,
  ContactMobileResponse as ContactMobileResponseType,
} from './domain/Contact';
import type { Phone as PhoneType, PhoneEventCallbacks as PhoneEventCallbacksType } from './domain/Phone/Phone';
import type { ChatUser as ChatUserType } from './domain/ChatMessage';
import type { Device as DeviceType } from './domain/Device/Device';
import type { WebSocketMessage as WebSocketMessageType } from './types/WebSocketMessage';
import DebugDevice from './domain/Device/DebugDevice';
import {
  PhoneNumberUtil,
  PhoneNumberFormat,
  AsYouTypeFormatter,
  getDisplayableNumber,
  getCallableNumber,
} from './utils/PhoneNumberUtil';
import type {
  DirectorySource as DirectorySourceType,
  DirectorySources as DirectorySourcesType,
} from './domain/DirectorySource';
import type {
  SwitchboardAnwseredQueuedCall as SwitchboardAnwseredQueuedCallType,
  SwitchboardAnwseredHeldCall as SwitchboardAnwseredHeldCallType,
  SwitchboardCallItem as SwitchboardCallItemType,
  SwitchboardCallItems as SwitchboardCallItemsType,
} from './domain/SwitchboardCall';
import type { ConferenceParticipant as ConferenceParticipantType } from './domain/Conference';

export type NewContact = NewContactType;
export type ContactResponse = ContactResponseType;
export type ContactsResponse = ContactsResponseType;
export type ContactPersonalResponse = ContactPersonalResponseType;
export type ContactMobileResponse = ContactMobileResponseType;
export type Phone = PhoneType;
export type PhoneEventCallbacks = PhoneEventCallbacksType;
export type Device = DeviceType;
export type ChatUser = ChatUserType;
export type Source = DirectorySourceType;
export type Sources = DirectorySourcesType;
export type ConferenceParticipant = ConferenceParticipantType;
export type SwitchboardAnwseredQueuedCall = SwitchboardAnwseredQueuedCallType;
export type SwitchboardAnwseredHeldCall = SwitchboardAnwseredHeldCallType;
export type SwitchboardCallItem = SwitchboardCallItemType;
export type SwitchboardCallItems = SwitchboardCallItemsType;
export type WebSocketMessage = WebSocketMessageType;

export default {
  Emitter,
  PhoneNumberUtil,
  PhoneNumberFormat,
  AsYouTypeFormatter,
  getDisplayableNumber,
  getCallableNumber,
  SIP,
  WazoApiClient: ApiClient,
  WazoWebRTCClient: WebRTCClient,
  WazoWebSocketClient: WebSocketClient,
  BadResponse,
  ServerError,
  Call,
  Conference,
  CallSession,
  IndirectTransfer,
  SwitchboardCall,
  CallLog,
  ChatMessage,
  ChatRoom,
  Contact,
  COUNTRIES,
  ForwardOption,
  Line,
  NotificationOptions,
  Profile,
  Session,
  Voicemail,
  Relocation,
  Room,
  DebugDevice,
  PROFILE_STATE,
  FORWARD_KEYS,
  LINE_STATE,
  SOCKET_EVENTS,
};
