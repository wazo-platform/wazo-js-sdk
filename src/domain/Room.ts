import CallSession from './CallSession';
import newFrom from '../utils/new-from';
import updateFrom from '../utils/update-from';

export type RoomArguments = {
  connectedCallSession: CallSession | null;
  id: string;
  name?: string;
  participants: Array<{
    extension: string;
    uuid: string;
    talking: boolean | null | undefined;
  }>;
}; // Represents a conference room, like `9000`.

export default class Room {
  id: string;

  name: string | typeof undefined;

  connectedCallSession: CallSession | null;

  participants: Array<{
    extension: string;
    uuid: string;
    talking: boolean | null | undefined;
  }>;

  constructor({
    id,
    connectedCallSession,
    participants,
    name,
  }: RoomArguments) {
    this.id = id;
    this.connectedCallSession = connectedCallSession;
    this.participants = participants;
    this.name = name;
  }

  getExtension(): string | null {
    return this.connectedCallSession ? this.connectedCallSession.number : null;
  }

  connect(callSession: CallSession): Room {
    return new Room({ ...this,
      connectedCallSession: callSession,
    });
  }

  has(callSession: CallSession): boolean {
    return !!this.connectedCallSession && this.connectedCallSession.is(callSession);
  }

  addParticipant(uuid: string, extension: string, talking: boolean | null | undefined = null) {
    if (!this.participants.some(participant => participant.uuid === uuid || participant.extension === extension)) {
      return new Room({ ...this,
        participants: [...this.participants, {
          uuid,
          extension,
          talking,
        }],
      });
    }

    return this;
  }

  updateParticipant(uuid: string, participant: Record<string, any>, shouldAdd = false) {
    const idx = this.participants.findIndex(someParticipant => someParticipant.uuid === uuid);

    if (idx === -1 && !shouldAdd) {
      return this;
    }

    const updatedParticipants = [...this.participants];

    if (idx !== -1) {
      updatedParticipants[idx] = { ...updatedParticipants[idx],
        ...participant,
      };
    } else {
      updatedParticipants.push(participant);
    }

    return new Room({ ...this,
      participants: updatedParticipants,
    });
  }

  updateParticipantByExtension(extension: string, participant: Record<string, any>, shouldAdd = false) {
    const idx = this.participants.findIndex(someParticipant => someParticipant.extension === extension);

    if (idx === -1 && !shouldAdd) {
      return this;
    }

    const updatedParticipants = [...this.participants];

    if (idx !== -1) {
      updatedParticipants[idx] = { ...updatedParticipants[idx],
        ...participant,
      };
    } else {
      updatedParticipants.push(participant);
    }

    return new Room({ ...this,
      participants: updatedParticipants,
    });
  }

  hasCallWithId(id: string): boolean {
    return !!this.connectedCallSession && this.connectedCallSession.getId() === id;
  }

  disconnect(): Room {
    return new Room({ ...this,
      connectedCallSession: null,
    });
  }

  removeParticipantWithUUID(uuid: string) {
    return new Room({ ...this,
      participants: this.participants.filter(participant => participant.uuid !== uuid),
    });
  }

  removeParticipantWithExtension(extension: string) {
    return new Room({ ...this,
      participants: this.participants.filter(participant => participant.extension !== extension),
    });
  }

  updateFrom(room: Room) {
    updateFrom(this, room);
  }

  static newFrom(room: Room) {
    return newFrom(room, Room);
  }

}
