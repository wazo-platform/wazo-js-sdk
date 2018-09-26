// @flow
import ReconnectingWebSocket from 'reconnecting-websocket';

import CallbacksHandler from './utils/CallbacksHandler';

export default class WebSocketClient {
  initialized: boolean;
  host: string;
  token: string;
  events: Array<string>;
  callbacksHandler: CallbacksHandler;

  constructor({ host, token, events = [] }: { host: string, token: string, events: Array<string> }) {
    this.initialized = false;
    this.callbacksHandler = new CallbacksHandler();

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
        this.callbacksHandler.triggerCallback(message.name, message);
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

  on(event: string, callback: Function) {
    this.callbacksHandler.on(event, callback);
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
