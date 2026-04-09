import ReconnectingWebSocket from 'reconnecting-websocket';
import Session from './domain/Session';
import Emitter from './utils/Emitter';
import type { WebSocketMessage } from './types/WebSocketMessage';
import Heartbeat from './utils/Heartbeat';
export declare const SOCKET_EVENTS: {
    readonly ON_OPEN: "onopen";
    readonly ON_MESSAGE: "onmessage";
    readonly ON_ERROR: "onerror";
    readonly ON_CLOSE: "onclose";
    readonly INITIALIZED: "initialized";
    readonly ON_AUTH_FAILED: "on_auth_failed";
};
type Arguments = {
    host: string;
    token: string;
    events?: Array<string>;
    version?: number;
    session?: Session;
    heartbeat?: {
        delay: number;
        timeout: number;
        max: number;
    };
};
export declare const AUTH_SESSION_EXPIRE_SOON = "auth_session_expire_soon";
export declare const FAVORITE_ADDED = "favorite_added";
export declare const FAVORITE_DELETED = "favorite_deleted";
export declare const USER_STATUS_UPDATE = "user_status_update";
export declare const CHAT_MESSAGE_SENT = "chat_message_sent";
export declare const CHAT_MESSAGE_RECEIVED = "chat_message_received";
export declare const ENDPOINT_STATUS_UPDATE = "endpoint_status_update";
export declare const USERS_FORWARDS_BUSY_UPDATED = "users_forwards_busy_updated";
export declare const USERS_FORWARDS_NOANSWER_UPDATED = "users_forwards_noanswer_updated";
export declare const USERS_FORWARDS_UNCONDITIONAL_UPDATED = "users_forwards_unconditional_updated";
export declare const USERS_SERVICES_DND_UPDATED = "users_services_dnd_updated";
export declare const GLOBAL_VOICEMAIL_MESSAGE_CREATED = "global_voicemail_message_created";
export declare const GLOBAL_VOICEMAIL_MESSAGE_UPDATED = "global_voicemail_message_updated";
export declare const GLOBAL_VOICEMAIL_MESSAGE_DELETED = "global_voicemail_message_deleted";
export declare const USER_VOICEMAIL_MESSAGE_CREATED = "user_voicemail_message_created";
export declare const USER_VOICEMAIL_MESSAGE_UPDATED = "user_voicemail_message_updated";
export declare const USER_VOICEMAIL_MESSAGE_DELETED = "user_voicemail_message_deleted";
export declare const CALL_LOG_USER_CREATED = "call_log_user_created";
export declare const CALL_CREATED = "call_created";
export declare const CALL_ANSWERED = "call_answered";
export declare const CALL_DTMF_CREATED = "call_dtmf_created";
export declare const CALL_ENDED = "call_ended";
export declare const CALL_UPDATED = "call_updated";
export declare const CALL_HELD = "call_held";
export declare const CALL_RESUMED = "call_resumed";
export declare const AUTH_USER_EXTERNAL_AUTH_ADDED = "auth_user_external_auth_added";
export declare const AUTH_USER_EXTERNAL_AUTH_DELETED = "auth_user_external_auth_deleted";
export declare const CHATD_PRESENCE_UPDATED = "chatd_presence_updated";
export declare const CHATD_USER_ROOM_MESSAGE_CREATED = "chatd_user_room_message_created";
export declare const CHATD_USER_ROOM_CREATED = "chatd_user_room_created";
export declare const CONFERENCE_USER_PARTICIPANT_JOINED = "conference_user_participant_joined";
export declare const CONFERENCE_USER_PARTICIPANT_LEFT = "conference_user_participant_left";
export declare const CONFERENCE_USER_PARTICIPANT_TALK_STARTED = "conference_user_participant_talk_started";
export declare const CONFERENCE_USER_PARTICIPANT_TALK_STOPPED = "conference_user_participant_talk_stopped";
export declare const MEETING_USER_PARTICIPANT_JOINED = "meeting_user_participant_joined";
export declare const MEETING_USER_PARTICIPANT_LEFT = "meeting_user_participant_left";
export declare const SWITCHBOARD_QUEUED_CALLS_UPDATED = "switchboard_queued_calls_updated";
export declare const SWITCHBOARD_QUEUED_CALL_ANSWERED = "switchboard_queued_call_answered";
export declare const SWITCHBOARD_HELD_CALLS_UPDATED = "switchboard_held_calls_updated";
export declare const SWITCHBOARD_HELD_CALL_ANSWERED = "switchboard_held_call_answered";
export declare const FAX_OUTBOUND_USER_CREATED = "fax_outbound_user_created";
export declare const FAX_OUTBOUND_USER_SUCCEEDED = "fax_outbound_user_succeeded";
export declare const FAX_OUTBOUND_USER_FAILED = "fax_outbound_user_failed";
export declare const APPLICATION_CALL_DTMF_RECEIVED = "application_call_dtmf_received";
export declare const APPLICATION_CALL_ENTERED = "application_call_entered";
export declare const APPLICATION_CALL_INITIATED = "application_call_initiated";
export declare const APPLICATION_CALL_DELETED = "application_call_deleted";
export declare const APPLICATION_CALL_UPDATED = "application_call_updated";
export declare const APPLICATION_CALL_ANSWERED = "application_call_answered";
export declare const APPLICATION_PROGRESS_STARTED = "application_progress_started";
export declare const APPLICATION_PROGRESS_STOPPED = "application_progress_stopped";
export declare const APPLICATION_DESTINATION_NODE_CREATED = "application_destination_node_created";
export declare const APPLICATION_NODE_CREATED = "application_node_created";
export declare const APPLICATION_NODE_DELETED = "application_node_deleted";
export declare const APPLICATION_NODE_UPDATED = "application_node_updated";
export declare const APPLICATION_PLAYBACK_CREATED = "application_playback_created";
export declare const APPLICATION_PLAYBACK_DELETED = "application_playback_deleted";
export declare const APPLICATION_SNOOP_CREATED = "application_snoop_created";
export declare const APPLICATION_SNOOP_DELETED = "application_snoop_deleted";
export declare const APPLICATION_SNOOP_UPDATED = "application_snoop_updated";
export declare const APPLICATION_USER_OUTGOING_CALL_CREATED = "application_user_outgoing_call_created";
export declare const TRUNK_STATUS_UPDATED = "trunk_status_updated";
export declare const LINE_STATUS_UPDATED = "line_status_updated";
export declare const AGENT_STATUS_UPDATE = "agent_status_update";
export declare const AGENT_PAUSED = "agent_paused";
export declare const AGENT_UNPAUSED = "agent_unpaused";
export declare const AGENT_QUEUE_LOGGED_IN = "user_agent_queue_logged_in";
export declare const AGENT_QUEUE_LOGGED_OUT = "user_agent_queue_logged_out";
export declare const CONFERENCE_ADHOC_PARTICIPANT_LEFT = "conference_adhoc_participant_left";
export declare const CONFERENCE_ADHOC_DELETED = "conference_adhoc_deleted";
export declare const MEETING_USER_PROGRESS = "meeting_user_progress";
export declare const MEETING_USER_GUEST_AUTHORIZATION_CREATED = "meeting_user_guest_authorization_created";
export declare const HEARTBEAT_ENGINE_VERSION = "20.09";
declare class WebSocketClient extends Emitter {
    initialized: boolean;
    session?: Session;
    host: string | null | undefined;
    version: number | undefined;
    token: string | null | undefined;
    events: Array<string> | undefined;
    options: Record<string, any>;
    socket: ReconnectingWebSocket | null | undefined;
    _boundOnHeartbeat: (...args: Array<any>) => any;
    heartbeat: Heartbeat;
    onHeartBeatTimeout: (...args: Array<any>) => any;
    heartbeatCb: (...args: Array<any>) => any;
    eventLists: string[];
    static eventLists: Array<string>;
    /**
     *
     * @param host
     * @param token
     * @param events
     * @param version
     * @param heartbeat
     * @param session
     * @param options @see https://github.com/pladaria/reconnecting-websocket#available-options
     */
    constructor({ host, token, version, events, heartbeat, session, }: Arguments, options?: Record<string, any>);
    connect(): void;
    close(force?: boolean): void;
    updateToken(token: string): void;
    hasHeartbeat(): boolean;
    startHeartbeat(): void;
    stopHeartbeat(): void;
    setOnHeartbeatTimeout(cb: (...args: Array<any>) => any): void;
    setOnHeartbeatCallback(cb: (...args: Array<any>) => any): void;
    pingServer(): void;
    isConnected(): boolean | null | undefined;
    reconnect(reason: string): void;
    _handleInitMessage(message: WebSocketMessage, sock: ReconnectingWebSocket): void;
    _handleMessage(message: Record<string, any>): void;
    _getUrl(): string;
    _onHeartbeat(message: Record<string, any>): void;
    _onHeartbeatTimeout(): Promise<void>;
}
export default WebSocketClient;
//# sourceMappingURL=websocket-client.d.ts.map