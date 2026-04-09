import type Session from '../domain/Session';
import WazoWebSocketClient from '../websocket-client';
import Emitter from '../utils/Emitter';
import { WebsocketType } from '../domain/types';
export declare class Websocket extends Emitter {
    ws: WazoWebSocketClient | null | undefined;
    eventLists: string[];
    CONFERENCE_USER_PARTICIPANT_JOINED: string;
    CONFERENCE_USER_PARTICIPANT_LEFT: string;
    MEETING_USER_PARTICIPANT_JOINED: string;
    MEETING_USER_PARTICIPANT_LEFT: string;
    CALL_CREATED: string;
    constructor();
    open(host: string, session: Session): void;
    updateToken(token: string): void;
    isOpen(): boolean;
    close(force?: boolean): void;
}
declare const _default: WebsocketType;
export default _default;
//# sourceMappingURL=Websocket.d.ts.map