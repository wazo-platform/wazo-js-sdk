// @flow
/* eslint-disable no-underscore-dangle */
import ReconnectingWebSocket from 'reconnecting-websocket';
import Emitter from './utils/Emitter';
import type { WebSocketMessage } from './types/WebSocketMessage';
import IssueReporter from './service/IssueReporter';

export const SOCKET_EVENTS = {
  ON_OPEN: 'onopen',
  ON_ERROR: 'onerror',
  ON_CLOSE: 'onclose',
  INITIALIZED: 'initialized',
};

type WebSocketClientArguments = {
  host: string,
  token: string,
  events: Array<string>,
  version?: number,
};

export const AUTH_SESSION_EXPIRE_SOON = 'auth_session_expire_soon';
export const FAVORITE_ADDED = 'favorite_added';
export const FAVORITE_DELETED = 'favorite_deleted';
export const USER_STATUS_UPDATE = 'user_status_update';
export const CHAT_MESSAGE_SENT = 'chat_message_sent';
export const CHAT_MESSAGE_RECEIVED = 'chat_message_received';
export const ENDPOINT_STATUS_UPDATE = 'endpoint_status_update';
export const USERS_FORWARDS_BUSY_UPDATED = 'users_forwards_busy_updated';
export const USERS_FORWARDS_NOANSWER_UPDATED = 'users_forwards_noanswer_updated';
export const USERS_FORWARDS_UNCONDITIONAL_UPDATED = 'users_forwards_unconditional_updated';
export const USERS_SERVICES_DND_UPDATED = 'users_services_dnd_updated';
export const USER_VOICEMAIL_MESSAGE_CREATED = 'user_voicemail_message_created';
export const USER_VOICEMAIL_MESSAGE_DELETED = 'user_voicemail_message_deleted';
export const CALL_LOG_USER_CREATED = 'call_log_user_created';
export const CALL_CREATED = 'call_created';
export const CALL_ENDED = 'call_ended';
export const CALL_UPDATED = 'call_updated';
export const CALL_HELD = 'call_held';
export const CALL_RESUMED = 'call_resumed';
export const AUTH_USER_EXTERNAL_AUTH_ADDED = 'auth_user_external_auth_added';
export const AUTH_USER_EXTERNAL_AUTH_DELETED = 'auth_user_external_auth_deleted';
export const CHATD_PRESENCE_UPDATED = 'chatd_presence_updated';
export const CHATD_USER_ROOM_MESSAGE_CREATED = 'chatd_user_room_message_created';
export const CHATD_USER_ROOM_CREATED = 'chatd_user_room_created';
export const CONFERENCE_USER_PARTICIPANT_JOINED = 'conference_user_participant_joined';
export const CONFERENCE_USER_PARTICIPANT_LEFT = 'conference_user_participant_left';
export const SWITCHBOARD_QUEUED_CALLS_UPDATED = 'switchboard_queued_calls_updated';
export const SWITCHBOARD_QUEUED_CALL_ANSWERED = 'switchboard_queued_call_answered';
export const SWITCHBOARD_HELD_CALLS_UPDATED = 'switchboard_held_calls_updated';
export const SWITCHBOARD_HELD_CALL_ANSWERED = 'switchboard_held_call_answered';
export const FAX_OUTBOUND_USER_CREATED = 'fax_outbound_user_created';
export const FAX_OUTBOUND_USER_SUCCEEDED = 'fax_outbound_user_succeeded';
export const FAX_OUTBOUND_USER_FAILED = 'fax_outbound_user_failed';
export const APPLICATION_CALL_DTMF_RECEIVED = 'application_call_dtmf_received';
export const APPLICATION_CALL_ENTERED = 'application_call_entered';
export const APPLICATION_CALL_INITIATED = 'application_call_initiated';
export const APPLICATION_CALL_DELETED = 'application_call_deleted';
export const APPLICATION_CALL_UPDATED = 'application_call_updated';
export const APPLICATION_CALL_ANSWERED = 'application_call_answered';
export const APPLICATION_PROGRESS_STARTED = 'application_progress_started';
export const APPLICATION_PROGRESS_STOPPED = 'application_progress_stopped';
export const APPLICATION_DESTINATION_NODE_CREATED = 'application_destination_node_created';
export const APPLICATION_NODE_CREATED = 'application_node_created';
export const APPLICATION_NODE_DELETED = 'application_node_deleted';
export const APPLICATION_NODE_UPDATED = 'application_node_updated';
export const APPLICATION_PLAYBACK_CREATED = 'application_playback_created';
export const APPLICATION_PLAYBACK_DELETED = 'application_playback_deleted';
export const APPLICATION_SNOOP_CREATED = 'application_snoop_created';
export const APPLICATION_SNOOP_DELETED = 'application_snoop_deleted';
export const APPLICATION_SNOOP_UPDATED = 'application_snoop_updated';
export const APPLICATION_USER_OUTGOING_CALL_CREATED = 'application_user_outgoing_call_created';

