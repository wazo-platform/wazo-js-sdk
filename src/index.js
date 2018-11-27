// @flow

import SIP from 'sip.js';
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
import type {
  NewContact as NewContactType,
  ContactResponse as ContactResponseType,
  ContactsResponse as ContactsResponseType,
  ContactPersonalResponse as ContactPersonalResponseType,
  ContactMobileResponse as ContactMobileResponseType
} from './domain/Contact';
import type { Phone as PhoneType, PhoneEventCallbacks as PhoneEventCallbacksType } from './domain/Phone/Phone';
import DebugPhone from './domain/Phone/DebugPhone';
import type { Device as DeviceType } from './domain/Device/Device';
import DebugDevice from './domain/Device/DebugDevice';
import {
  PhoneNumberUtil,
  PhoneNumberFormat,
  AsYouTypeFormatter,
  getDisplayableNumber,
  getCallableNumber
} from './utils/PhoneNumberUtil';

export type NewContact = NewContactType;
export type ContactResponse = ContactResponseType;
export type ContactsResponse = ContactsResponseType;
export type ContactPersonalResponse = ContactPersonalResponseType;
export type ContactMobileResponse = ContactMobileResponseType;
export type Phone = PhoneType;
export type PhoneEventCallbacks = PhoneEventCallbacksType;
export type Device = DeviceType;

export default {
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
