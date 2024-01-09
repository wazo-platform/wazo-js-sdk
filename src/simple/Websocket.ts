import type Session from '../domain/Session';
import WazoWebSocketClient, * as WebSocketClient from '../websocket-client';
import Emitter, { IEmitter } from '../utils/Emitter';
import IssueReporter from '../service/IssueReporter';
import { obfuscateToken } from '../utils/string';

const {
  SOCKET_EVENTS,
  ...OTHER_EVENTS
} = WebSocketClient;
const ALL_EVENTS = [...Object.values(SOCKET_EVENTS), ...Object.values(OTHER_EVENTS)];
const logger = IssueReporter.loggerFor('simple-ws-client');

export interface IWebsocket extends IEmitter {
  ws: WazoWebSocketClient | null | undefined;
  eventLists: string[];

  CONFERENCE_USER_PARTICIPANT_JOINED: string;
  CONFERENCE_USER_PARTICIPANT_LEFT: string;
  MEETING_USER_PARTICIPANT_JOINED: string;
  MEETING_USER_PARTICIPANT_LEFT: string;
  CALL_CREATED: string;

  open: (host: string, session: Session) => void;
  updateToken: (token: string) => void;
  isOpen: () => boolean;
  close: (force?: boolean) => void;
}

class Websocket extends Emitter implements IWebsocket {
  ws: WazoWebSocketClient | null | undefined;

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

  open(host: string, session: Session) {
    logger.info('open simple WebSocket', {
      host,
      token: obfuscateToken(session.token),
    });
    this.ws = new WazoWebSocketClient({
      host,
      token: session.token,
      events: ['*'],
      version: 2,
      session,
    }, {
      rejectUnauthorized: false,
      binaryType: 'arraybuffer',
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
  global.wazoWebsocketInstance = new Websocket();
}

export default global.wazoWebsocketInstance;
