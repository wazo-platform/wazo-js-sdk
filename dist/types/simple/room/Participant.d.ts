import Emitter from '../../utils/Emitter';
import type Room from './Room';
import Stream from './Stream';
export type RawParticipant = {
    user_uuid?: string;
    caller_id_name: string;
    caller_id_number?: string;
    call_id: string;
};
declare class Participant extends Emitter {
    room: Room | null | undefined;
    uuid?: string;
    name: string;
    number?: string;
    callId: string;
    isTalking: boolean;
    streams: Stream[];
    videoStreams: Stream[];
    audioMuted: boolean;
    videoMuted: boolean;
    screensharing: boolean;
    isOnHold: boolean;
    banned: boolean;
    extra: Record<string, any>;
    ON_UPDATED: string;
    ON_START_TALKING: string;
    ON_STOP_TALKING: string;
    ON_DISCONNECT: string;
    ON_STREAM_SUBSCRIBED: string;
    ON_STREAM_UNSUBSCRIBED: string;
    ON_AUDIO_MUTED: string;
    ON_AUDIO_UNMUTED: string;
    ON_VIDEO_MUTED: string;
    ON_VIDEO_UNMUTED: string;
    ON_SCREENSHARING: string;
    ON_STOP_SCREENSHARING: string;
    ON_EXTRA_CHANGE: string;
    ON_HOLD: string;
    ON_RESUME: string;
    ON_BAN: string;
    /**
     * @param room Room The room where the participant is
     * @param rawParticipant string Participant sent via the Wazo WS
     * @param extra Object extra status of the participant
     */
    constructor(room: Room | null, rawParticipant: RawParticipant, extra?: Record<string, any>);
    triggerEvent(name: string, ...args: any[]): void;
    triggerUpdate(eventType: string, broadcast?: boolean): void;
    onTalking(isTalking: boolean): void;
    onDisconnect(): void;
    onStreamSubscribed(stream: any): void;
    onStreamUnSubscribed(stream: any): void;
    onAudioMuted(broadcast?: boolean): void;
    onAudioUnMuted(broadcast?: boolean): void;
    onVideoMuted(broadcast?: boolean): void;
    onVideoUnMuted(broadcast?: boolean): void;
    onScreensharing(broadcast?: boolean): void;
    onStopScreensharing(broadcast?: boolean): void;
    onHold(broadcast?: boolean): void;
    onResume(broadcast?: boolean): void;
    onBan(broadcast?: boolean): void;
    getStatus(): {
        callId: string;
        audioMuted: boolean;
        videoMuted: boolean;
        screensharing: boolean;
        isTalking: boolean;
        extra: Record<string, any>;
    };
    updateStatus(status: Record<string, any>, broadcast?: boolean): void;
    broadcastStatus(inboundStatus?: Record<string, any> | null, sendReinvite?: boolean | null | undefined): void;
    resetStreams(streams: Stream[]): void;
    ban(apiRequestDelay?: number | null | undefined): Promise<boolean>;
    delay(ms: number): Promise<unknown>;
}
export default Participant;
//# sourceMappingURL=Participant.d.ts.map