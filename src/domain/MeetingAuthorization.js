// @flow

export type RawMeetingAutorization = {
  meeting_uuid: string,
  authorization_uuid: string,
  coline_uuid: string,
  coline_name: string,
}

export default class MeetingAutorization {
  meetingUuid: string;
  authorizationUuid: string;
  userUuid: string;
  userName: string;

  constructor({
    meetingUuid,
    authorizationUuid,
    userUuid,
    userName,
  }: Object = {}) {
    this.meetingUuid = meetingUuid;
    this.authorizationUuid = authorizationUuid;
    this.userUuid = userUuid;
    this.userName = userName;
  }

  static parse(plain: RawMeetingAutorization) {
    const {
      meeting_uuid: meetingUuid,
      authorization_uuid: authorizationUuid,
      coline_uuid: userUuid,
      coline_name: userName,
    } = plain;

    return new MeetingAutorization({
      meetingUuid,
      authorizationUuid,
      userUuid,
      userName,
    });
  }

  static parseMany(items: RawMeetingAutorization[]): Array<MeetingAutorization> {
    if (!items) {
      return [];
    }
    return items.map(plain => MeetingAutorization.parse(plain));
  }
}
