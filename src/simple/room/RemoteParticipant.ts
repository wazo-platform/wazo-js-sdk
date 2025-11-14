import Participant, { RawParticipant } from './Participant';
import type Room from './Room';

class RemoteParticipant extends Participant {
  constructor(room: Room, rawParticipant: RawParticipant, extra: Record<string, any> = {}) {
    super(room, rawParticipant, extra);

    if (this.name === '<unknown>') {
      this.name = String(this.number);
    }
  }

}

export default RemoteParticipant;
