// @flow
import ReconnectingWebSocket from 'reconnecting-websocket';

type ConstructorParams = { callback: Function, host: string, token: string, events: Array<string> };

export default class WebSocketClient {
  initialized: boolean;
  callback: Function;
  host: string;
  token: string;
  events: Array<string>;

  constructor({ callback, host, token, events = [] }: ConstructorParams) {
    this.initialized = false;
    this.callback = callback;
    this.host = host;
    this.token = token;
    this.events = events;
  }

  connect() {
    const sock = new ReconnectingWebSocket(`wss://${this.host}/api/websocketd/?token=${this.token}`);
    sock.debug = false;

    sock.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(typeof event.data === 'string' ? event.data : '{}');

      if (!this.initialized) {
        this.handleMessage(message, sock);
      } else {
        this.callback(message);
      }
    };

    sock.onclose = e => {
      switch (e.code) {
        case 4002:
          break;
        case 4003:
          break;
        default:
      }
    };

    return sock;
  }

  handleMessage(message: Object, sock: WebSocket) {
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
      // nothing
    }
  }
}
