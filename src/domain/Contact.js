// @flow

import Session from './Session';
import newFrom from '../utils/new-from';

export type NewContact = {
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: ?string,
  address: ?string,
  entreprise: ?string,
  birthday: ?string,
  note: ?string
};

export type ContactResponse = {
  source: string,
  column_values: Array<any>,
  relations: {
    user_id: number,
    xivo_id: string,
    agent_id: ?number,
    endpoint_id: number,
    user_uuid: string,
    source_entry_id: string
  }
};

export type ContactsResponse = {
  column_types: Array<?string>,
  term: string,
  column_headers: Array<string>,
  results: Array<ContactResponse>
};

export type ContactPersonalResponse = {
  id: string,
  firstName: ?string,
  lastName: ?string,
  number: ?string,
  numbers: ?Array<{ label: string, number: string }>;
  email: ?string,
  numbers: ?Array<{ label: string, email: string }>;
  entreprise: ?string,
  birthday: ?string,
  address: ?string,
  note: ?string,
  // @TODO: legacy ?
  firstname: ?string,
  lastname: ?string
};

// @see: https://github.com/rt2zz/react-native-contacts#example-contact-record
export type ContactMobileResponse = {
  recordID: string,
  company: string,
  emailAddresses: Array<{
    label: string,
    email: string
  }>,
  givenName: string,
  familyName: string,
  middleName: string,
  jobTitle: string,
  note: string,
  urlAddresses: Array<{
    label: string,
    url: string
  }>,
  phoneNumbers: Array<{
    label: string,
    number: string
  }>,
  hasThumbnail: boolean,
  thumbnailPath: string,
  postalAddresses: Array<{
    street: string,
    city: string,
    state: string,
    region: string,
    postCode: string,
    country: string,
    label: string
  }>,
  birthday: {
    year: number,
    month: number,
    day: number
  }
};

type ContactArguments = {
  id?: string,
  uuid?: string,
  name?: string,
  number?: string,
  numbers?: Array<{ label: string, number: string }>,
  favorited?: boolean,
  email?: string,
  emails?: Array<{ label: string, email: string }>,
  entreprise?: string,
  birthday?: string,
  address?: string,
  note?: string,
  endpointId?: number,
  personal?: boolean,
  presence?: string,
  source?: string,
  sourceId?: string,
  status?: number,
  endpointId?: number,
  uuid?: string
};

const SOURCE_MOBILE = 'mobile';

const AST_STATUS_CODES = {
  REMOVED: -2, // Extension removed
  DEACTIVATED: -1, // Extension hint removed
  NOTINUSE: 0, // No device INUSE or BUSY
  INUSE: 1, // Bitwise: 1 << 0 | One or more devices INUSE
  BUSY: 2, // Bitwise: 1 << 1 | All devices BUSY
  UNAVAILABLE: 4, // Bitwise: 1 << 2 | All devices UNAVAILABLE/UNREGISTERED
  RINGING: 8, // Bitwise: 1 << 3 | All devices RINGING
  INUSE_AND_RINGING: 9, // In use and ringing
  ONHOLD: 16 // Bitwise: 1 << 4 | All devices ONHOLD
};

export default class Contact {
  id: ?string;
  uuid: ?string;
  name: ?string;
  number: ?string;
  numbers: ?Array<{ label: string, number: string }>;
  favorited: ?boolean;
  email: ?string;
  emails: ?Array<{ label: string, email: string }>;
  entreprise: ?string;
  birthday: ?string;
  address: ?string;
  note: ?string;
  endpointId: ?number;
  personal: ?boolean;
  presence: ?string;
  source: ?string;
  sourceId: string;
  status: ?number;

  static merge(oldContacts: Array<Contact>, newContacts: Array<Contact>): Array<Contact> {
    return newContacts.map(current => {
      const old = oldContacts.find(contact => contact.is(current));

      return typeof old !== 'undefined' ? current.merge(old) : current;
    });
  }

  static sortContacts(a: Contact, b: Contact) {
    const aNames = a.separateName();
    const bNames = b.separateName();
    const aLastName = aNames.lastName;
    const bLastName = bNames.lastName;

    // last Name can be empty
    if (aLastName === bLastName) {
      return aNames.firstName.localeCompare(bNames.firstName);
    }

    return aLastName.localeCompare(bLastName);
  }

  static parseMany(response: ContactsResponse): Array<Contact> {
    return response.results.map(r => Contact.parse(r, response.column_types));
  }

  static parse(plain: ContactResponse, columns: Array<?string>): Contact {
    return new Contact({
      name: plain.column_values[columns.indexOf('name')],
      number: plain.column_values[columns.indexOf('number')] || '',
      numbers: [{ label: 'primary', number: plain.column_values[columns.indexOf('number')] }] || [],
      favorited: plain.column_values[columns.indexOf('favorite')],
      email: plain.column_values[columns.indexOf('email')] || '',
      emails: [{ label: 'primary', email: plain.column_values[columns.indexOf('email')] }] || [],
      entreprise: plain.column_values[columns.indexOf('entreprise')] || '',
      birthday: plain.column_values[columns.indexOf('birthday')] || '',
      address: plain.column_values[columns.indexOf('address')] || '',
      note: plain.column_values[columns.indexOf('note')] || '',
      endpointId: plain.relations.endpoint_id,
      personal: plain.column_values[columns.indexOf('personal')],
      source: plain.source,
      sourceId: plain.relations.source_entry_id,
      uuid: plain.relations.user_uuid
    });
  }

