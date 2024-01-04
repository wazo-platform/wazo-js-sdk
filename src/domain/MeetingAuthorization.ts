export type RawMeetingAuthorization = {
  created_at: string;
  meeting_uuid: string;
  uuid: string;
  guest_uuid: string;
  guest_name: string;
};
export const PENDING = 'pending';
export const ACCEPTED = 'accepted';
export const REJECTED = 'rejected';
export const POST_PROCESSING = 'post_processing';
export const POST_PROCESSED_SUCCESS = 'post_processed_success';
export const POST_PROCESSED_ERROR = 'post_processed_error';

export default class MeetingAuthorization {
  static PENDING = PENDING;

  static ACCEPTED = ACCEPTED;

  static REJECTED = REJECTED;

  static POST_PROCESSING = POST_PROCESSING;

  static POST_PROCESSED_SUCCESS = POST_PROCESSED_SUCCESS;

  static POST_PROCESSED_ERROR = POST_PROCESSED_ERROR;

  meetingUuid: string;

  uuid: string;

  userUuid: string;

  userName: string;

  status: string;

  constructor({
    meetingUuid,
    uuid,
    userUuid,
    userName,
  }: Record<string, any> = {}) {
    this.meetingUuid = meetingUuid;
    this.uuid = uuid;
    this.userUuid = userUuid;
    this.userName = userName;
  }

  setStatus(status: string) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  static parse(plain: RawMeetingAuthorization) {
    const {
      meeting_uuid: meetingUuid,
      uuid,
      guest_uuid: userUuid,
      guest_name: userName,
    } = plain;
    return new MeetingAuthorization({
      meetingUuid,
      uuid,
      userUuid,
      userName,
    });
  }

  static parseMany(items: RawMeetingAuthorization[]): Array<MeetingAuthorization> {
    if (!items) {
      return [];
    }

    return items.map(MeetingAuthorization.parse);
  }

}
