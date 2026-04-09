export type RawMeetingAuthorization = {
    created_at: string;
    meeting_uuid: string;
    uuid: string;
    guest_uuid: string;
    guest_name: string;
};
export declare const PENDING = "pending";
export declare const ACCEPTED = "accepted";
export declare const REJECTED = "rejected";
export declare const POST_PROCESSING = "post_processing";
export declare const POST_PROCESSED_SUCCESS = "post_processed_success";
export declare const POST_PROCESSED_ERROR = "post_processed_error";
export default class MeetingAuthorization {
    static PENDING: string;
    static ACCEPTED: string;
    static REJECTED: string;
    static POST_PROCESSING: string;
    static POST_PROCESSED_SUCCESS: string;
    static POST_PROCESSED_ERROR: string;
    meetingUuid: string;
    uuid: string;
    userUuid: string;
    userName: string;
    status: string;
    constructor({ meetingUuid, uuid, userUuid, userName, }?: Record<string, any>);
    setStatus(status: string): void;
    getStatus(): string;
    static parse(plain: RawMeetingAuthorization): MeetingAuthorization;
    static parseMany(items: RawMeetingAuthorization[]): Array<MeetingAuthorization>;
}
//# sourceMappingURL=MeetingAuthorization.d.ts.map