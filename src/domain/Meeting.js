// @flow
import newFrom from '../utils/new-from';

export type MeetingCreationResponse = {
  guest_sip_authorization: string,
  hostname: string,
  name: string,
  owner_uuids: Array<string>,
  port: string,
  uuid: string
}

export default class Meeting {
  type: string;

  guestSipAuthorization: string;
  hostname: string;
  uuid: string;
  name: string;
  port: string;
  ownerUuids: Array<string>;

  static parse(plain: MeetingCreationResponse): Meeting {
    return new Meeting({
      guestSipAuthorization: plain.guest_sip_authorization,
      hostname: plain.hostname,
      name: plain.name,
      ownerUuids: plain.owner_uuids,
      port: plain.port,
      uuid: plain.uuid,
    });
  }

  static newFrom(meeting: Meeting) {
    return newFrom(meeting, Meeting);
  }

  constructor({ uuid, name, guestSipAuthorization, ownerUuids, port, hostname }: Object = {}) {
    this.guestSipAuthorization = guestSipAuthorization;
    this.hostname = hostname;
    this.name = name;
    this.ownerUuids = ownerUuids;
    this.port = port;
    this.uuid = uuid;

    // Useful to compare instead of instanceof with minified code
    this.type = 'Meeting';
  }

  getGuestSipCredentials() {
    // eslint-disable-next-line no-undef
    const [number, secret] = atob(this.guestSipAuthorization).split(':');
    return { number, secret };
  }
}
