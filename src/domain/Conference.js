// @flow

import CallSession from './CallSession';
import type { Phone } from './Phone/Phone';

export type ConferenceParticipant = {
  admin: boolean,
  call_id: string,
  caller_id_name: string,
  caller_id_number: string,
  id: string,
  join_time: number,
  language: string,
  muted: boolean,
  user_uuid: string,
};

export type ConferenceParticipants = {
  items: Array<ConferenceParticipant>,
  total: number,
};

export type ConferenceArguments = {
  finished?: boolean,
  participants: CallSession[],
  phone: Phone,
  startTime: number,
  started?: boolean,
};

export default class Conference {
  startTime: number;

  participants: CallSession[];

  started: boolean;

  finished: boolean;

  phone: Phone;

  constructor({ startTime, participants, phone, started, finished }: ConferenceArguments) {
    this.phone = phone;
    this.startTime = startTime;
    this.participants = participants || [];
    this.started = started || false;
    this.finished = finished || false;

    if (!started) {
      this.phone.startConference(participants);
      this.phone.resumeConference(participants);
      this.started = true;
    }
  }

  getParticipants() {
    return this.participants;
  }

  async addParticipants(newParticipants: CallSession[]): Promise<Conference> {
    await this.phone.addToConference(newParticipants);
    this.phone.resumeConference([...this.participants, ...newParticipants]);

    if (this.participants.some(participant => !participant.isMuted())) {
      this.phone.unmuteConference(newParticipants);
    } else {
      this.phone.muteConference(newParticipants);
    }

    return new Conference({
      ...this,
      participants: [...this.participants, ...newParticipants],
    });
  }

  participantHasLeft(leaver: CallSession): Conference {
    return new Conference({
      ...this,
      participants: this.participants.filter(participant => !participant.is(leaver)),
    });
  }

  hasParticipants() {
    return this.participants.length > 0;
  }

  mute(): Conference {
    this.phone.muteConference(this.participants);
    return new Conference({
      ...this,
    });
  }

  unmute(): Conference {
    this.phone.unmuteConference(this.participants);
    return new Conference({
      ...this,
    });
  }

  hold(): Conference {
    this.phone.holdConference(this.participants);
    return new Conference({
      ...this,
    });
  }

  resume(): Conference {
    this.phone.resumeConference(this.participants);
    return new Conference({
      ...this,
    });
  }

  hangup(): Conference {
    this.phone.hangupConference(this.participants);
    return new Conference({
      ...this,
      finished: true,
    });
  }

  hangupParticipant(participantToHangup: CallSession) {
    this.phone.hangupConference([participantToHangup]);
    return new Conference({
      ...this,
      participants: this.participants.filter(participant => !participant.is(participantToHangup)),
    });
  }

  removeParticipant(participantToRemove: CallSession) {
    this.phone.removeFromConference([participantToRemove]);
    return new Conference({
      ...this,
      participants: this.participants.filter(participant => !participant.is(participantToRemove)),
    });
  }

  isOnHold() {
    return this.participants.every(participant => participant.isOnHold());
  }

  isMuted() {
    return this.participants.every(participant => participant.isMuted());
  }
}
