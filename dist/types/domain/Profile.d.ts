import Line, { LineResponse } from './Line';
import ForwardOption from './ForwardOption';
import SipLine from './SipLine';
import Incall, { GenericIncall } from './Incall';
export declare const STATE: {
    AVAILABLE: string;
    UNAVAILABLE: string;
    INVISIBLE: string;
    DISCONNECTED: string;
    AWAY: string;
};
export declare const LINE_STATE: {
    AVAILABLE: string;
    HOLDING: string;
    RINGING: string;
    TALKING: string;
    UNAVAILABLE: string;
    PROGRESSING: string;
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
    static parse(plain: ProfileResponse): Profile;
    static newFrom(profile: Profile): any;
    constructor({ id, firstName, lastName, email, lines, username, mobileNumber, forwards, doNotDisturb, state, subscriptionType, voicemail, switchboards, agent, status, ringSeconds, sipLines, callPickupTargetUsers, onlineCallRecordEnabled, incalls, }: ProfileArguments);
    static getLinesState(lines: Array<Record<string, any>>): string;
    hasId(id: string): boolean;
    setMobileNumber(number: string): this;
    setForwardOption(forwardOption: ForwardOption): this;
    setDoNotDisturb(enabled: boolean): this;
    setState(state: string): this;
}
export {};
//# sourceMappingURL=Profile.d.ts.map