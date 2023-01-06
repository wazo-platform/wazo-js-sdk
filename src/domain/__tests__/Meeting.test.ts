import moment from 'moment';
import Meeting from '../Meeting';

const rawCreationTime = '2021-12-21T15:56:42.880Z';
describe('Meeting domain', () => {
  it('should retain its values when parsed', () => {
    const args = {
      guest_sip_authorization: 'some-guest-sip-authorization',
      ingress_http_uri: 'some-uri',
      name: 'some-name',
      owner_uuids: ['some-owner-uuid'],
      port: 'some-port',
      uuid: 'some-uuid',
      exten: 'some-exten',
      persistent: true,
      creation_time: rawCreationTime,
      require_authorization: true,
    };
    const meeting = Meeting.parse(args);
    const {
      uri,
      uuid,
      name,
      port,
      extension,
      persistent,
      ownerUuids,
      creationTime,
      requireAuthorization,
    } = meeting;
    expect(uri).toEqual(args.ingress_http_uri);
    expect(uuid).toEqual(args.uuid);
    expect(name).toEqual(args.name);
    expect(port).toEqual(args.port);
    expect(extension).toEqual(args.exten);
    expect(persistent).toEqual(args.persistent);
    expect(ownerUuids).toEqual(args.owner_uuids);
    expect(creationTime).toEqual(moment(rawCreationTime).toDate());
    expect(requireAuthorization).toEqual(args.require_authorization);
  });
  it('should retain its values when instantiated', () => {
    const keys = ['uuid', 'name', 'guestSipAuthorization', 'ownerUuids', 'port', 'uri', 'extension', 'persistent', 'creationTime', 'requireAuthorization'];
    const args = keys.reduce((acc, key) => {
      acc[key] = `some-${key}`;
      return acc;
    }, {});
    const meeting = new Meeting(args);
    keys.forEach(key => expect(meeting[key]).toEqual(`some-${key}`));
  });
  it('can return username and secret from an base64 encrypted string', () => {
    const USERNAME = 'username';
    const SECRET = 'secret';
    const args = {
      guest_sip_authorization: Buffer.from(`${USERNAME}:${SECRET}`).toString('base64'),
      creation_time: '',
      ingress_http_uri: '',
      name: '',
      owner_uuids: [],
      port: '',
      uuid: '',
      exten: '',
      persistent: false,
      require_authorization: false,
    };
    const meeting = Meeting.parse(args);
    const {
      username,
      secret,
    } = meeting.getGuestSipCredentials();
    expect(username).toEqual(USERNAME);
    expect(secret).toEqual(SECRET);
  });
  it('should return a date from a string', () => {
    const args = {
      creation_time: rawCreationTime,
      guest_sip_authorization: '',
      ingress_http_uri: '',
      name: '',
      owner_uuids: [],
      port: '',
      uuid: '',
      exten: '',
      persistent: false,
      require_authorization: false,
    };
    const {
      creationTime,
    } = Meeting.parse(args);
    expect(creationTime.getDate()).toEqual(21);
    expect(creationTime.getFullYear()).toEqual(2021);
    expect(creationTime.getMonth()).toEqual(11);
  });
});
