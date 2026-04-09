import CallSession from './CallSession';
type RoomParticipant = {
    extension: string;
    uuid: string;
    talking?: boolean;
};
export type RoomArguments = {
    connectedCallSession: CallSession | null;
    id: string;
    name?: string;
    participants: RoomParticipant[];
};
export default class Room {
    id: string;
    name: string | typeof undefined;
    connectedCallSession: CallSession | null;
    participants: RoomParticipant[];
    constructor({ id, connectedCallSession, participants, name, }: RoomArguments);
    getExtension(): string | null;
    connect(callSession: CallSession): Room;
    has(callSession: CallSession): boolean;
    addParticipant(uuid: string, extension: string, talking?: boolean | null | undefined): Room;
    updateParticipant(uuid: string, participant: RoomParticipant, shouldAdd?: boolean): Room;
    updateParticipantByExtension(extension: string, participant: RoomParticipant, shouldAdd?: boolean): Room;
    hasCallWithId(id: string): boolean;
    disconnect(): Room;
    removeParticipantWithUUID(uuid: string): Room;
    removeParticipantWithExtension(extension: string): Room;
    updateFrom(room: Room): void;
    static newFrom(room: Room): any;
}
export {};
//# sourceMappingURL=Room.d.ts.map