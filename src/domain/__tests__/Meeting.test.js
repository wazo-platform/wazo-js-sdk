// @flow
/* global btoa */

import Meeting, { ACCESS_CONTROL_CONTROLLED, ACCESS_CONTROL_LOCKED, ACCESS_CONTROL_OPEN } from '../Meeting';

describe('Meeting domain', () => {
  it('can return username and secret from an base64 encrypted string', () => {
    const USERNAME = 'username';
    const SECRET = 'secret';

    const args = {
      guest_sip_authorization: btoa(`${USERNAME}:${SECRET}`),
      creation_time: '',
      ingress_http_uri: '',
      name: '',
      owner_uuids: [],
      port: '',
      uuid: '',
      exten: '',
      persistent: false,
      require_authorization: false,
      locked: false,
    };

    const meeting = Meeting.parse(args);

    const { username, secret } = meeting.getGuestSipCredentials();

    expect(username).toEqual(USERNAME);
    expect(secret).toEqual(SECRET);
  });

  it('should return a date from a string', () => {
    const args = {
      creation_time: '2021-12-21T15:56:42.880Z',
      guest_sip_authorization: '',
      ingress_http_uri: '',
      name: '',
      owner_uuids: [],
      port: '',
      uuid: '',
      exten: '',
      persistent: false,
      require_authorization: false,
      locked: false,
    };

    const { creationTime } = Meeting.parse(args);

    expect(creationTime.getDate()).toEqual(21);
    expect(creationTime.getFullYear()).toEqual(2021);
    expect(creationTime.getMonth()).toEqual(11);
  });

  describe('getAccessControl', () => {
    describe('open', () => {
      const meeting = new Meeting({ requireAuthorization: false, locked: false });
      it('should return OPEN', () => {
        expect(meeting.getAccessControl()).toEqual(ACCESS_CONTROL_OPEN);
      });
    });
    describe('controlled', () => {
      it('should return CONTROLLED', () => {
        const meeting = new Meeting({ requireAuthorization: true, locked: false });
        expect(meeting.getAccessControl()).toEqual(ACCESS_CONTROL_CONTROLLED);
      });
    });
    describe('locked', () => {
      it('should return OPEN', () => {
        const meeting = new Meeting({ requireAuthorization: false, locked: true });
        expect(meeting.getAccessControl()).toEqual(ACCESS_CONTROL_LOCKED);
      });
      it('should return OPEN even if requireAuthorization is set to tru', () => {
        const meeting = new Meeting({ requireAuthorization: true, locked: true });
        expect(meeting.getAccessControl()).toEqual(ACCESS_CONTROL_LOCKED);
      });
    });
  });

  describe('getValuesFromAccessControl', () => {
    it('should make sure it returns the appropriate values', () => {
      expect(Meeting.deriveValuesFromAccessControl(ACCESS_CONTROL_OPEN))
        .toEqual({ locked: false, requireAuthorization: false });
      expect(Meeting.deriveValuesFromAccessControl(ACCESS_CONTROL_CONTROLLED))
        .toEqual({ locked: false, requireAuthorization: true });
      expect(Meeting.deriveValuesFromAccessControl(ACCESS_CONTROL_LOCKED))
        .toEqual({ locked: true, requireAuthorization: false });
    });
  });
});
