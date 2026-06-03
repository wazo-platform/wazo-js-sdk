import type Session from '../domain/Session';
import WazoWebSocketClient, * as WebSocketClient from '../websocket-client';
import Emitter from '../utils/Emitter';
import IssueReporter from '../service/IssueReporter';
import { obfuscateToken } from '../utils/string';
import { WebsocketType } from '../domain/types';

const {
  SOCKET_EVENTS,
  ...OTHER_EVENTS
} = WebSocketClient;
const ALL_EVENTS = [...Object.values(SOCKET_EVENTS), ...Object.values(OTHER_EVENTS)];
const logger = IssueReporter.loggerFor('simple-ws-client');

export class Websocket extends Emitter {
  ws: WazoWebSocketClient | null | undefined;

  // Opt-in (default off). When true, open() closes any previous client before creating a new one,
  // and connect() closes the previous socket too, so there is only ever one live connection. Keeps
  // existing consumers (web/desktop) on current behavior; mobile enables it to avoid
  // duplicate/overlapping sockets that double every event on push-wake.
  singleConnection = false;

  eventLists: string[];

  CONFERENCE_USER_PARTICIPANT_JOINED: string;

  CONFERENCE_USER_PARTICIPANT_LEFT: string;

  MEETING_USER_PARTICIPANT_JOINED: string;

  MEETING_USER_PARTICIPANT_LEFT: string;

  CALL_CREATED: string;

  constructor() {
    super();
    // Sugar syntax for `Wazo.WebSocket.EVENT_NAME`
    Object.keys(OTHER_EVENTS).forEach(key => {
      // @ts-ignore: keys
      this[key] = OTHER_EVENTS[key];
    });
    Object.keys(SOCKET_EVENTS).forEach(key => {
      // @ts-ignore: keys
      this[key] = SOCKET_EVENTS[key];
    });
    this.eventLists = WazoWebSocketClient.eventLists;
    this.ws = null;
  }

  enableSingleConnection(value = true) {
    this.singleConnection = value;
  }

  open(host: string, session: Session) {
    logger.info('open simple WebSocket', {
      host,
      token: obfuscateToken(session.token),
      singleConnection: this.singleConnection,
    });

    // Opt-in: tear down any previous client first so we never leave an orphaned, still-open socket
    // emitting events in parallel (which doubles every event delivered to the consumer).
    if (this.singleConnection && this.ws) {
      logger.info('single-connection: closing previous WS client before reconnecting');
      this.ws.close(true);
      this.ws = null;
    }

    this.ws = new WazoWebSocketClient({
      host,
      token: session.token,
      events: ['*'],
      version: 2,
      session,
    }, {
      rejectUnauthorized: false,
      binaryType: 'arraybuffer',
      singleConnection: this.singleConnection,
    });
    this.ws.connect();
    // Re-emit all events
    ALL_EVENTS.forEach((event: any) => {
      if (!this.ws) {
        return;
      }

      this.ws.on(event, (payload: Record<string, any>) => {
        this.eventEmitter.emit(event, payload);
      });
    });
  }

  updateToken(token: string) {
    logger.info('update token via simple Websocket', {
      token,
      ws: !!this.ws,
    });

    if (!this.ws) {
      return;
    }

    this.ws.updateToken(token);
  }

  isOpen(): boolean {
    return this.ws?.isConnected() || false;
  }

  close(force = false) {
    logger.info('Closing event transport websocket', { force, ws: !!this.ws });

    if (this.ws) {
      this.ws.close(force);
    }

    this.unbind();
  }

}

if (!global.wazoWebsocketInstance) {
  global.wazoWebsocketInstance = new Websocket() as WebsocketType;
}

// @ts-ignore: Circular definition of import alias 'default'.
export default global.wazoWebsocketInstance;
