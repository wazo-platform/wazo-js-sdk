// @flow
import ReconnectingWebSocket from 'reconnecting-websocket';
import Emitter from './utils/Emitter';

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
    this.socket = new ReconnectingWebSocket(`wss://${this.host}/api/websocketd/?token=${this.token}`, [], this.options);
    if (this.options.binaryType) {
      this.socket.binaryType = this.options.binaryType;
    }

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
  'call_created',
  'call_ended',
  'call_updated',
  'call_log_user_created',
];

export default WebSocketClient
