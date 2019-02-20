// @flow

import Line from './Line';
import ForwardOption, { FORWARD_KEYS } from './ForwardOption';
import newFrom from '../utils/new-from';

export const PRESENCE = {
  AVAILABLE: 'available',
  DO_NOT_DISTURB: 'donotdisturb',
  DISCONNECTED: 'disconnected'
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
  subscription_type: ?number,
  services: {
    dnd: {
      enabled: boolean
    }
  },
  voicemail?: {
    id: number,
    name: string
  }
};

type ProfileArguments = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  lines: Array<Line>,
  username: string,
  mobileNumber: string,
  forwards: Array<ForwardOption>,
  doNotDisturb?: boolean,
  presence?: string,
  subscriptionType: ?number,
  voicemail?: {
    id: number,
    name: string
  }
};

export default class Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  lines: Array<Line>;
  username: string;
  mobileNumber: string;
  forwards: Array<ForwardOption>;
  doNotDisturb: ?boolean;
  presence: ?string;
  voicemail: ?{ id: number, name: string };
  subscriptionType: ?number;

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
        ForwardOption.parse(plain.forwards.busy, FORWARD_KEYS.BUSY)
      ],
      doNotDisturb: plain.services.dnd.enabled,
      subscriptionType: plain.subscription_type,
      voicemail: plain.voicemail
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
    presence,
    subscriptionType,
    voicemail
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
    this.presence = presence;
    this.voicemail = voicemail;
    this.subscriptionType = subscriptionType;
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

  setPresence(presence: string) {
    this.presence = presence;

    return this;
  }
}
