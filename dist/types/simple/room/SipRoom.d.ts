import type { Message } from 'sip.js/lib/api/message';
import Room from './Room';
declare class SipRoom extends Room {
    static connect({ extension, constraints, audioOnly, extra, room, }: Record<string, any>): Promise<any>;
    mute(): void;
    unmute(): void;
    getLocalGuestName(): string | null;
    _transferEvents(): void;
    _onMessage(message: Message): Record<string, any> | null | undefined;
    _onParticipantJoined(channel: Record<string, any>): Promise<any>;
    _getCurrentSipCallIs(): string | null | undefined;
}
export default SipRoom;
//# sourceMappingURL=SipRoom.d.ts.map