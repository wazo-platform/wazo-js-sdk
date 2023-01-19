import Room from './Room';
import Participant, { RawParticipant } from './Participant';

class RemoteParticipant extends Participant {
  constructor(room: Room, rawParticipant: RawParticipant, extra: Record<string, any> = {}) {
    super(room, rawParticipant, extra);

    if (this.name === '<unknown>') {
      this.name = String(this.number);
    }
  }

}

export default RemoteParticipant;
