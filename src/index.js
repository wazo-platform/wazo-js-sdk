// @flow

import ApiClient from './api-client';
import WebRTCClient from './web-rtc-client';
import WebSocketClient from './websocket-client';

// Domain
import BadResponse from './domain/BadResponse';
import ServerError from './domain/ServerError';
import Call from './domain/Call';
import CallLog from './domain/CallLog';
import ChatMessage from './domain/ChatMessage';
import Contact from './domain/Contact';
import COUNTRIES from './domain/Country';
import ForwardOption, { FORWARD_KEYS } from './domain/ForwardOption';
import Line from './domain/Line';
import NotificationOptions from './domain/NotificationOptions';
import Profile, { PRESENCE } from './domain/Profile';
import Session from './domain/Session';
import Voicemail from './domain/Voicemail';
import type { NewContact as NewContactType } from './domain/Contact';
import type { Phone as PhoneType, PhoneEventCallbacks as PhoneEventCallbacksType } from './domain/Phone/Phone';
import DebugPhone from './domain/Phone/DebugPhone';
import type { Device as DeviceType } from './domain/Device/Device';
import DebugDevice from './domain/Device/DebugDevice';

export type NewContact = NewContactType;
export type Phone = PhoneType;
export type PhoneEventCallbacks = PhoneEventCallbacksType;
export type Device = DeviceType;

export default {
  WazoApiClient: ApiClient,
  WazoWebRTCClient: WebRTCClient,
  WazoWebSocketClient: WebSocketClient,
  BadResponse,
  ServerError,
  Call,
  CallLog,
  ChatMessage,
  Contact,
  COUNTRIES,
  ForwardOption,
  Line,
  NotificationOptions,
  Profile,
  Session,
  Voicemail,
  DebugPhone,
  DebugDevice,
  PRESENCE,
  FORWARD_KEYS
};
