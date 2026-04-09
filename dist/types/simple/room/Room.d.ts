import type { Message } from 'sip.js/lib/api/message';
import type CallSession from '../../domain/CallSession';
import Emitter from '../../utils/Emitter';
import LocalParticipant from './LocalParticipant';
import Participant from './Participant';
import RemoteParticipant from './RemoteParticipant';
type ConnectArgs = {
    extension: string;
    constraints: Record<string, any>;
    audioOnly?: boolean;
    extra?: Record<string, any>;
    room: Room;
    meeting: any;
};
declare class Room extends Emitter {
    callSession?: CallSession;
    name: string;
    extension: string;
    sourceId: number | null | undefined;
    meetingUuid: string | null | undefined;
    participants: Participant[];
    callId: string | null | undefined;
    connected: boolean;
    localParticipant: LocalParticipant | null | undefined;
    _callIdStreamIdMap: Record<string, any>;
    _unassociatedVideoStreams: Record<string, MediaStream>;
    _unassociatedParticipants: Record<string, Participant>;
    _boundOnParticipantJoined: (...args: Array<any>) => any;
    _boundOnParticipantLeft: (...args: Array<any>) => any;
    _boundOnMessage: (...args: Array<any>) => any;
    _boundOnChat: (...args: Array<any>) => any;
    _boundOnSignal: (...args: Array<any>) => any;
    _boundSaveLocalVideoStream: (...args: Array<any>) => any;
    _boundOnReinvite: (...args: Array<any>) => any;
    audioStream: MediaStream | null | undefined;
    extra: Record<string, any>;
    roomAudioElement: HTMLAudioElement;
    CONFERENCE_USER_PARTICIPANT_JOINED: string;
    CONFERENCE_USER_PARTICIPANT_LEFT: string;
    MEETING_USER_PARTICIPANT_JOINED: string;
    MEETING_USER_PARTICIPANT_LEFT: string;
    ON_SHARE_SCREEN_ENDED: string;
    ON_MESSAGE: string;
    ON_CHAT: string;
    ON_SIGNAL: string;
    ON_AUDIO_STREAM: string;
    ON_VIDEO_STREAM: string;
    ON_REMOVE_STREAM: string;
    ON_DISCONNECTED: string;
    ON_JOINED: string;
    ON_VIDEO_INPUT_CHANGE: string;
    /**
     *
     * @param callSession CallSession
     * @param extension string
     * @param sourceId number
     * @param callId string
     * @param meetingUuid string
     * @param extra Object
     */
    constructor(callSession: CallSession, extension: string, sourceId: number | null | undefined, callId: string | null | undefined, meetingUuid: string | null | undefined, extra?: Record<string, any>);
    /**
     *
     * @param extension string
     * @param constraints string
     * @param audioOnly boolean
     * @param extra Object
     * @param room ?Room
     * @param meeting ?Meeting
     * @returns {Promise<Room>}
     */
    static connect({ extension, constraints, audioOnly, extra, room, meeting, }: ConnectArgs): Promise<Room>;
    static disconnect(): void;
    disconnect(): Promise<void>;
    setSourceId(sourceId: number): void;
    setMeetingUuid(meetingUuid: string): void;
    setCallId(callId: string): void;
    setName(name: string): void;
    sendMessage(body: string, sipSession?: any): void;
    sendChat(content: string): void;
    sendSignal(content: any): void;
    startScreenSharing(constraints: Record<string, any>): Promise<MediaStream | null>;
    stopScreenSharing(restoreLocalStream?: boolean): Promise<void>;
    turnCameraOff(): void;
    turnCameraOn(): void;
    mute(): void;
    unmute(): void;
    sendMuteStatus(): void;
    sendUnMuteStatus(): void;
    hold(): void;
    resume(): Promise<void>;
    _updateLocalParticipantStream(): void;
    sendDTMF(tone: string): void;
    sendReinvite(newConstraints?: Record<string, any> | null): Promise<void | import("sip.js/lib/core").OutgoingInviteRequest | undefined>;
    hasALocalVideoTrack(): boolean;
    getLocalStream(): MediaStream | null | undefined;
    getRemoteStream(): MediaStream | null;
    getRemoteVideoStream(): MediaStream | null;
    _bindEvents(): void;
    _onScreenSharing(): void;
    _onReinvite(session: any, inviteRequest: any): void;
    _mapMsid(rawSdp: string): void;
    _transferEvents(): void;
    _onMessage(message: Message & {
        method?: string;
        body?: string;
    }): Record<string, any> | null | undefined;
    _onChat(content: Record<string, any>): void;
    _onSignal(content: Record<string, any>): void;
    _onParticipantJoined(payload: Record<string, any>): Promise<RemoteParticipant | Participant[] | null>;
    _onLocalParticipantJoined(localParticipant: LocalParticipant): void;
    _isParticipantJoining(participant: Participant): void;
    _saveLocalVideoStream(stream: MediaStream): import("./Stream").default | undefined;
    _onParticipantLeft(payload: Record<string, any>): void;
    _onParticipantTrackUpdate(oldParticipant: Participant, update: string): Participant;
    __associateStreams(participant: Participant): void;
    _getUnassociatedMapIdFromTrackIdOrStreamId(trackId: string, streamId: string | null | undefined): string | null;
    _getStreamIdFrTrackId(trackId: string): any;
    _associateStreamTo(rawStream: MediaStream, participant: Participant): void;
    _getCallIdFromTrackId(trackId: string): string | undefined;
    _getParticipantFromCallId(callId: string): Participant | undefined;
    _getLocalVideoStream(): MediaStream | null;
}
export default Room;
//# sourceMappingURL=Room.d.ts.map