import moment from 'moment';

import newFrom from '../utils/new-from';

import MeetingAuthorization from './MeetingAuthorization';

export type MeetingCreateArguments = {
  name: string,
  requireAuthorization: boolean,
  persistent: boolean,
};

export type MeetingUpdateArguments = {
  name?: string,
  requireAuthorization?: boolean,
};

export type MeetingCreationResponse = {
  guest_sip_authorization: string,
  ingress_http_uri: string,
  name: string,
  owner_uuids: Array<string>,
  port: string,
  uuid: string,
  exten: string,
  persistent: boolean,
  creation_time: string,
  require_authorization: boolean,
};

export default class Meeting {
  type: string;

  guestSipAuthorization: string;

  uri: string;

  uuid: string;

  name: string;

  port: string;

  extension: string;

  persistent: boolean;

  ownerUuids: Array<string>;

  creationTime: Date;

  pendingAuthorizations: Array<MeetingAuthorization>;

  requireAuthorization: boolean;

  static parse(plain: MeetingCreationResponse): Meeting {
    return new Meeting({
      guestSipAuthorization: plain.guest_sip_authorization,
      uri: plain.ingress_http_uri,
      name: plain.name,
      ownerUuids: plain.owner_uuids,
      port: plain.port,
      uuid: plain.uuid,
      extension: plain.exten,
      persistent: plain.persistent,
      creationTime: moment(plain.creation_time).toDate(),
      requireAuthorization: plain.require_authorization,
    });
  }

  static parseMany(items: MeetingCreationResponse[]): Array<Meeting> {
    if (!items) {
      return [];
    }
    return items.map(plain => Meeting.parse(plain));
  }

  static newFrom(meeting: Meeting) {
    return newFrom(meeting, Meeting);
  }

  constructor({
    uuid,
    name,
    guestSipAuthorization,
    ownerUuids,
    port,
    uri,
    extension,
    persistent,
    creationTime,
    requireAuthorization,
  }: Object = {}) {
    this.guestSipAuthorization = guestSipAuthorization;
    this.uri = uri;
    this.name = name;
    this.ownerUuids = ownerUuids;
    this.port = port;
    this.uuid = uuid;
    this.extension = extension;
    this.persistent = persistent;
    this.creationTime = creationTime;
    this.requireAuthorization = requireAuthorization;

    // Useful to compare instead of instanceof with minified code
    this.type = 'Meeting';
  }

  getGuestSipCredentials() {
    // eslint-disable-next-line no-undef
    const [username, secret] = atob(this.guestSipAuthorization).split(':');
    return { username, secret };
  }

}
