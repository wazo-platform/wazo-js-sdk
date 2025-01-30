import type {
  Invitation,
  Inviter,
  Session as SipSession,
  UserAgentOptions as sipJsUserAgentOptions,
} from 'sip.js';
import { SessionDescriptionHandlerFactoryOptions } from 'sip.js/lib/platform/web';
import type { IncomingResponse as SipIncomingResponse } from 'sip.js/lib/core/messages/incoming-response';
import { Transport } from 'sip.js/lib/api';
import WazoSessionDescriptionHandler from '../lib/WazoSessionDescriptionHandler';
import { Websocket } from '../simple/Websocket';
import * as WebSocketClient from '../websocket-client';
import { LineStateType } from './Profile';

const { SOCKET_EVENTS, ...OTHER_EVENTS } = WebSocketClient;

type GenericObject = Record<string, any>;
export type Token = string;
export type UUID = string;
export type DateString = string;
export type LogoutResponse = {
  data: {
    message: string;
  };
};
export type User = {
  username: string;
  uuid: UUID;
  firstname: string;
  lastname: string;
  enabled: boolean;
  tenant_uuid: string;
  emails: Array<string>;
};
export type Tenant = {
  name: string;
  uuid: UUID;
  phone: string | null | undefined;
  contact: string | null | undefined;
  address: Array<{
    city: string | null | undefined;
    country: string | null | undefined;
    state: string | null | undefined;
    line_1: string | null | undefined;
    line_2: string | null | undefined;
    zip_code: string | null | undefined;
  }>;
  parent_uuid: UUID;
};
export type Group = GenericObject;
export type Policy = {
  acl_templates: Array<string>;
  // Deprecated
  acl: Array<string>;
  description: string | null | undefined;
  tenant_uuid: UUID;
  uuid: UUID;
  name: string;
};
export type ListTenantsResponse = {
  filtered: number;
  total: number;
  items: Array<Tenant>;
};
export type ListUsersResponse = {
  filtered: number;
  total: number;
  items: Array<User>;
};
export type ListGroupsResponse = {
  filtered: number;
  total: number;
  items: Array<Group>;
};
export type ListPoliciesResponse = {
  total: number;
  items: Array<Policy>;
};
export type AccessdGroup = GenericObject;
export type Link = {
  href: string;
  rel: string;
};
export type ExtensionRelation = {
  id: number;
  exten: string;
  context: string;
  links?: Link[];
};
type LocalLine = {
  id: number;
  endpoint_sip: {
    id: number;
    username: string;
    links: Array<Link>;
  };
  endpoint_sccp: string | null | undefined;
  endpoint_custom: string | null | undefined;
  extensions: ExtensionRelation[];
};
export type ConfdUser = {
  id: number;
  uuid: UUID;
  firstname: string;
  lastname: string;
  email: string;
  timezone: string | null | undefined;
  language: string | null | undefined;
  description: string | null | undefined;
  caller_id: string;
  outgoing_caller_id: string;
  mobile_phone_number: string;
  username: string | null | undefined;
  password: string | null | undefined;
  music_on_hold: boolean | null | undefined;
  // to check
  preprocess_subroutine: string | null | undefined;
  // to check
  call_transfer_enabled: boolean;
  dtmf_hangup_enabled: boolean;
  call_record_enabled: boolean;
  online_call_record_enabled: boolean;
  supervision_enabled: boolean;
  ring_seconds: number;
  simultaneous_calls: number;
  call_permission_password: string;
  subscription_type: number;
  created_at: DateString;
  enabled: boolean;
  tenant_uuid: UUID;
  links: Array<Link>;
  agent: string | null | undefined;
  // to check
  cti_profile: string | null | undefined;
  // to check
  call_permissions: Array<string>;
  fallbacks: {
    noanswer_destination: string | null | undefined;
    busy_destination: string | null | undefined;
    congestion_destination: string | null | undefined;
    fail_destination: string | null | undefined;
  };
  groups: Array<AccessdGroup>;
  incalls: Array<Record<string, any>>;
  // @TODO
  lines: Array<LocalLine>;
  forwards: {
    busy: {
      enable: boolean;
      destination: string | null | undefined;
    };
    noanswer: {
      enable: boolean;
      destination: string | null | undefined;
    };
    unconditional: {
      enable: boolean;
      destination: string | null | undefined;
    };
  };
  schedules: [];
  // @TODO
  services: {
    dnd: {
      enabled: boolean;
    };
    incallfilter: {
      enabled: boolean;
    };
  };
  switchboards: Array<Record<string, any>>;
  // @TODO
  voicemail: string | null | undefined;
  queues: Array<Record<string, any>>; // @TODO
};
export type ListConfdUsersResponse = {
  total: number;
  items: Array<ConfdUser>;
};
export type Application = {
  uuid: UUID;
  tenant_uuid: UUID;
  name: string;
  destination: string;
  destination_options: {
    music_on_hold: string;
    type: string;
  };
  links: Array<Link>;
};
export type ListApplicationsResponse = {
  total: number;
  items: Array<Application>;
};
export type Node = {
  uuid: UUID;
  calls: Array<Record<string, any>>; // @TODO
};
export type CallNode = GenericObject;
export type ListNodesResponse = {
  items: Array<Node>;
};
export type ListCallNodesResponse = {
  uuid: UUID;
  items: Array<CallNode>;
};
export type GetTenantResponse = GenericObject;
export type GetUserResponse = GenericObject;
export type CTITransfer = {
  flow: string;
  id: string;
  initiator_call: string;
  initiator_uuid: string;
  recipient_call: string;
  status: string;
  transferred_call: string;
};
export type UserAgentOptions = sipJsUserAgentOptions & {
  peerConnectionOptions?: Record<string, any>;
  sessionDescriptionHandlerFactory: (
    session: SipSession,
    options: SessionDescriptionHandlerFactoryOptions
  ) => WazoSessionDescriptionHandler;
};
export type UserAgentConfigOverrides = Partial<
UserAgentOptions & {
  traceSip: any;
}
>;
export type MediaConfig = {
  audio: Record<string, any> | boolean;
  video?: Record<string, any> | boolean;
  localVideo?: Record<string, any> | boolean;
};
export type WebRtcConfig = {
  displayName?: string;
  host: string;
  port?: number | string;
  websocketSip?: string;
  authorizationUser?: string;
  password?: string;
  uri?: string;
  media?: MediaConfig;
  iceCheckingTimeout?: number;
  log?: Record<string, any>;
  audioOutputVolume?: number;
  userAgentString?: string;
  heartbeatDelay?: number;
  heartbeatTimeout?: number;
  maxHeartbeats?: number;
  skipRegister?: boolean;
  userUuid?: string;
  uaConfigOverrides?: UserAgentConfigOverrides;
  audioDeviceOutput?: string;
  audioDeviceRing?: string;
}; // @see https://github.com/onsip/SIP.js/blob/master/src/Web/Simple.js

