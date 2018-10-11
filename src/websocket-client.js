// @flow
import ReconnectingWebSocket from 'reconnecting-websocket';

import CallbacksHandler from './utils/CallbacksHandler';

type WebSocketClientArguments = {
  host: string,
  token: string,
  events: Array<string>
};

export default class WebSocketClient {
  initialized: boolean;
  host: string;
  token: string;
  events: Array<string>;
  callbacksHandler: CallbacksHandler;
  options: Object;
  socket: ?ReconnectingWebSocket;

  /**
   *
   * @param host
   * @param token
   * @param events
   * @param options @see https://github.com/pladaria/reconnecting-websocket#available-options
   */
  constructor({ host, token, events = [] }: WebSocketClientArguments, options: Object = {}) {
    this.initialized = false;
    this.callbacksHandler = new CallbacksHandler();

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
        this.callbacksHandler.triggerCallback(message.name, message);
      }
    };

    this.socket.onclose = e => {
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

  on(event: string, callback: Function) {
    this.callbacksHandler.on(event, callback);
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
        this.callbacksHandler.triggerCallback('message', message);
    }
  }
}
