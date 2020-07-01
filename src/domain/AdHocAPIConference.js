// @flow

import CallSession from './CallSession';
import getApiClient from '../service/getApiClient';

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
  started?: boolean,
  startTime: ?number,
  conferenceId: string,
};

// API adhoc conference
export default class AdHocAPIConference {
  participants: CallSession[];

  started: boolean;

  finished: boolean;

  conferenceId: string;

  startTime: ?number;

  constructor({ participants, started, finished, startTime, conferenceId }: ConferenceArguments) {
    this.participants = participants || [];
    this.started = started || false;
    this.finished = finished || false;
    this.startTime = startTime;
    this.conferenceId = conferenceId;
  }

  async start() {
    this.started = true;
    this.startTime = this.participants.length ? this.participants[0].startTime : null;

    const conference = await getApiClient().calld.createAdHocConference(this.participants.map(callSession => ({
      initiator_call_id: callSession.callId,
      call_id: callSession.call ? callSession.call.talkingToIds[0] : null,
    })));

    this.conferenceId = conference.conference_id;

    return this;
  }

  getParticipants() {
    return this.participants;
  }

  async addParticipants(newParticipants: CallSession[]): Promise<AdHocAPIConference> {
    const participants = [...this.participants, ...newParticipants];

    await getApiClient().calld.updateAdHocConference(this.conferenceId, participants.map(callSession => ({
      initiator_call_id: callSession.callId,
      call_id: callSession.call ? callSession.call.talkingToIds[0] : null,
    })));

    return new AdHocAPIConference({
      ...this,
      participants,
    });
  }

  participantHasLeft(leaver: CallSession): AdHocAPIConference {
    return new AdHocAPIConference({
      ...this,
      participants: this.participants.filter(participant =>
        participant.call && participant.call.talkingToIds[0] !== leaver.getId()),
    });
  }

  hasParticipants() {
    return this.participants.length > 0;
  }

  mute(): AdHocAPIConference {
    // @TODO
    return new AdHocAPIConference({
      ...this,
    });
  }

  unmute(): AdHocAPIConference {
    // @TODO
    return new AdHocAPIConference({
      ...this,
    });
  }

  hold(): AdHocAPIConference {
    // @TODO
    return new AdHocAPIConference({
      ...this,
    });
  }

  resume(): AdHocAPIConference {
    // @TODO
    return new AdHocAPIConference({
      ...this,
    });
  }

  isOnHold(): boolean {
    // @TODO
    return false;
  }

  isMuted(): boolean {
    // @TODO
    return false;
  }

  async hangup(): Promise<AdHocAPIConference> {
    await getApiClient().calld.deleteAdHocConference(this.conferenceId);

    return new AdHocAPIConference({
      ...this,
      finished: true,
      participant: [],
    });
  }

  async removeParticipant(participantToRemove: CallSession) {
    const participants = this.participants.filter(participant => !participant.is(participantToRemove));
    const callId = participantToRemove.call ? participantToRemove.call.talkingToIds[0] : null;

    await getApiClient().calld.removeAdHocConferenceParticipant(this.conferenceId, callId);

    return new AdHocAPIConference({
      ...this,
      participants,
    });
  }
}
