import Contact from '../Contact';

const genericContactResponse = {
  column_types: [
    'name',
    'firstname',
    'lastname',
    'number',
    'callable',
    'voicemail',
    'favorite',
    'email',
    'personal',
  ],
  term: 'a',
  column_headers: [
    'Nom',
    'Pr\u00e9nom',
    'Nom de famille',
    'Num\u00e9ro',
    'Mobile',
    'Bo\u00eete vocale',
    'Favoris',
    'E-mail',
    'Personnel',
  ],
  results: [],
};

const contact1 = {
  source: 'internal',
  column_values: [
    'Jonathan Lessard',
    'Jonathan',
    'Lessard',
    '8020',
    '06800880',
    null,
    false,
    'jonathan@example.com',
    false,
  ],
  backend: 'wazo',
  relations: {
    user_id: 8,
    xivo_id: '6cd695d2-cdb9-4444-8b2d-27425ab85fa8',
    agent_id: null,
    endpoint_id: 8,
    user_uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
    source_entry_id: '8',
  },
};

const contact2 = {
  source: 'internal',
  column_values: [
    'John Doe',
    'John',
    'Doe',
    '8021',
    '06800881',
    null,
    false,
    'john@example.com',
    false,
  ],
  backend: 'wazo',
  relations: {
    user_id: 9,
    xivo_id: '6cd695d2-cdb9-4444-8b2d-27425ab85fa9',
    agent_id: null,
    endpoint_id: 9,
    user_uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b55',
    source_entry_id: '9',
  },
};

const parsedContact1 = new Contact({
  name: 'Jonathan Lessard',
  firstName: 'Jonathan',
  lastName: 'Lessard',
  number: '8020',
  numbers: [
    {
      label: 'primary',
      number: '8020',
    },
    {
      label: 'secondary',
      number: '06800880',
    },
  ],
  favorited: false,
  email: 'jonathan@example.com',
  emails: [
    {
      label: 'primary',
      email: 'jonathan@example.com',
    },
  ],
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
});

const parsedContact2 = new Contact({
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  number: '8021',
  numbers: [
    {
      label: 'primary',
      number: '8021',
    },
    {
      label: 'secondary',
      number: '06800881',
    },
  ],
  favorited: false,
  email: 'john@example.com',
  emails: [
    {
      label: 'primary',
      email: 'john@example.com',
    },
  ],
  address: '',
  entreprise: '',
  birthday: '',
  note: '',
  endpointId: 9,
  personal: false,
  source: 'internal',
  sourceId: '9',
  uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b55',
  backend: 'wazo',
});

