// @flow

import Profile from '../Profile';
import Line from '../Line';
import ForwardOption, { FORWARD_KEYS } from '../ForwardOption';

describe('Profile domain', () => {
  it('should create a new Profile from another one', () => {
    const attributes = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      lines: [
        new Line({ id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }], endpoint_custom: null }),
      ],
      username: 'john.doe',
      forwards: [],
      mobileNumber: '123',
    };
    const oldProfile = new Profile(attributes);
    const newProfile = Profile.newFrom(oldProfile);

    expect(newProfile).toBeInstanceOf(Profile);
    expect(newProfile.firstName).toBe(attributes.firstName);
    expect(newProfile.email).toBe(attributes.email);
    expect(newProfile.lines[0].extensions[0].exten).toBe('8000');
  });

  it('can parse a plain profile to domain', () => {
    const plain = {
      id: 10,
      uuid: 'xxx-xxx-xxx-xx',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      subscription_type: 2,
      lines: [
        { id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }], endpoint_custom: null },
        { id: 3421, extensions: [{ id: 2, exten: '9980', context: 'internal' }], endpoint_custom: null },
      ],
      username: 'john.doe',
      services: {
        dnd: {
          enabled: false,
        },
      },
      forwards: {
        busy: {
          destination: '1',
          enabled: true,
        },
        noanswer: {
          destination: '',
          enabled: false,
        },
        unconditional: {
          destination: '12',
          enabled: true,
        },
      },
      groups: [],
      language: 'FR',
      mobile_phone_number: null,
      timezone: null,
      mobileNumber: '1234',
      switchboards: [],
    };

    const profile = Profile.parse(plain);

    expect(profile).toEqual(
      new Profile({
        id: 'xxx-xxx-xxx-xx',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@acme.com',
        forwards: [
          new ForwardOption({ destination: '12', enabled: true, key: FORWARD_KEYS.UNCONDITIONAL }),
          new ForwardOption({ destination: '', enabled: false, key: FORWARD_KEYS.NO_ANSWER }),
          new ForwardOption({ destination: '1', enabled: true, key: FORWARD_KEYS.BUSY }),
        ],
        lines: [
          new Line({ id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }] }),
          new Line({ id: 3421, extensions: [{ id: 2, exten: '9980', context: 'internal' }] }),
        ],
        mobileNumber: '',
        username: 'john.doe',
        doNotDisturb: false,
        subscriptionType: 2,
        switchboards: [],
        status: '',
      }),
    );
  });
});
