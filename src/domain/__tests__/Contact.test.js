// @flow

import Contact from '../Contact';

describe('Contact domain', () => {
  it('is extern when given no uuid', () => {
    const boba = new Contact({});

    expect(boba.isIntern()).toBeFalsy();
  });

  it('is intern when given a uuid', () => {
    const boba = new Contact({ uuid: '123' });

    expect(boba.isIntern()).toBeTruthy();
  });

  it('is the same contact when it has the same uuid and sourceId', () => {
    const john = new Contact({ uuid: '12345', sourceId: '800', backend: 'some-backend', source: 'wazo' });
    const sam = new Contact({ uuid: '12345', sourceId: '800', backend: 'some-backend', source: 'wazo' });

    expect(john.is(sam)).toBe(true);
  });

  it('is the same contact when it has the same uuid and no sourceId', () => {
    const john = new Contact({ uuid: '12345', sourceId: undefined, backend: 'some-backend', source: 'wazo' });
    const sam = new Contact({ uuid: '12345', sourceId: undefined, backend: 'some-backend', source: 'wazo' });

    expect(john.is(sam)).toBe(true);
  });

  it('is the same contact when it has the same uuid and no sourceId', () => {
    const john = new Contact({ uuid: '12345', sourceId: undefined, backend: 'some-backend', source: 'wazo' });
    const sam = new Contact({ uuid: '12345', sourceId: undefined, backend: 'some-backend', source: 'wazo' });

    expect(john.is(sam)).toBe(true);
  });

  it('is the same contact when one is missing a uuid but they have the same sourceId', () => {
    const john = new Contact({ uuid: '12345', sourceId: '800', backend: 'some-backend', source: 'wazo' });
    const sam = new Contact({ uuid: undefined, sourceId: '800', backend: 'some-backend', source: 'wazo' });

    expect(john.is(sam)).toBe(true);
  });

  it('is the same contact when one is missing a sourceId but they have the same sourceId', () => {
    const john = new Contact({ uuid: '12345', sourceId: '800', backend: 'some-backend', source: 'wazo' });
    const sam = new Contact({ uuid: '12345', sourceId: undefined, backend: 'some-backend', source: 'wazo' });

    expect(john.is(sam)).toBe(true);
  });

  it('is the same contact even when it has different uuid', () => {
    const john = new Contact({ uuid: 'abc', sourceId: '800', backend: 'some-backend', source: 'wazo' });
    const sam = new Contact({ uuid: '12345', sourceId: '800', backend: 'some-backend', source: 'wazo' });

    expect(john.is(sam)).toBe(true);
  });

  it('is the same contact even when it has different sourceId', () => {
    const john = new Contact({ uuid: '12345', sourceId: '100', backend: 'some-backend', source: 'wazo' });
    const sam = new Contact({ uuid: '12345', sourceId: '800', backend: 'some-backend', source: 'wazo' });

    expect(john.is(sam)).toBe(true);
  });

  it('has the id given the same uuid', () => {
    const contact = new Contact({ uuid: 'uuid-12345' });

    expect(contact.hasId('uuid-12345')).toBeTruthy();
  });

  it('does not have the id given a different uuid', () => {
    const contact = new Contact({ uuid: 'uuid-12345' });

    expect(contact.hasId('uuid-dummy')).toBeFalsy();
  });

  it('does separate names with a single space', () => {
    const contact = new Contact({ name: 'John Smith' });
    const { firstName, lastName } = contact.separateName();

    expect(firstName).toBe('John');
    expect(lastName).toBe('Smith');
  });

  it('does separate names with multiple spaces', () => {
    const contact = new Contact({ name: 'John  Smith' });
    const { firstName, lastName } = contact.separateName();

    expect(firstName).toBe('John');
    expect(lastName).toBe('Smith');
  });

  it('is available given an available state', () => {
    const contact = new Contact({ uuid: 'uuid-12345', state: 'available' });

    expect(contact.isAvailable()).toBeTruthy();
  });

  it('is not available given a non available state', () => {
    const contact = new Contact({ uuid: 'uuid-12345', state: 'donotdisturb' });

    expect(contact.isAvailable()).toBeFalsy();
  });

  it('is not available given no state', () => {
    const contact = new Contact({ uuid: 'uuid-12345' });

    expect(contact.isAvailable()).toBeFalsy();
  });

  it('can parse a plain contact to domain', () => {
    const response = {
      column_types: ['name', 'number', 'callable', 'voicemail', 'favorite', 'email', 'personal'],
      term: 'a',
      column_headers: ['Nom', 'Num\u00e9ro', 'Mobile', 'Bo\u00eete vocale', 'Favoris', 'E-mail', 'Personnel'],
      results: [
        {
          source: 'internal',
          column_values: ['Jonathan Lessard', '8020', '06800880', null, false, 'contact@nexapp.ca', false],
          backend: 'wazo',
          relations: {
            user_id: 8,
            xivo_id: '6cd695d2-cdb9-4444-8b2d-27425ab85fa8',
            agent_id: null,
            endpoint_id: 8,
            user_uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
            source_entry_id: '8',
          },
        },
      ],
    };

    const contact = Contact.parse(response.results[0], response.column_types);

    expect(contact).toEqual(
      new Contact({
        name: 'Jonathan Lessard',
        number: '8020',
        numbers: [{ label: 'primary', number: '8020' }, { label: 'secondary', number: '06800880' }],
        favorited: false,
        email: 'contact@nexapp.ca',
        emails: [{ label: 'primary', email: 'contact@nexapp.ca' }],
        address: '',
        entreprise: '',
        birthday: '',
        note: '',
        endpointId: 8,
        personal: false,
        source: 'internal',
        sourceId: '8',
        uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
        backend: 'wazo',
      }),
    );
  });
});