  static parseManyPersonal(results: Array<ContactPersonalResponse>): Array<?Contact> {
    return results.map(r => Contact.parsePersonal(r));
  }

  static parsePersonal(plain: ContactPersonalResponse): Contact {
    return new Contact({
      name: `${plain.firstName || plain.firstname || ''} ${plain.lastName || plain.lastname || ''}`,
      number: plain.number || '',
      numbers: plain.number ? [{ label: 'primary', number: plain.number }] : [],
      email: plain.email || '',
      emails: plain.email ? [{ label: 'primary', email: plain.email }] : [],
      source: 'personal',
      sourceId: plain.id,
      entreprise: plain.entreprise || '',
      birthday: plain.birthday || '',
      address: plain.address || '',
      note: plain.note || '',
      favorited: false,
      personal: true
    });
  }

  static parseMobile(plain: ContactMobileResponse): Contact {
    let address = '';
    if (plain.postalAddresses.length) {
      const postalAddress = plain.postalAddresses[0];

      address = `${postalAddress.street} ${postalAddress.city} ${postalAddress.postCode} ${postalAddress.country}`;
    }

    return new Contact({
      name: `${plain.givenName || ''} ${plain.familyName || ''}`,
      number: plain.phoneNumbers.length ? plain.phoneNumbers[0].number : '',
      numbers: plain.phoneNumbers.length ? [{ label: 'primary', number: plain.phoneNumbers[0].number }] : [],
      email: plain.emailAddresses.length ? plain.emailAddresses[0].email : '',
      emails: plain.emailAddresses.length ? [{ label: 'primary', email: plain.emailAddresses[0].email }] : [],
      source: SOURCE_MOBILE,
      sourceId: plain.recordID,
      birthday: plain.birthday ? `${plain.birthday.year}-${plain.birthday.month}-${plain.birthday.day}` : '',
      address,
      note: plain.note || '',
      favorited: false,
      personal: true
    });
  }

  static newFrom(profile: Contact) {
    return newFrom(profile, Contact);
  }

  constructor({
    id,
    uuid,
    name,
    number,
    numbers,
    email,
    emails,
    source,
    sourceId,
    entreprise,
    birthday,
    address,
    note,
    presence,
    status,
    endpointId,
    personal,
    favorited
  }: ContactArguments = {}) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.number = number;
    this.numbers = numbers;
    this.email = email;
    this.emails = emails;
    this.source = source;
    this.sourceId = sourceId || '';
    this.entreprise = entreprise;
    this.birthday = birthday;
    this.address = address;
    this.note = note;
    this.presence = presence;
    this.status = status;
    this.endpointId = endpointId;
    this.personal = personal;
    this.favorited = favorited;
  }

  setFavorite(value: boolean) {
    this.favorited = value;

    return this;
  }

  is(other: Contact): boolean {
    return Boolean(other) && this.sourceId === other.sourceId && (this.uuid ? this.uuid === other.uuid : true);
  }

  hasId(id: string): boolean {
    return this.uuid === id;
  }

  hasNumber(number: string): boolean {
    return this.number === number;
  }

  hasEndpointId(endpointId: number): boolean {
    return this.endpointId === endpointId;
  }

  isAvailable(): boolean {
    return this.presence === 'available';
  }

  isDoNotDisturb(): boolean {
    return this.presence === 'donotdisturb';
  }

  isDisconnected(): boolean {
    return this.presence === 'disconnected';
  }

  isInCall(): boolean {
    return this.status === AST_STATUS_CODES.INUSE || this.status === AST_STATUS_CODES.ONHOLD;
  }

  isRinging(): boolean {
    return this.status === AST_STATUS_CODES.RINGING;
  }

  isInUseOrRinging(): boolean {
    return this.status === AST_STATUS_CODES.INUSE_AND_RINGING;
  }

  merge(old: Contact): Contact {
    this.presence = old.presence;
    this.status = old.status;

    return this;
  }

  isIntern(): boolean {
    return !!this.uuid;
  }

  isCallable(session: Session): boolean {
    return !!this.number && !!session && !session.is(this);
  }

  isFromMobile() {
    return this.source === SOURCE_MOBILE;
  }

  isFavorite() {
    return this.favorited;
  }

  separateName(): { firstName: string, lastName: string } {
    if (!this.name) {
      return {
        firstName: '',
        lastName: ''
      };
    }
    const names = this.name.split(/\s+/);
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');

    return {
      firstName,
      lastName
    };
  }
}
