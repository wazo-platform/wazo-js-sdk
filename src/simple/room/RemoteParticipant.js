// @flow
import Room from './Room';
import Participant from './Participant';

class RemoteParticipant extends Participant {
  constructor(room: Room, rawParticipant: Object = {}, extra: Object = {}) {
    super(room, rawParticipant, extra);
    if (this.name === '<unknown>') {
      this.name = this.number;
    }
  }
}

export default RemoteParticipant;