describe('Contact domain', () => {
  it('is extern when given no uuid', () => {
    const boba = new Contact({});
    expect(boba.isIntern()).toBeFalsy();
  });
  it('is intern when given a uuid', () => {
    const boba = new Contact({
      uuid: '123',
    });
    expect(boba.isIntern()).toBeTruthy();
  });
  it('is the same contact when it has the same uuid and sourceId', () => {
    const john = new Contact({
      uuid: '12345',
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    const sam = new Contact({
      uuid: '12345',
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    expect(john.is(sam)).toBe(true);
  });
  it('is the same contact when it has the same uuid and no sourceId', () => {
    const john = new Contact({
      uuid: '12345',
      sourceId: undefined,
      backend: 'some-backend',
      source: 'wazo',
    });
    const sam = new Contact({
      uuid: '12345',
      sourceId: undefined,
      backend: 'some-backend',
      source: 'wazo',
    });
    expect(john.is(sam)).toBe(true);
  });
  it('is the same contact when it has the same uuid and no sourceId', () => {
    const john = new Contact({
      uuid: '12345',
      sourceId: undefined,
      backend: 'some-backend',
      source: 'wazo',
    });
    const sam = new Contact({
      uuid: '12345',
      sourceId: undefined,
      backend: 'some-backend',
      source: 'wazo',
    });
    expect(john.is(sam)).toBe(true);
  });
  it('is the same contact when one is missing a uuid but they have the same sourceId', () => {
    const john = new Contact({
      uuid: '12345',
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    const sam = new Contact({
      uuid: undefined,
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    expect(john.is(sam)).toBe(true);
  });
  it('is the same contact when one is missing a sourceId but they have the same sourceId', () => {
    const john = new Contact({
      uuid: '12345',
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    const sam = new Contact({
      uuid: '12345',
      sourceId: undefined,
      backend: 'some-backend',
      source: 'wazo',
    });
    expect(john.is(sam)).toBe(true);
  });
  it('is the same contact even when it has different uuid', () => {
    const john = new Contact({
      uuid: 'abc',
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    const sam = new Contact({
      uuid: '12345',
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    expect(john.is(sam)).toBe(true);
  });
  it('is the same contact even when it has different sourceId', () => {
    const john = new Contact({
      uuid: '12345',
      sourceId: '100',
      backend: 'some-backend',
      source: 'wazo',
    });
    const sam = new Contact({
      uuid: '12345',
      sourceId: '800',
      backend: 'some-backend',
      source: 'wazo',
    });
    expect(john.is(sam)).toBe(true);
  });
  it('has the id given the same uuid', () => {
    const contact = new Contact({
      uuid: 'uuid-12345',
    });
    expect(contact.hasId('uuid-12345')).toBeTruthy();
  });
  it('does not have the id given a different uuid', () => {
    const contact = new Contact({
      uuid: 'uuid-12345',
    });
    expect(contact.hasId('uuid-dummy')).toBeFalsy();
  });
  it('does separate names with a single space', () => {
    const contact = new Contact({
      name: 'John Smith',
    });
    const { firstName, lastName } = contact.separateName();
    expect(firstName).toBe('John');
    expect(lastName).toBe('Smith');
  });
  it('does separate names with multiple spaces', () => {
    const contact = new Contact({
      name: 'John  Smith',
    });
    const { firstName, lastName } = contact.separateName();
    expect(firstName).toBe('John');
    expect(lastName).toBe('Smith');
  });
  it('is available given an available state', () => {
    const contact = new Contact({
      uuid: 'uuid-12345',
      state: 'available',
    });
    expect(contact.isAvailable()).toBeTruthy();
  });
  it('is not available given a non available state', () => {
    const contact = new Contact({
      uuid: 'uuid-12345',
      state: 'donotdisturb',
    });
    expect(contact.isAvailable()).toBeFalsy();
  });
  it('is not available given no state', () => {
    const contact = new Contact({
      uuid: 'uuid-12345',
    });
    expect(contact.isAvailable()).toBeFalsy();
  });
  it('can parse a plain contact to domain', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1],
    };
    const contact = Contact.parse(response.results[0], response.column_types);
    expect(contact).toEqual(parsedContact1);
  });
  it('should merge 2 contact', () => {
    const noBirthdayContact = new Contact({
      uuid: 'uuid-12345',
      lastActivity: 'yesterday',
      birthday: undefined,
    });
    const noLastActivityContact = new Contact({
      uuid: 'uuid-12345',
      lastActivity: undefined,
      birthday: 'tomorrow',
    });
    const result = noBirthdayContact.merge(noLastActivityContact);
    expect(result.lastActivity).toBe('yesterday');
    expect(result.birthday).toBe('tomorrow');
  });
  it('returns all contacts when parsing many contacts with no limit', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1, contact2],
    };

    const contacts = Contact.parseMany(response);
    expect(contacts).toEqual([parsedContact1, parsedContact2]);
  });
  it('returns all contacts when parsing many contacts with a higher limit than number of results', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1, contact2],
    };

    const contacts = Contact.parseMany(response, 0, 1000);
    expect(contacts).toEqual([parsedContact1, parsedContact2]);
  });
  it('returns limited contacts when parsing many contacts with a smaller limit than number of results', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1],
    };

    const contacts = Contact.parseMany(response, 0, 1);
    expect(contacts).toEqual([parsedContact1]);
  });
  it('returns all contacts when parsing many contacts with same limit than number of results', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1, contact2],
    };

    const contacts = Contact.parseMany(response, 0, 2);
    expect(contacts).toEqual([parsedContact1, parsedContact2]);
  });
  it('returns an empty array when parsing many contact with limit of 0', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1, contact2],
    };

    const contacts = Contact.parseMany(response, 0, 0);
    expect(contacts).toEqual([]);
  });
  it('returns all contacts when parsing many contacts with a negative limit', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1, contact2],
    };

    const contacts = Contact.parseMany(response, 0, -1);
    expect(contacts).toEqual([parsedContact1, parsedContact2]);
  });
  it('returns all contacts when parsing many contacts with a null limit', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1, contact2],
    };

    const contacts = Contact.parseMany(response, 0, null);
    expect(contacts).toEqual([parsedContact1, parsedContact2]);
  });
  it('returns all contacts after the first one when parsing many contacts with an offset of 1', () => {
    const response = {
      ...genericContactResponse,
      results: [contact1, contact2],
    };

    const contacts = Contact.parseMany(response, 1, null);
    expect(contacts).toEqual([parsedContact2]);
  });
});
