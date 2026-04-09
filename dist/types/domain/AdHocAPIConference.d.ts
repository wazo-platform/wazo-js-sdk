import CallSession from './CallSession';
import type WebRTCPhone from './Phone/WebRTCPhone';
export type ConferenceParticipant = {
    admin: boolean;
    call_id: string;
    caller_id_name: string;
    caller_id_number: string;
    id: string;
    join_time: number;
    language: string;
    muted: boolean;
    user_uuid: string;
};
export type ConferenceParticipants = {
    items: Array<ConferenceParticipant>;
    total: number;
};
export type ConferenceArguments = {
    phone: WebRTCPhone;
    host: CallSession;
    finished?: boolean;
    participants: Record<string, CallSession>;
    started?: boolean;
    answerTime?: number | null | undefined;
    conferenceId?: string | null | undefined;
    muted?: boolean;
    paused?: boolean;
};
export default class AdHocAPIConference {
    phone: WebRTCPhone;
    host: CallSession;
    participants: Record<string, CallSession>;
    started: boolean;
    finished: boolean;
    conferenceId: string;
    answerTime: number | null | undefined;
    muted: boolean;
    paused: boolean;
    constructor({ phone, host, participants, started, finished, answerTime, conferenceId, muted, paused, }: ConferenceArguments);
    start(): Promise<this>;
    getParticipants(): CallSession[];
    addParticipant(newParticipant: CallSession): Promise<AdHocAPIConference>;
    participantHasLeft(leaver: CallSession): AdHocAPIConference;
    hasParticipants(): boolean;
    mute(): AdHocAPIConference;
    unmute(): AdHocAPIConference;
    hold(): AdHocAPIConference;
    resume(): AdHocAPIConference;
    isOnHold(): boolean;
    isMuted(): boolean;
    hangup(): Promise<AdHocAPIConference>;
    removeParticipant(participantToRemove: CallSession): Promise<AdHocAPIConference>;
}
//# sourceMappingURL=AdHocAPIConference.d.ts.map