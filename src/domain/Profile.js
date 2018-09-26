// @flow

import { Record } from 'immutable';

import Line from './Line';
import ForwardOption, { FORWARD_KEYS } from './ForwardOption';

export const PRESENCE = {
  AVAILABLE: 'available',
  DO_NOT_DISTURB: 'donotdisturb',
  DISCONNECTED: 'disconnected'
};

type ProfileResponse = {
  groups: Array<{ id: number, name: string }>,
  firstname: string,
  lastname: string,
  uuid: string,
  lines: Array<{
    id: number,
    extensions: Array<{ id: number, exten: string, context: string, links?: Array<{ href: string, rel: string }> }>,
    endpoint_custom?: ?string,
    endpoint_sccp?: ?string
  }>,
  id: number,
  username: string,
  timezone: ?string,
  language: string,
  email: string,
  forwards: {
    busy: {
      destination: string,
      enabled: boolean
    },
    noanswer: {
      destination: string,
      enabled: boolean
    },
    unconditional: {
      destination: string,
      enabled: boolean
    }
  },
  mobile_phone_number: ?string,
  services: {
    dnd: {
      enabled: boolean
    }
  }
};

const ProfileRecord = Record({
  id: undefined,
  firstname: undefined,
  lastname: undefined,
  email: undefined,
  lines: undefined,
  username: undefined,
  mobileNumber: undefined,
  forwards: undefined,
  doNotDisturb: undefined,
  presence: PRESENCE.AVAILABLE
});

export default class Profile extends ProfileRecord {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  lines: Array<Line>;
  username: string;
  mobileNumber: string;
  forwards: Array<ForwardOption>;
  doNotDisturb: boolean;
  presence: string;

  static parse(plain: ProfileResponse): Profile {
    return new Profile({
      id: plain.uuid,
      firstname: plain.firstname,
      lastname: plain.lastname,
      email: plain.email,
      lines: plain.lines.map(line => Line.parse(line)),
      username: plain.username,
      mobileNumber: plain.mobile_phone_number || '',
      forwards: [
        ForwardOption.parse(plain.forwards.unconditional, FORWARD_KEYS.UNCONDITIONAL),
        ForwardOption.parse(plain.forwards.noanswer, FORWARD_KEYS.NO_ANSWER),
        ForwardOption.parse(plain.forwards.busy, FORWARD_KEYS.BUSY)
      ],
      doNotDisturb: plain.services.dnd.enabled
    });
  }

  hasId(id: string) {
    return id === this.id;
  }

  setMobileNumber(number: string) {
    return this.set('mobileNumber', number);
  }

  setForwardOption(forwardOption: ForwardOption) {
    const updatedForwardOptions = this.forwards.slice();
    const index = updatedForwardOptions.findIndex(forward => forward.is(forwardOption));
    updatedForwardOptions.splice(index, 1, forwardOption);
    return this.set('forwards', updatedForwardOptions);
  }

  setDoNotDisturb(enabled: boolean) {
    return this.set('doNotDisturb', enabled);
  }

  setPresence(presence: string) {
    return this.set('presence', presence);
  }
}
