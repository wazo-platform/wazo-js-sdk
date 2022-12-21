import type Session from '../domain/Session';
import WazoWebSocketClient, * as WebSocketClient from '../websocket-client';
import Emitter from '../utils/Emitter';
import IssueReporter from '../service/IssueReporter';

const { SOCKET_EVENTS, ...OTHER_EVENTS } = WebSocketClient;
const ALL_EVENTS = [...Object.values(SOCKET_EVENTS), ...Object.values(OTHER_EVENTS)];

const logger = IssueReporter.loggerFor('simple-ws-client');

class Websocket extends Emitter {
  ws: ?WazoWebSocketClient;

  eventLists: string[];

  constructor() {
    super();

    // Sugar syntax for `Wazo.WebSocket.EVENT_NAME`
    Object.keys(OTHER_EVENTS).forEach(key => {
      // $FlowFixMe
      this[key] = OTHER_EVENTS[key];
    });
    Object.keys(SOCKET_EVENTS).forEach(key => {
      // $FlowFixMe
      this[key] = SOCKET_EVENTS[key];
    });
    this.eventLists = WazoWebSocketClient.eventLists;

    this.ws = null;
  }

  open(host: string, session: Session) {
    logger.info('open simple WebSocket', { host, token: session.token });
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
    ALL_EVENTS.forEach((event: any) => {
      if (!this.ws) {
        return;
      }
      this.ws.on(event, (payload: Object) => {
        this.eventEmitter.emit(event, payload);
      });
    });
  }

  updateToken(token: string) {
    logger.info('update token via simple Websocket', { token, ws: !!this.ws });

    if (!this.ws) {
      return;
    }
    this.ws.updateToken(token);
  }

  isOpen() {
    return this.ws && this.ws.isConnected();
  }

  close(force: boolean = false) {
    logger.info('Closing Wazo websocket', { force, ws: !!this.ws });

    if (this.ws) {
      this.ws.close(force);
    }
    this.unbind();
  }
}

if (!global.wazoWebsocketInstance) {
  global.wazoWebsocketInstance = new Websocket();
}

export default global.wazoWebsocketInstance;
