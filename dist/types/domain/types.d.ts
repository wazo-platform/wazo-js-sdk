import type { Invitation, Inviter, Session as SipSession, UserAgentOptions as sipJsUserAgentOptions } from 'sip.js';
import { SessionDescriptionHandlerFactoryOptions } from 'sip.js/lib/platform/web';
import type { IncomingResponse as SipIncomingResponse } from 'sip.js/lib/core/messages/incoming-response';
import { Transport } from 'sip.js/lib/api';
import WazoSessionDescriptionHandler from '../lib/WazoSessionDescriptionHandler';
import { Websocket } from '../simple/Websocket';
declare const SOCKET_EVENTS: {
    readonly ON_OPEN: "onopen";
    readonly ON_MESSAGE: "onmessage";
    readonly ON_ERROR: "onerror";
    readonly ON_CLOSE: "onclose";
    readonly INITIALIZED: "initialized";
    readonly ON_AUTH_FAILED: "on_auth_failed";
}, OTHER_EVENTS: {
    AUTH_SESSION_EXPIRE_SOON: "auth_session_expire_soon";
    FAVORITE_ADDED: "favorite_added";
    FAVORITE_DELETED: "favorite_deleted";
    USER_STATUS_UPDATE: "user_status_update";
    CHAT_MESSAGE_SENT: "chat_message_sent";
    CHAT_MESSAGE_RECEIVED: "chat_message_received";
    ENDPOINT_STATUS_UPDATE: "endpoint_status_update";
    USERS_FORWARDS_BUSY_UPDATED: "users_forwards_busy_updated";
    USERS_FORWARDS_NOANSWER_UPDATED: "users_forwards_noanswer_updated";
    USERS_FORWARDS_UNCONDITIONAL_UPDATED: "users_forwards_unconditional_updated";
    USERS_SERVICES_DND_UPDATED: "users_services_dnd_updated";
    GLOBAL_VOICEMAIL_MESSAGE_CREATED: "global_voicemail_message_created";
    GLOBAL_VOICEMAIL_MESSAGE_UPDATED: "global_voicemail_message_updated";
    GLOBAL_VOICEMAIL_MESSAGE_DELETED: "global_voicemail_message_deleted";
    USER_VOICEMAIL_MESSAGE_CREATED: "user_voicemail_message_created";
    USER_VOICEMAIL_MESSAGE_UPDATED: "user_voicemail_message_updated";
    USER_VOICEMAIL_MESSAGE_DELETED: "user_voicemail_message_deleted";
    CALL_LOG_USER_CREATED: "call_log_user_created";
    CALL_CREATED: "call_created";
    CALL_ANSWERED: "call_answered";
    CALL_DTMF_CREATED: "call_dtmf_created";
    CALL_ENDED: "call_ended";
    CALL_UPDATED: "call_updated";
    CALL_HELD: "call_held";
    CALL_RESUMED: "call_resumed";
    AUTH_USER_EXTERNAL_AUTH_ADDED: "auth_user_external_auth_added";
    AUTH_USER_EXTERNAL_AUTH_DELETED: "auth_user_external_auth_deleted";
    CHATD_PRESENCE_UPDATED: "chatd_presence_updated";
    CHATD_USER_ROOM_MESSAGE_CREATED: "chatd_user_room_message_created";
    CHATD_USER_ROOM_CREATED: "chatd_user_room_created";
    CONFERENCE_USER_PARTICIPANT_JOINED: "conference_user_participant_joined";
    CONFERENCE_USER_PARTICIPANT_LEFT: "conference_user_participant_left";
    CONFERENCE_USER_PARTICIPANT_TALK_STARTED: "conference_user_participant_talk_started";
    CONFERENCE_USER_PARTICIPANT_TALK_STOPPED: "conference_user_participant_talk_stopped";
    MEETING_USER_PARTICIPANT_JOINED: "meeting_user_participant_joined";
    MEETING_USER_PARTICIPANT_LEFT: "meeting_user_participant_left";
    SWITCHBOARD_QUEUED_CALLS_UPDATED: "switchboard_queued_calls_updated";
    SWITCHBOARD_QUEUED_CALL_ANSWERED: "switchboard_queued_call_answered";
    SWITCHBOARD_HELD_CALLS_UPDATED: "switchboard_held_calls_updated";
    SWITCHBOARD_HELD_CALL_ANSWERED: "switchboard_held_call_answered";
    FAX_OUTBOUND_USER_CREATED: "fax_outbound_user_created";
    FAX_OUTBOUND_USER_SUCCEEDED: "fax_outbound_user_succeeded";
    FAX_OUTBOUND_USER_FAILED: "fax_outbound_user_failed";
    APPLICATION_CALL_DTMF_RECEIVED: "application_call_dtmf_received";
    APPLICATION_CALL_ENTERED: "application_call_entered";
    APPLICATION_CALL_INITIATED: "application_call_initiated";
    APPLICATION_CALL_DELETED: "application_call_deleted";
    APPLICATION_CALL_UPDATED: "application_call_updated";
    APPLICATION_CALL_ANSWERED: "application_call_answered";
    APPLICATION_PROGRESS_STARTED: "application_progress_started";
    APPLICATION_PROGRESS_STOPPED: "application_progress_stopped";
    APPLICATION_DESTINATION_NODE_CREATED: "application_destination_node_created";
    APPLICATION_NODE_CREATED: "application_node_created";
    APPLICATION_NODE_DELETED: "application_node_deleted";
    APPLICATION_NODE_UPDATED: "application_node_updated";
    APPLICATION_PLAYBACK_CREATED: "application_playback_created";
    APPLICATION_PLAYBACK_DELETED: "application_playback_deleted";
    APPLICATION_SNOOP_CREATED: "application_snoop_created";
    APPLICATION_SNOOP_DELETED: "application_snoop_deleted";
    APPLICATION_SNOOP_UPDATED: "application_snoop_updated";
    APPLICATION_USER_OUTGOING_CALL_CREATED: "application_user_outgoing_call_created";
    TRUNK_STATUS_UPDATED: "trunk_status_updated";
    LINE_STATUS_UPDATED: "line_status_updated";
    AGENT_STATUS_UPDATE: "agent_status_update";
    AGENT_PAUSED: "agent_paused";
    AGENT_UNPAUSED: "agent_unpaused";
    AGENT_QUEUE_LOGGED_IN: "user_agent_queue_logged_in";
    AGENT_QUEUE_LOGGED_OUT: "user_agent_queue_logged_out";
    CONFERENCE_ADHOC_PARTICIPANT_LEFT: "conference_adhoc_participant_left";
    CONFERENCE_ADHOC_DELETED: "conference_adhoc_deleted";
    MEETING_USER_PROGRESS: "meeting_user_progress";
    MEETING_USER_GUEST_AUTHORIZATION_CREATED: "meeting_user_guest_authorization_created";
    HEARTBEAT_ENGINE_VERSION: "20.09";
    default: typeof import("..").WebSocketClient;
};
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
    preprocess_subroutine: string | null | undefined;
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
    cti_profile: string | null | undefined;
    call_permissions: Array<string>;
    fallbacks: {
        noanswer_destination: string | null | undefined;
        busy_destination: string | null | undefined;
        congestion_destination: string | null | undefined;
        fail_destination: string | null | undefined;
    };
    groups: Array<AccessdGroup>;
    incalls: Array<Record<string, any>>;
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
    services: {
        dnd: {
            enabled: boolean;
        };
        incallfilter: {
            enabled: boolean;
        };
    };
    switchboards: Array<Record<string, any>>;
    voicemail: string | null | undefined;
    queues: Array<Record<string, any>>;
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
    calls: Array<Record<string, any>>;
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
    sessionDescriptionHandlerFactory: (session: SipSession, options: SessionDescriptionHandlerFactoryOptions) => WazoSessionDescriptionHandler;
};
export type UserAgentConfigOverrides = Partial<UserAgentOptions & {
    traceSip: any;
}>;
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
    iceReconnectDelay?: number;
};
export type IncomingResponse = SipIncomingResponse & {
    session: any;
};
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
    lines: Array<{
        id: number;
        state: string;
    }>;
    sessions: Array<{
        mobile: boolean;
        uuid: string;
    }>;
    state: string;
    status: string;
    user_uuid: string;
    last_activity?: string;
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
export type WebsocketType = Websocket & typeof SOCKET_EVENTS & typeof OTHER_EVENTS;
export type BlockNumber = {
    uuid: string;
    number: string;
    label: string | null;
};
export type BlockNumberBody = {
    number: string;
    label?: string | null;
};
export type DeviceToken = {
    token: string | null;
    apns_token: string | null;
    apns_voip_token: string | null;
    apns_notification_token: string | null;
};
export {};
//# sourceMappingURL=types.d.ts.map