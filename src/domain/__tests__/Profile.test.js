// @flow

import Profile from '../Profile';
import Line from '../Line';
import ForwardOption, { FORWARD_KEYS } from '../ForwardOption';

describe('Profile domain', () => {
  it('can parse a plain profile to domain', () => {
    const plain = {
      id: 10,
      uuid: 'xxx-xxx-xxx-xx',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@acme.com',
      lines: [
        { id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }], endpoint_custom: null },
        { id: 3421, extensions: [{ id: 2, exten: '9980', context: 'internal' }], endpoint_custom: null }
      ],
      username: 'john.doe',
      services: {
        dnd: {
          enabled: false
        }
      },
      forwards: {
        busy: {
          destination: '1',
          enabled: true
        },
        noanswer: {
          destination: '',
          enabled: false
        },
        unconditional: {
          destination: '12',
          enabled: true
        }
      },
      groups: [],
      language: 'FR',
      mobile_phone_number: null,
      timezone: null
    };

    const profile = Profile.parse(plain);

    expect(profile).toEqual(
      new Profile({
        id: 'xxx-xxx-xxx-xx',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@acme.com',
        forwards: [
          new ForwardOption({ destination: '12', enabled: true, key: FORWARD_KEYS.UNCONDITIONAL }),
          new ForwardOption({ destination: '', enabled: false, key: FORWARD_KEYS.NO_ANSWER }),
          new ForwardOption({ destination: '1', enabled: true, key: FORWARD_KEYS.BUSY })
        ],
        lines: [
          new Line({ id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }] }),
          new Line({ id: 3421, extensions: [{ id: 2, exten: '9980', context: 'internal' }] })
        ],
        mobileNumber: '',
        username: 'john.doe',
        doNotDisturb: false
      })
    );
  });
});
