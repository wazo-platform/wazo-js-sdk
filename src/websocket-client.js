// @flow
import ReconnectingWebSocket from 'reconnecting-websocket';
import Emitter from './utils/Emitter';

export const SOCKET_EVENTS = {
  ON_OPEN: 'onopen',
  ON_ERROR: 'onerror',
  ON_CLOSE: 'onclose'
};

type WebSocketClientArguments = {
  host: string,
  token: string,
  events: Array<string>
};

class WebSocketClient extends Emitter {
  initialized: boolean;
  host: string;
  token: string;
  events: Array<string>;
  options: Object;
  socket: ?ReconnectingWebSocket;
  listeners: Array<{name: string, callback: Function}>;

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
    this.listeners = [];
  }

  connect() {
    this.socket = new ReconnectingWebSocket(`wss://${this.host}/api/websocketd/?token=${this.token}`, [], this.options);
    if (this.options.binaryType) {
      this.socket.binaryType = this.options.binaryType;
    }

    this.socket.onopen = () => {
      this.publish(SOCKET_EVENTS.ON_OPEN);
    };

    this.socket.onerror = () => {
      this.publish(SOCKET_EVENTS.ON_ERROR);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(typeof event.data === 'string' ? event.data : '{}');

      if (!this.initialized) {
        this.handleMessage(message, this.socket);
      } else {
        this.eventEmitter.emit(message.name, message);
      }
    };

    this.socket.onclose = e => {
      this.initialized = false;
      this.publish(SOCKET_EVENTS.ON_CLOSE);

      switch (e.code) {
        case 4002:
          break;
        case 4003:
          break;
        default:
      }
    };
  }

  addListener(eventname: string, callback: Function) {
    this.listeners.push({name: eventname, callback});
  }

  publish(eventname: string) {
    this.listeners
        .filter(listener => listener.name === eventname)
        .forEach(listener => listener.callback());
  }

  close(): void {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  }

  handleMessage(message: Object, sock: ReconnectingWebSocket) {
    switch (message.op) {
      case 'init':
        this.events.forEach(event => {
          const op = {
            op: 'subscribe',
            data: { event_name: event }
          };

          sock.send(JSON.stringify(op));
        });

        sock.send(JSON.stringify({ op: 'start' }));
        break;
      case 'subscribe':
        break;
      case 'start':
        this.initialized = true;
        break;
      default:
        this.eventEmitter.emit('message', message);
    }
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
  'chatd_presence_updated'
];

export default WebSocketClient;
