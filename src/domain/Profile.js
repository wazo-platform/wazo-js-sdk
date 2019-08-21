// @flow

import Line from './Line';
import ForwardOption, { FORWARD_KEYS } from './ForwardOption';
import newFrom from '../utils/new-from';
import type { Endpoint } from './Line';
import SipLine from './SipLine';

export const STATE = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  INVISIBLE: 'invisible',
  DISCONNECTED: 'disconnected',
  AWAY: 'away',
};

export const LINE_STATE = {
  AVAILABLE: 'available',
  HOLDING: 'holding',
  RINGING: 'ringing',
  TALKING: 'talking',
  UNAVAILABLE: 'unavailable',
};

type ProfileResponse = {
  groups: Array<{ id: number, name: string }>,
  firstName: string,
  firstname?: string,
  lastName: string,
  lastname?: string,
  uuid: string,
  lines: Array<{
    id: number,
    extensions: Array<{ id: number, exten: string, context: string, links?: Array<{ href: string, rel: string }> }>,
    endpoint_custom?: Endpoint | null,
    endpoint_sccp?: Endpoint | null,
    endpoint_sip?: Endpoint | null,
  }>,
  id: number,
  username: string,
  timezone: ?string,
  language: string,
  email: string,
  forwards: {
    busy: {
      destination: string,
      enabled: boolean,
    },
    noanswer: {
      destination: string,
      enabled: boolean,
    },
    unconditional: {
      destination: string,
      enabled: boolean,
    },
  },
  mobile_phone_number: ?string,
  subscription_type: ?number,
  services: {
    dnd: {
      enabled: boolean,
    },
  },
  switchboards: Array<any>,
  voicemail?: {
    id: number,
    name: string,
  },
};

type ProfileArguments = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  lines: Array<Line>,
  sipLines?: Array<SipLine>,
  username: string,
  mobileNumber: string,
  forwards: Array<ForwardOption>,
  doNotDisturb?: boolean,
  state?: string,
  status: string,
  subscriptionType: ?number,
  voicemail?: {
    id: number,
    name: string,
  },
  switchboards: Array<any>,
};

export default class Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  lines: Array<Line>;
  sipLines: Array<SipLine>;
  username: string;
  mobileNumber: string;
  forwards: Array<ForwardOption>;
  doNotDisturb: ?boolean;
  state: ?string;
  voicemail: ?{ id: number, name: string };
  status: string;
  subscriptionType: ?number;
  switchboards: Array<any>;

  static parse(plain: ProfileResponse): Profile {
    return new Profile({
      id: plain.uuid,
      firstName: plain.firstName || plain.firstname || '',
      lastName: plain.lastName || plain.lastname || '',
      email: plain.email,
      lines: plain.lines.map(line => Line.parse(line)),
      username: plain.username,
      mobileNumber: plain.mobile_phone_number || '',
      forwards: [
        ForwardOption.parse(plain.forwards.unconditional, FORWARD_KEYS.UNCONDITIONAL),
        ForwardOption.parse(plain.forwards.noanswer, FORWARD_KEYS.NO_ANSWER),
        ForwardOption.parse(plain.forwards.busy, FORWARD_KEYS.BUSY),
      ],
      doNotDisturb: plain.services.dnd.enabled,
      subscriptionType: plain.subscription_type,
      voicemail: plain.voicemail,
      switchboards: plain.switchboards || [],
      status: '',
    });
  }

  static newFrom(profile: Profile) {
    return newFrom(profile, Profile);
  }

  constructor({
    id,
    firstName,
    lastName,
    email,
    lines,
    username,
    mobileNumber,
    forwards,
    doNotDisturb,
    state,
    subscriptionType,
    voicemail,
    switchboards,
    status,
    sipLines,
  }: $Shape<ProfileArguments> = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.lines = lines;
    this.username = username;
    this.mobileNumber = mobileNumber;
    this.forwards = forwards;
    this.doNotDisturb = doNotDisturb;
    this.state = state;
    this.voicemail = voicemail;
    this.subscriptionType = subscriptionType;
    this.switchboards = switchboards;
    this.status = status;

    this.sipLines = sipLines || [];
  }

  static getLinesState(lines: Array<Object>) {
    let result = LINE_STATE.UNAVAILABLE;

    // eslint-disable-next-line
    for (const line of lines) {
      if (line.state === LINE_STATE.RINGING) {
        result = LINE_STATE.RINGING;
        break;
      }

      if (line.state === LINE_STATE.TALKING) {
        result = LINE_STATE.TALKING;
        break;
      }

      if (line.state === LINE_STATE.AVAILABLE) {
        result = LINE_STATE.AVAILABLE;
      }
    }

    return result;
  }

  hasId(id: string) {
    return id === this.id;
  }

  setMobileNumber(number: string) {
    this.mobileNumber = number;

    return this;
  }

  setForwardOption(forwardOption: ForwardOption) {
    const updatedForwardOptions = this.forwards.slice();
    const index = updatedForwardOptions.findIndex(forward => forward.is(forwardOption));
    updatedForwardOptions.splice(index, 1, forwardOption);

    this.forwards = updatedForwardOptions;

    return this;
  }

  setDoNotDisturb(enabled: boolean) {
    this.doNotDisturb = enabled;

    return this;
  }

  setState(state: string) {
    this.state = state;

    return this;
  }
}
