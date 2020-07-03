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
  host: CallSession,
  finished?: boolean,
  participants: {[string]: CallSession};
  started?: boolean,
  startTime: ?number,
  conferenceId: string,
  muted: ?boolean,
};

// API adhoc conference
export default class AdHocAPIConference {
  host: CallSession;

  participants: {[string]: CallSession};

  started: boolean;

  finished: boolean;

  conferenceId: string;

  startTime: ?number;

  muted: boolean;

  constructor({ host, participants, started, finished, startTime, conferenceId, muted }: ConferenceArguments) {
    this.host = host;
    this.participants = participants || {};
    this.started = started || false;
    this.finished = finished || false;
    this.startTime = startTime;
    this.conferenceId = conferenceId;
    this.muted = muted || false;
  }

  async start() {
    this.started = true;
    // $FlowFixMe
    this.startTime = Object.values(this.participants).length ? Object.values(this.participants)[0].startTime : null;

    const participantIds = Object.keys(this.participants);
    const conference = await getApiClient().calld.createAdHocConference(this.host.callId, participantIds);

    this.conferenceId = conference.conference_id;

    return this;
  }

  getParticipants() {
    return Object.values(this.participants);
  }

  async addParticipant(newParticipant: CallSession): Promise<AdHocAPIConference> {
    const participantCallId = newParticipant.getTalkingToIds()[0];
    const participants = { ...this.participants, [participantCallId]: newParticipant };

    await getApiClient().calld.addAdHocConferenceParticipant(this.conferenceId, participantCallId);

    return new AdHocAPIConference({
      ...this,
      participants,
    });
  }

  participantHasLeft(leaver: CallSession): AdHocAPIConference {
    delete this.participants[leaver.getId()];

    return new AdHocAPIConference({ ...this, participants: this.participants });
  }

  hasParticipants() {
    return Object.keys(this.participants).length > 0;
  }

  mute(): AdHocAPIConference {
    this.muted = true;
    return new AdHocAPIConference({
      ...this,
    });
  }

  unmute(): AdHocAPIConference {
    this.muted = false;
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
    return this.muted;
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
    const callId = participantToRemove.getTalkingToIds()[0];
    delete this.participants[callId];

    await getApiClient().calld.removeAdHocConferenceParticipant(this.conferenceId, callId);

    return new AdHocAPIConference({
      ...this,
      participants: this.participants,
    });
  }
}
