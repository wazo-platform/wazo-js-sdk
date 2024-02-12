/* eslint-disable no-underscore-dangle */
import ReconnectingWebSocket, { ErrorEvent } from 'reconnecting-websocket';

import Session from './domain/Session';
import Emitter from './utils/Emitter';
import type { WebSocketMessage } from './types/WebSocketMessage';
import IssueReporter from './service/IssueReporter';
import Heartbeat from './utils/Heartbeat';
import { obfuscateToken } from './utils/string';

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum SOCKET_EVENTS {
  ON_OPEN = 'onopen',
  ON_MESSAGE = 'onmessage',
  ON_ERROR = 'onerror',
  ON_CLOSE = 'onclose',
  INITIALIZED = 'initialized',
  ON_AUTH_FAILED = 'on_auth_failed',
}

type Arguments = {
  host: string;
  token: string;
  events?: Array<string>;
  version?: number;
  session?: Session,
  heartbeat?: {
    delay: number;
    timeout: number;
    max: number;
  };
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
export const USER_VOICEMAIL_MESSAGE_UPDATED = 'user_voicemail_message_updated';
export const USER_VOICEMAIL_MESSAGE_DELETED = 'user_voicemail_message_deleted';
export const CALL_LOG_USER_CREATED = 'call_log_user_created';
export const CALL_CREATED = 'call_created';
export const CALL_ANSWERED = 'call_answered';
export const CALL_DTMF_CREATED = 'call_dtmf_created';
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
export const CONFERENCE_USER_PARTICIPANT_TALK_STARTED = 'conference_user_participant_talk_started';
export const CONFERENCE_USER_PARTICIPANT_TALK_STOPPED = 'conference_user_participant_talk_stopped';
export const MEETING_USER_PARTICIPANT_JOINED = 'meeting_user_participant_joined';
export const MEETING_USER_PARTICIPANT_LEFT = 'meeting_user_participant_left';
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
export const TRUNK_STATUS_UPDATED = 'trunk_status_updated';
export const LINE_STATUS_UPDATED = 'line_status_updated';
export const AGENT_STATUS_UPDATE = 'agent_status_update';
export const AGENT_PAUSED = 'agent_paused';
export const AGENT_UNPAUSED = 'agent_unpaused';
export const CONFERENCE_ADHOC_PARTICIPANT_LEFT = 'conference_adhoc_participant_left';
export const CONFERENCE_ADHOC_DELETED = 'conference_adhoc_deleted';
export const MEETING_USER_PROGRESS = 'meeting_user_progress';
export const MEETING_USER_GUEST_AUTHORIZATION_CREATED = 'meeting_user_guest_authorization_created';
const BLACKLIST_EVENTS = [CHAT_MESSAGE_SENT, CHAT_MESSAGE_RECEIVED, CHATD_USER_ROOM_MESSAGE_CREATED, CHATD_USER_ROOM_CREATED];
export const HEARTBEAT_ENGINE_VERSION = '20.09';
const logger = IssueReporter.loggerFor('wazo-ws');
const messageLogger = IssueReporter.loggerFor('wazo-ws-message');

class WebSocketClient extends Emitter {
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
  constructor({
    host,
    token,
    version,
    events,
    heartbeat,
    session,
  }: Arguments, options: Record<string, any> = {
    host,
    token,
    version: 1,
    events: [],
    heartbeat: {},
    session: null,
  }) {
    super();
    this.initialized = false;
    this.socket = null;
    this.host = host;
    this.token = token;
    this.events = events;
    this.options = options;
    this.version = version;
    this.session = session;
    this._boundOnHeartbeat = this._onHeartbeat.bind(this);
    const {
      delay,
      timeout,
      max,
    }: any = heartbeat || {};
    this.heartbeat = new Heartbeat(delay, timeout, max);
    this.heartbeat.setSendHeartbeat(this.pingServer.bind(this));
    this.heartbeat.setOnHeartbeatTimeout(this._onHeartbeatTimeout.bind(this));
    this.eventLists = WebSocketClient.eventLists;
  }

  connect() {
    logger.info('connect method started', {
      host: this.host,
      token: obfuscateToken(this.token),
    });
    this.socket = new ReconnectingWebSocket(this._getUrl.bind(this), [], this.options);

    if (this.options.binaryType) {
      this.socket.binaryType = this.options.binaryType;
    }

    this.socket.onopen = () => {
      logger.info('on Wazo WS open', {
        method: 'connect',
        host: this.host,
      });
      this.eventEmitter.emit(SOCKET_EVENTS.ON_OPEN);
    };

    this.socket.onerror = event => {
      logger.error('on Wazo WS error', event.target);
      this.eventEmitter.emit(SOCKET_EVENTS.ON_ERROR, event);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      this.eventEmitter.emit(SOCKET_EVENTS.ON_MESSAGE, event.data);
      const message = JSON.parse(typeof event.data === 'string' ? event.data : '{}');
      let {
        name,
      } = message;

      if (message.data && message.data.name) {
        // eslint-disable-next-line
        name = message.data.name;
      }

      if (BLACKLIST_EVENTS.indexOf(name) === -1) {
        messageLogger.trace(IssueReporter.removeSlashes(event.data), {
          method: 'onmessage',
        });
      } else {
        messageLogger.trace(`{"name": "${name}", "info": "content not shown"}`, {
          method: 'onmessage',
        });
      }

      if (!this.initialized) {
        this._handleInitMessage(message, this.socket as ReconnectingWebSocket);
      } else {
        this._handleMessage(message);
      }
    };

    this.socket.onclose = event => {
      // Can't be converted to JSON (circular structure)
      logger.info('on Wazo WS close', {
        reason: event.reason,
        code: event.code,
        readyState: event.target.readyState,
        host: this.host,
        token: obfuscateToken(this.token),
      });
      this.initialized = false;
      this.eventEmitter.emit(SOCKET_EVENTS.ON_CLOSE, event);

      switch (event.code) {
        case 4002:
          this.eventEmitter.emit(SOCKET_EVENTS.ON_AUTH_FAILED);
          break;

        case 4003:
          break;

        default:
      }
    };

    this.socket.onerror = (event: ErrorEvent & { code?: any }) => {
      logger.info('Wazo WS error', {
        message: event.message,
        code: event.code,
        readyState: event.target.readyState,
      });
    };
  }

  close(force = false): void {
    logger.info('Wazo WS close', {
      socket: !!this.socket,
      host: this.host,
      token: obfuscateToken(this.token),
    });

    if (!this.socket) {
      return;
    }

    this.socket.close();
    this.initialized = false;

    if (force) {
      this.host = null;
      this.token = null;
      this.socket = null;
    }
  }

  updateToken(token: string) {
    this.token = token;
    logger.info('Wazo WS updating token', {
      url: this._getUrl(),
      token: obfuscateToken(token),
      socket: !!this.socket,
    });

    if (this.socket) {
      // If still connected, send the token to the WS
      if (this.isConnected() && Number(this.version) >= 2) {
        this.socket.send(JSON.stringify({
          op: 'token',
          data: {
            token,
          },
        }));
      } else if (!this.isConnected()) {
        this.reconnect('token refreshed');
      }
    }
  }

  hasHeartbeat() {
    return this.heartbeat.hasHeartbeat;
  }

  startHeartbeat() {
    logger.info('Wazo WS start heartbeat', {
      host: this.host,
      token: obfuscateToken(this.token),
    });

    if (!this.socket) {
      this.heartbeat.stop();
      return;
    }

    this.off('pong', this._boundOnHeartbeat);
    this.on('pong', this._boundOnHeartbeat);
    this.heartbeat.start();
  }

  stopHeartbeat() {
    logger.info('Wazo WS stop heartbeat', {
      host: this.host,
      token: obfuscateToken(this.token),
    });
    this.heartbeat.stop();
  }

  setOnHeartbeatTimeout(cb: (...args: Array<any>) => any) {
    this.onHeartBeatTimeout = cb;
  }

  setOnHeartbeatCallback(cb: (...args: Array<any>) => any) {
    this.heartbeatCb = cb;
  }

  pingServer() {
    if (!this.socket || !this.isConnected()) {
      return;
    }

    try {
      this.socket.send(JSON.stringify({
        op: 'ping',
        data: {
          payload: 'pong',
        },
      }));
    } catch (_) { // Nothing to do
    }
  }

  isConnected() {
    return this.socket && this.socket.readyState === this.socket.OPEN;
  }

  reconnect(reason: string) {
    logger.info('Wazo WS reconnect', {
      reason,
      socket: !!this.socket,
      host: this.host,
      token: obfuscateToken(this.token),
    });

    if (!this.socket) {
      return;
    }

    // @HEADS UP: first arg is `code`, second is `reason`; inputing arbitrary value for `code`
    this.socket.reconnect(0, reason);
  }

  _handleInitMessage(message: WebSocketMessage, sock: ReconnectingWebSocket) {
    switch (message.op) {
      case 'init':
        this.events?.forEach(event => {
          const op = {
            op: 'subscribe',
            data: {
              event_name: event,
            },
          };
          sock.send(JSON.stringify(op));
        });
        sock.send(JSON.stringify({
          op: 'start',
        }));
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

  _handleMessage(message: Record<string, any>) {
    if (message.op === 'pong') {
      this.eventEmitter.emit('pong', message.data);

      if (this.heartbeatCb) {
        this.heartbeatCb();
      }

      return;
    }

    if (this.version === 1) {
      this.eventEmitter.emit(message.name, message);
      return;
    }

    if (Number(this.version) >= 2 && message.op === 'event') {
      this.eventEmitter.emit(message.data.name, message.data);
    }
  }

  _getUrl() {
    if (!this.host || !this.token) {
      this.close();
    }

    let url = `wss://${this.host || ''}/api/websocketd/?token=${this.token || ''}&version=${this.version}`;
    if (this.session) {
      url += `&userUuid=${this.session.uuid}`;
    }

    logger.info('Wazo WS url computed to reconnect', {
      url: url.replace(this.token!, obfuscateToken(this.token) as string),
    });
    return url;
  }

  _onHeartbeat(message: Record<string, any>) {
    if (message.payload === 'pong') {
      this.heartbeat.onHeartbeat();
      logger.log('on heartbeat received from Wazo WS');
    }
  }

  async _onHeartbeatTimeout() {
    logger.log('heartbeat timed out', {
      host: this.host,
      token: obfuscateToken(this.token),
    });
    this.close();
    this.eventEmitter.emit(SOCKET_EVENTS.ON_CLOSE, new Error('Websocket ping failure.'));

    if (this.onHeartBeatTimeout) {
      this.onHeartBeatTimeout();
    }
  }

} // Can't use static

WebSocketClient.eventLists = [AUTH_SESSION_EXPIRE_SOON, FAVORITE_ADDED, FAVORITE_DELETED, USER_STATUS_UPDATE, CHAT_MESSAGE_SENT, CHAT_MESSAGE_RECEIVED, ENDPOINT_STATUS_UPDATE, USERS_FORWARDS_BUSY_UPDATED, USERS_FORWARDS_NOANSWER_UPDATED, USERS_FORWARDS_UNCONDITIONAL_UPDATED, USERS_SERVICES_DND_UPDATED, USER_VOICEMAIL_MESSAGE_CREATED, USER_VOICEMAIL_MESSAGE_UPDATED, USER_VOICEMAIL_MESSAGE_DELETED, CALL_LOG_USER_CREATED, CALL_ANSWERED, CALL_CREATED, CALL_DTMF_CREATED, CALL_ENDED, CALL_UPDATED, CALL_HELD, CALL_RESUMED, AUTH_USER_EXTERNAL_AUTH_ADDED, AUTH_USER_EXTERNAL_AUTH_DELETED, CHATD_PRESENCE_UPDATED, CHATD_USER_ROOM_MESSAGE_CREATED, CHATD_USER_ROOM_CREATED, CONFERENCE_USER_PARTICIPANT_JOINED, CONFERENCE_USER_PARTICIPANT_LEFT, MEETING_USER_PARTICIPANT_JOINED, MEETING_USER_PARTICIPANT_LEFT, CONFERENCE_USER_PARTICIPANT_TALK_STARTED, CONFERENCE_USER_PARTICIPANT_TALK_STOPPED, SWITCHBOARD_QUEUED_CALLS_UPDATED, SWITCHBOARD_QUEUED_CALL_ANSWERED, SWITCHBOARD_HELD_CALLS_UPDATED, SWITCHBOARD_HELD_CALL_ANSWERED, FAX_OUTBOUND_USER_CREATED, FAX_OUTBOUND_USER_SUCCEEDED, FAX_OUTBOUND_USER_FAILED, APPLICATION_CALL_DTMF_RECEIVED, APPLICATION_CALL_ENTERED, APPLICATION_CALL_INITIATED, APPLICATION_CALL_DELETED, APPLICATION_CALL_UPDATED, APPLICATION_CALL_ANSWERED, APPLICATION_PROGRESS_STARTED, APPLICATION_PROGRESS_STOPPED, APPLICATION_DESTINATION_NODE_CREATED, APPLICATION_NODE_CREATED, APPLICATION_NODE_DELETED, APPLICATION_NODE_UPDATED, APPLICATION_PLAYBACK_CREATED, APPLICATION_PLAYBACK_DELETED, APPLICATION_SNOOP_CREATED, APPLICATION_SNOOP_DELETED, APPLICATION_SNOOP_UPDATED, APPLICATION_USER_OUTGOING_CALL_CREATED, TRUNK_STATUS_UPDATED, LINE_STATUS_UPDATED, AGENT_STATUS_UPDATE, AGENT_PAUSED, AGENT_UNPAUSED, CONFERENCE_ADHOC_PARTICIPANT_LEFT, CONFERENCE_ADHOC_DELETED, MEETING_USER_PROGRESS, MEETING_USER_GUEST_AUTHORIZATION_CREATED];
export default WebSocketClient;
