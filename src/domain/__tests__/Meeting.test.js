// @flow
/* global btoa */

import Meeting from '../Meeting';

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
    };

    const { creationTime } = Meeting.parse(args);

    expect(creationTime.getDate()).toEqual(21);
    expect(creationTime.getFullYear()).toEqual(2021);
    expect(creationTime.getMonth()).toEqual(11);
  });
});
