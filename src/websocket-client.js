// @flow
/* eslint-disable no-underscore-dangle */
import ReconnectingWebSocket from 'reconnecting-websocket';
import Emitter from './utils/Emitter';
import type { WebSocketMessage } from './types/WebSocketMessage';

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
};

class WebSocketClient extends Emitter {
  initialized: boolean;
  host: string;
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
   * @param options @see https://github.com/pladaria/reconnecting-websocket#available-options
   */
  constructor({ host, token, events = [] }: WebSocketClientArguments, options: Object = {}) {
    super();
    this.initialized = false;

    this.socket = null;
    this.host = host;
    this.token = token;
    this.events = events;
    this.options = options;
  }

  connect() {
    this.socket = new ReconnectingWebSocket(this._getUrl(), [], this.options);
    if (this.options.binaryType) {
      this.socket.binaryType = this.options.binaryType;
    }

    this.socket.onopen = () => {
      this.eventEmitter.emit(SOCKET_EVENTS.ON_OPEN);
    };

    this.socket.onerror = () => {
      this.eventEmitter.emit(SOCKET_EVENTS.ON_ERROR);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(typeof event.data === 'string' ? event.data : '{}');

      if (!this.initialized) {
        this.handleMessage(message, this.socket);
      } else if (message.op === 'event') {
        this.eventEmitter.emit(message.name || message.data.name, message.data || message);
      }
    };

    this.socket.onclose = e => {
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

  handleMessage(message: WebSocketMessage, sock: ReconnectingWebSocket) {
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

  updateToken(token: string) {
    this.token = token;

    if (this.socket) {
      // If still connected, send the token to the WS
      if (this.socket.readyState === this.socket.OPEN) {
        this.socket.send(JSON.stringify({ op: 'token', data: { token } }));
        return;
      }
      // $FlowFixMe
      this.socket._url = this._getUrl();
    }
  }

  _getUrl() {
    return `wss://${this.host}/api/websocketd/?token=${this.token}&version=2`;
  }
}

// Can't use static
WebSocketClient.eventLists = [
  'favorite_added',
  'favorite_deleted',
  'user_status_update',
  'chat_message_sent',
  'chat_message_received',
  'endpoint_status_update',
  'users_forwards_busy_updated',
  'users_forwards_noanswer_updated',
  'users_forwards_unconditional_updated',
  'users_services_dnd_updated',
  'user_voicemail_message_created',
  'user_voicemail_message_deleted',
  'call_log_user_created',
  'call_created',
  'call_ended',
  'call_updated',
  'call_held',
  'call_resumed',
  'auth_user_external_auth_added',
  'auth_user_external_auth_deleted',
  'chatd_presence_updated',
  'chatd_user_room_message_created',
  'chatd_user_room_created',
  'conference_user_participant_joined',
  'conference_user_participant_left',
  'switchboard_queued_calls_updated',
  'switchboard_queued_call_answered',
  'switchboard_held_calls_updated',
  'switchboard_held_call_answered',
  'fax_outbound_user_created',
  'fax_outbound_user_succeeded',
  'fax_outbound_user_failed',
];

export default WebSocketClient;
