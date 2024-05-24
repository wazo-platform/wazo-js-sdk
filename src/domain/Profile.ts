import Line, { LineResponse } from './Line';
import ForwardOption, { FORWARD_KEYS } from './ForwardOption';
import newFrom from '../utils/new-from';
import SipLine from './SipLine';
import Incall, { GenericIncall } from './Incall';

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
  PROGRESSING: 'progressing',
};

type ProfileResponse = {
  groups: Array<{
    id: number;
    name: string;
  }>;
  firstName: string;
  firstname?: string;
  lastName: string;
  lastname?: string;
  uuid: string;
  lines: Array<LineResponse>;
  id: number;
  username: string;
  timezone: string | null | undefined;
  language: string;
  email: string;
  forwards: {
    busy: {
      destination: string;
      enabled: boolean;
    };
    noanswer: {
      destination: string;
      enabled: boolean;
    };
    unconditional: {
      destination: string;
      enabled: boolean;
    };
  };
  mobile_phone_number: string | null | undefined;
  ring_seconds?: number;
  subscription_type: number | null | undefined;
  services: {
    dnd: {
      enabled: boolean;
    };
  };
  switchboards: Array<any>;
  agent?: {
    firstname: string;
    id: number;
    lastname: string;
    number: string;
  };
  voicemail?: {
    id: number;
    name: string;
  };
  call_pickup_target_users?: Array<{
    firstname: string;
    lastname: string;
    uuid: string;
  }>;
  online_call_record_enabled: boolean | null | undefined;
  incalls: GenericIncall[];
};

type ProfileArguments = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  lines: Array<Line>;
  sipLines?: Array<SipLine>;
  username: string;
  mobileNumber: string;
  forwards: Array<ForwardOption>;
  doNotDisturb?: boolean;
  ringSeconds?: number;
  state?: string;
  status: string;
  subscriptionType: number | null | undefined;
  voicemail?: {
    id: number;
    name: string;
  };
  agent?: {
    firstname: string;
    id: number;
    lastname: string;
    number: string;
  };
  switchboards: Array<any>;
  callPickupTargetUsers?: Array<{
    firstname: string;
    lastname: string;
    uuid: string;
  }>;
  onlineCallRecordEnabled?: boolean | null | undefined;
  incalls?: GenericIncall[];
};
export default class Profile {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  lines: Array<Line>;

  sipLines: Array<SipLine>;

  incalls: Array<Incall>;

  username: string;

  mobileNumber: string;

  forwards: Array<ForwardOption>;

  doNotDisturb: boolean | null | undefined;

  onlineCallRecordEnabled: boolean | null | undefined;

  state: string | null | undefined;

  ringSeconds: number | null | undefined;

  voicemail: {
    id: number;
    name: string;
  } | null | undefined;

  status: string;

  subscriptionType: number | null | undefined;

  agent: {
    firstname: string;
    id: number;
    lastname: string;
    number: string;
  } | null | undefined;

  switchboards: Array<any>;

  callPickupTargetUsers: Array<{
    firstname: string;
    lastname: string;
    uuid: string;
  }> | null | undefined;

  static parse(plain: ProfileResponse): Profile {
    return new Profile({
      id: plain.uuid,
      firstName: plain.firstName || plain.firstname || '',
      lastName: plain.lastName || plain.lastname || '',
      email: plain.email,
      lines: plain.lines.map(line => Line.parse(line)),
      incalls: plain.incalls,
      username: plain.username,
      mobileNumber: plain.mobile_phone_number || '',
      ringSeconds: plain.ring_seconds,
      forwards: [ForwardOption.parse(plain.forwards.unconditional, FORWARD_KEYS.UNCONDITIONAL), ForwardOption.parse(plain.forwards.noanswer, FORWARD_KEYS.NO_ANSWER), ForwardOption.parse(plain.forwards.busy, FORWARD_KEYS.BUSY)],
      doNotDisturb: plain.services.dnd.enabled,
      subscriptionType: plain.subscription_type,
      voicemail: plain.voicemail,
      switchboards: plain.switchboards || [],
      agent: plain.agent,
      status: '',
      callPickupTargetUsers: plain.call_pickup_target_users || [],
      onlineCallRecordEnabled: plain.online_call_record_enabled,
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
    agent,
    status,
    ringSeconds,
    sipLines,
    callPickupTargetUsers,
    onlineCallRecordEnabled,
    incalls,
  }: ProfileArguments) {
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
    this.agent = agent;
    this.status = status;
    this.callPickupTargetUsers = callPickupTargetUsers;
    this.onlineCallRecordEnabled = onlineCallRecordEnabled;
    this.ringSeconds = ringSeconds;
    this.sipLines = sipLines || [];
    this.incalls = incalls?.map(incall => Incall.parse(incall)) || [];
  }

  static getLinesState(lines: Array<Record<string, any>>) {
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
