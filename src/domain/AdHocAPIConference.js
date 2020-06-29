// @flow

import CallSession from './CallSession';
import getApiClient from "../service/getApiClient";

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
  source: CallSession,
  started?: boolean,
};

// API adhoc conference
export default class AdHocAPIConference {
  source: CallSession;

  participants: CallSession[];

  started: boolean;

  finished: boolean;

  conferenceId: string;

  constructor({ source, participants, started, finished }: ConferenceArguments) {
    this.source = source;
    this.participants = participants || [];
    this.started = started || false;
    this.finished = finished || false;
  }

  async start() {
    this.started = true;

    const conference = await getApiClient().calld.createAdHocConference(this.participants.map(callSession => ({
      initiator_call_id: this.source.sipCallId,
      call_id: callSession.sipCallId,
    })));

    this.conferenceId = conference.id;

    return this;
  }

  getParticipants() {
    return this.participants;
  }

  async addParticipants(newParticipants: CallSession[]): Promise<AdHocAPIConference> {
    const participants = [...this.participants, ...newParticipants];

    await getApiClient().calld.updateAdHocConference(this.conferenceId, participants.map(callSession => ({
      initiator_call_id: this.source.sipCallId,
      call_id: callSession.sipCallId,
    })));

    return new AdHocAPIConference({
      ...this,
      participants,
    });
  }

  participantHasLeft(leaver: CallSession): AdHocAPIConference {
    // @TODO
    return new AdHocAPIConference({
      ...this,
      participants: this.participants.filter(participant => !participant.is(leaver)),
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

    await getApiClient().calld.removeAdHocConferenceParticipant(this.conferenceId, participantToRemove.sipCallId);

    return new AdHocAPIConference({
      ...this,
      participants,
    });
  }
}
