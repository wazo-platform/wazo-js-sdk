import MeetingAuthorization from '../MeetingAuthorization';

describe('MeetingAuthorization', () => {
  describe('parse', () => {
    it('should parse a raw input', () => {
      const rawAuthorization = {
        created_at: 'today',
        meeting_uuid: 'meeting_uuid',
        uuid: 'uuid',
        guest_uuid: 'guest_uuid',
        guest_name: 'guest_name',
      };

      const authorization = {
        meetingUuid: rawAuthorization.meeting_uuid,
        uuid: rawAuthorization.uuid,
        userUuid: rawAuthorization.guest_uuid,
        userName: rawAuthorization.guest_name,
      };

      const response = MeetingAuthorization.parse(rawAuthorization);
      expect(response).toEqual(authorization);
    });
  });

  describe('parseMany', () => {
    it('should parse multiple raw inputs', () => {
      const rawAuthorizations = [
        {
          created_at: 'today1',
          meeting_uuid: 'meeting_uuid1',
          uuid: 'uuid1',
          guest_uuid: 'guest_uuid1',
          guest_name: 'guest_name1',
        },
        {
          created_at: 'today2',
          meeting_uuid: 'meeting_uuid2',
          uuid: 'uuid2',
          guest_uuid: 'guest_uuid2',
          guest_name: 'guest_name2',
        },
      ];

      const authorizations = rawAuthorizations.map(rawAuthorization => ({
        meetingUuid: rawAuthorization.meeting_uuid,
        uuid: rawAuthorization.uuid,
        userUuid: rawAuthorization.guest_uuid,
        userName: rawAuthorization.guest_name,
      }));

      const response = MeetingAuthorization.parseMany(rawAuthorizations);
      expect(response).toEqual(authorizations);
    });
  });
});
