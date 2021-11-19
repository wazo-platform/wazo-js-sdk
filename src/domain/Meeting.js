// @flow
import newFrom from '../utils/new-from';

export type MeetingCreationResponse = {
  guest_sip_authorization: string,
  ingress_http_uri: string,
  name: string,
  owner_uuids: Array<string>,
  port: string,
  uuid: string,
  number: string,
  persistent: boolean,
}

export default class Meeting {
  type: string;

  guestSipAuthorization: string;
  uri: string;
  uuid: string;
  name: string;
  port: string;
  number: string;
  persistent: boolean;
  ownerUuids: Array<string>;

  static parse(plain: MeetingCreationResponse): Meeting {
    return new Meeting({
      guestSipAuthorization: plain.guest_sip_authorization,
      uri: plain.ingress_http_uri,
      name: plain.name,
      ownerUuids: plain.owner_uuids,
      port: plain.port,
      uuid: plain.uuid,
      number: plain.number,
      persistent: plain.persistent,
    });
  }

  static newFrom(meeting: Meeting) {
    return newFrom(meeting, Meeting);
  }

  constructor({ uuid, name, guestSipAuthorization, ownerUuids, port, uri, number, persistent }: Object = {}) {
    this.guestSipAuthorization = guestSipAuthorization;
    this.uri = uri;
    this.name = name;
    this.ownerUuids = ownerUuids;
    this.port = port;
    this.uuid = uuid;
    this.number = number;
    this.persistent = persistent;

    // Useful to compare instead of instanceof with minified code
    this.type = 'Meeting';
  }

  getGuestSipCredentials() {
    // eslint-disable-next-line no-undef
    const [username, secret] = atob(this.guestSipAuthorization).split(':');
    return { username, secret };
  }
}