const BLACKLIST_EVENTS = [
  CHAT_MESSAGE_SENT,
  CHAT_MESSAGE_RECEIVED,
  CHATD_USER_ROOM_MESSAGE_CREATED,
  CHATD_USER_ROOM_CREATED,
];

class WebSocketClient extends Emitter {
  initialized: boolean;
  host: string;
  version: number;
  token: string;
  events: Array<string>;
  options: Object;
  socket: ?ReconnectingWebSocket;

  static eventLists: Array<string>;

  /**
   *
   * @param host
   * @param token
   * @param events
   * @param version
   * @param options @see https://github.com/pladaria/reconnecting-websocket#available-options
   */
  constructor({ host, token, version = 1, events = [] }: WebSocketClientArguments, options: Object = {}) {
    super();
    this.initialized = false;

    this.socket = null;
    this.host = host;
    this.token = token;
    this.events = events;
    this.options = options;
    this.version = version;
  }

  connect() {
    IssueReporter.log(IssueReporter.INFO, '[WebSocketClient][connect]');
    this.socket = new ReconnectingWebSocket(this._getUrl(), [], this.options);
    if (this.options.binaryType) {
      this.socket.binaryType = this.options.binaryType;
    }

    this.socket.onopen = () => {
      IssueReporter.log(IssueReporter.INFO, '[WebSocketClient][connect] onopen');
      this.eventEmitter.emit(SOCKET_EVENTS.ON_OPEN);
    };

    this.socket.onerror = error => {
      IssueReporter.log(IssueReporter.ERROR, '[WebSocketClient] onerror', JSON.stringify(error));
      this.eventEmitter.emit(SOCKET_EVENTS.ON_ERROR);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(typeof event.data === 'string' ? event.data : '{}');
      let { name } = message;
      if (message.data && message.data.name) {
        // eslint-disable-next-line
        name = message.data.name;
      }

      if (BLACKLIST_EVENTS.indexOf(name) === -1) {
        IssueReporter.log(IssueReporter.INFO, '[WebSocketClient] onmessage', event.data);
      }

      if (!this.initialized) {
        this._handleInitMessage(message, this.socket);
      } else {
        this._handleMessage(message);
      }
    };

    this.socket.onclose = e => {
      IssueReporter.log(IssueReporter.INFO, '[WebSocketClient] onclose', JSON.stringify(e));
      this.initialized = false;
      this.eventEmitter.emit(SOCKET_EVENTS.ON_CLOSE);

      switch (e.code) {
        case 4002:
          break;
        case 4003:
          break;
        default:
      }
    };
  }

  close(): void {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  }

  updateToken(token: string) {
    this.token = token;
    IssueReporter.log(IssueReporter.INFO, '[WebSocketClient] updateToken', !!this.socket);

    if (this.socket) {
      // If still connected, send the token to the WS
      if (this.socket.readyState === this.socket.OPEN && this.version >= 2) {
        this.socket.send(JSON.stringify({ op: 'token', data: { token } }));
        return;
      }
      // $FlowFixMe
      this.socket._url = this._getUrl();
    }
  }

