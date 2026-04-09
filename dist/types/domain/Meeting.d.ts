import MeetingAuthorization from './MeetingAuthorization';
export type MeetingCreateArguments = {
    name: string;
    requireAuthorization: boolean;
    persistent: boolean;
};
export type MeetingUpdateArguments = {
    name?: string;
    requireAuthorization?: boolean;
};
export type MeetingCreationResponse = {
    guest_sip_authorization: string;
    ingress_http_uri: string;
    name: string;
    owner_uuids: Array<string>;
    port: string;
    uuid: string;
    exten: string;
    persistent: boolean;
    creation_time: string;
    require_authorization: boolean;
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
    static parse(plain: MeetingCreationResponse): Meeting;
    static parseMany(items: MeetingCreationResponse[]): Array<Meeting>;
    static newFrom(meeting: Meeting): any;
    constructor({ uuid, name, guestSipAuthorization, ownerUuids, port, uri, extension, persistent, creationTime, requireAuthorization, }?: Record<string, any>);
    getGuestSipCredentials(): {
        username: string;
        secret: string;
    };
}
//# sourceMappingURL=Meeting.d.ts.map