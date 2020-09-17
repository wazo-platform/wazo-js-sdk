// @flow
import type Session from '../domain/Session';
import WazoWebSocketClient, * as SOCKET_EVENTS from '../websocket-client';
import Emitter from '../utils/Emitter';

class Websocket extends Emitter {
  ws: ?WazoWebSocketClient;

  constructor() {
    super();

    // Sugar syntax for `Wazo.WebSocket.EVENT_NAME`
    Object.keys(SOCKET_EVENTS).forEach(key => {
      // $FlowFixMe
      this[key] = SOCKET_EVENTS[key];
    });

    this.ws = null;
  }

  open(host: string, session: Session) {
    this.ws = new WazoWebSocketClient(
      {
        host,
        token: session.token,
        events: ['*'],
        version: 2,
      },
      {
        rejectUnauthorized: false,
        binaryType: 'arraybuffer',
      },
    );

    this.ws.connect();

    // Re-emit all events
    Object.values(SOCKET_EVENTS).forEach((event: any) => {
      if (!this.ws) {
        return;
      }
      this.ws.on(event, (payload: Object) => {
        this.eventEmitter.emit(event, payload);
      });
    });
  }

  updateToken(token: string) {
    if (!this.ws) {
      return;
    }
    this.ws.updateToken(token);
  }

  isOpen() {
    return this.ws && this.ws.isConnected();
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
    this.unbind();
  }
}

if (!global.wazoWebsocketInstance) {
  global.wazoWebsocketInstance = new Websocket();
}

export default global.wazoWebsocketInstance;