export type IncomingResponse = SipIncomingResponse & { session: any };

export type PeerConnection = RTCPeerConnection & {
  getRemoteStreams: () => MediaStream[];
  getLocalStreams: () => MediaStream[];
  onremovestream: (func: any) => void;
  addStream: (stream: MediaStream) => void;
  sfu: any;
};

export type WazoSession = (Invitation | Inviter) & {
  remoteTag?: any;
  callId?: string;
};

export type WazoTransport = Transport & {
  configuration: Record<string, any>;
  connectPromise: Promise<any>;
  disconnectPromise: Promise<any>;
  disconnectResolve: any;
  transitionState: any;
  transitioningState: any;
  _ws: any;
};

export type PhonebookResponseItem = {
  phonebook_uuid: number;
  firstname: string;
  lastname: string;
  number: string;
  mobile?: string;
  extension?: string;
  number_other?: string;
  email: string;
  address: string;
  enterprise: string;
  birthday: string;
  note: string;
  id: string;
};

export type PresenceResponse = {
  connected: boolean;
  do_not_disturb: boolean;
  mobile: boolean;
  line_state: LineStateType;
  tenant_uuid: string;
  lines: Array<{
    id: number;
    state: string;
  }>;
  sessions?: Array<{
    mobile: boolean;
    uuid: string;
  }>;
  state: string;
  status: string | null;
  user_uuid: string;
  last_activity?: string | null;
};

export type QueryParams = {
  order?: string;
  direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

export type SearchableQueryParams = QueryParams & {
  search?: string;
};

export type UuidSearchableQueryParams = SearchableQueryParams & {
  uuid?: string;
};

export type WebsocketType = Websocket &
  typeof SOCKET_EVENTS &
  typeof OTHER_EVENTS;