  _handleInitMessage(message: WebSocketMessage, sock: ReconnectingWebSocket) {
    switch (message.op) {
      case 'init':
        this.events.forEach(event => {
          const op = {
            op: 'subscribe',
            data: { event_name: event },
          };

          sock.send(JSON.stringify(op));
        });

        sock.send(JSON.stringify({ op: 'start' }));
        break;
      case 'subscribe':
        break;
      case 'start':
        this.initialized = true;
        this.eventEmitter.emit(SOCKET_EVENTS.INITIALIZED);
        break;
      default:
        this.eventEmitter.emit('message', message);
    }
  }

  _handleMessage(message: Object) {
    if (this.version === 1) {
      this.eventEmitter.emit(message.name, message);
      return;
    }

    if (this.version >= 2 && message.op === 'event') {
      this.eventEmitter.emit(message.data.name, message.data);
    }
  }

  _getUrl() {
    return `wss://${this.host}/api/websocketd/?token=${this.token}&version=${this.version}`;
  }
}

// Can't use static
WebSocketClient.eventLists = [
  AUTH_SESSION_EXPIRE_SOON,
  FAVORITE_ADDED,
  FAVORITE_DELETED,
  USER_STATUS_UPDATE,
  CHAT_MESSAGE_SENT,
  CHAT_MESSAGE_RECEIVED,
  ENDPOINT_STATUS_UPDATE,
  USERS_FORWARDS_BUSY_UPDATED,
  USERS_FORWARDS_NOANSWER_UPDATED,
  USERS_FORWARDS_UNCONDITIONAL_UPDATED,
  USERS_SERVICES_DND_UPDATED,
  USER_VOICEMAIL_MESSAGE_CREATED,
  USER_VOICEMAIL_MESSAGE_DELETED,
  CALL_LOG_USER_CREATED,
  CALL_CREATED,
  CALL_ENDED,
  CALL_UPDATED,
  CALL_HELD,
  CALL_RESUMED,
  AUTH_USER_EXTERNAL_AUTH_ADDED,
  AUTH_USER_EXTERNAL_AUTH_DELETED,
  CHATD_PRESENCE_UPDATED,
  CHATD_USER_ROOM_MESSAGE_CREATED,
  CHATD_USER_ROOM_CREATED,
  CONFERENCE_USER_PARTICIPANT_JOINED,
  CONFERENCE_USER_PARTICIPANT_LEFT,
  SWITCHBOARD_QUEUED_CALLS_UPDATED,
  SWITCHBOARD_QUEUED_CALL_ANSWERED,
  SWITCHBOARD_HELD_CALLS_UPDATED,
  SWITCHBOARD_HELD_CALL_ANSWERED,
  FAX_OUTBOUND_USER_CREATED,
  FAX_OUTBOUND_USER_SUCCEEDED,
  FAX_OUTBOUND_USER_FAILED,
  APPLICATION_CALL_DTMF_RECEIVED,
  APPLICATION_CALL_ENTERED,
  APPLICATION_CALL_INITIATED,
  APPLICATION_CALL_DELETED,
  APPLICATION_CALL_UPDATED,
  APPLICATION_CALL_ANSWERED,
  APPLICATION_PROGRESS_STARTED,
  APPLICATION_PROGRESS_STOPPED,
  APPLICATION_DESTINATION_NODE_CREATED,
  APPLICATION_NODE_CREATED,
  APPLICATION_NODE_DELETED,
  APPLICATION_NODE_UPDATED,
  APPLICATION_PLAYBACK_CREATED,
  APPLICATION_PLAYBACK_DELETED,
  APPLICATION_SNOOP_CREATED,
  APPLICATION_SNOOP_DELETED,
  APPLICATION_SNOOP_UPDATED,
  APPLICATION_USER_OUTGOING_CALL_CREATED,
];

export default WebSocketClient;
