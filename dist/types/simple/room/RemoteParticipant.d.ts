import Participant, { RawParticipant } from './Participant';
import type Room from './Room';
declare class RemoteParticipant extends Participant {
    constructor(room: Room, rawParticipant: RawParticipant, extra?: Record<string, any>);
}
export default RemoteParticipant;
//# sourceMappingURL=RemoteParticipant.d.ts.map