import Session from './Session';
import { LINE_STATE, STATE } from './Profile';
import newFrom from '../utils/new-from';
import type { DirectorySource } from './DirectorySource';

export const BACKEND = {
  OFFICE365: 'office365',
  PERSONAL: 'personal',
  GOOGLE: 'google',
  WAZO: 'wazo',
  CONFERENCE: 'conference',
  PHONEBOOK: 'phonebook',
};
export interface NewContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string | null | undefined;
  address: string | null | undefined;
  entreprise: string | null | undefined;
  birthday: string | null | undefined;
  note: string | null | undefined;
  sessions: Array<{
    uuid: string;
    mobile: boolean;
  }> | null | undefined;
  connected: boolean | null | undefined;
}
export type ContactResponse = {
  source: string;
  backend: string;
  column_values: Array<any>;
  relations: {
    user_id: number;
    xivo_id: string;
    agent_id: number | null | undefined;
    endpoint_id: number;
    user_uuid: string;
    source_entry_id: string;
  };
};
export type ContactsResponse = {
  column_types: Array<string | null | undefined>;
  term: string;
  column_headers: Array<string>;
  results: Array<ContactResponse>;
};
export type ContactPersonalResponse = {
  id: string;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  number: string | null | undefined;
  numbers: Array<{
    label?: string;
    number: string;
  }> | null | undefined;
  email: string | null | undefined;
  entreprise: string | null | undefined;
  birthday: string | null | undefined;
  address: string | null | undefined;
  note: string | null | undefined;
  // @TODO: legacy ?
  firstname: string | null | undefined;
  lastname: string | null | undefined;
  backend: string | null | undefined;
  favorited: boolean;
};
export type ContactsGraphQlResponse = {
  data: {
    me: {
      contacts: {
        edges: Array<{
          node: {
            firstname?: string;
            lastname?: string;
            wazoReverse?: string;
            wazoSourceName?: string;
            wazoBackend?: string;
            email?: string;
            wazoSourceEntryId?: string;
            userUuid?: string;
          };
        }>;
      };
    };
  };
};
// @see: https://github.com/rt2zz/react-native-contacts#example-contact-record
export type ContactMobileResponse = {
  recordID: string;
  company: string;
  emailAddresses: Array<{
    label: string;
    email: string;
  }>;
  givenName: string;
  familyName: string;
  middleName: string;
  jobTitle: string;
  note: string;
  urlAddresses: Array<{
    label: string;
    url: string;
  }>;
  phoneNumbers: Array<{
    label: string;
    number: string;
  }>;
  hasThumbnail: boolean;
  thumbnailPath: string;
  postalAddresses: Array<{
    street: string;
    city: string;
    state: string;
    region: string;
    postCode: string;
    country: string;
    label: string;
  }>;
  birthday: {
    year: number;
    month: number;
    day: number;
  };
};
type ContactArguments = {
  id?: string;
  uuid?: string;
  name?: string;
  number?: string;
  numbers?: Array<{
    label?: string;
    number: string;
  }>;
  favorited?: boolean;
  email?: string;
  emails?: Array<{
    label?: string;
    email: string;
  }>;
  entreprise?: string;
  birthday?: string;
  address?: string;
  note?: string;
  endpointId?: number;
  personal?: boolean;
  state?: string;
  source?: string;
  sourceId?: string | null | undefined;
  lineState?: string;
  previousPresential?: string;
  lastActivity?: string;
  mobile?: boolean;
  status?: string;
  backend?: string;
  personalStatus?: string;
  sessions?: Array<{
    uuid: string;
    mobile: boolean;
  }>;
  connected?: boolean;
  doNotDisturb?: boolean;
  ringing?: boolean;
  lines?: Record<string, any>[];
};
type Office365Response = {
  assistantName: any;
  birthday: any;
  businessAddress: any;
  businessHomePage: any;
  businessPhones: Array<any>;
  categories: Array<any>;
  changeKey: string;
  children: Array<any>;
  companyName: any;
  createdDateTime: string;
  department: any;
  displayName: string;
  emailAddresses: Array<{
    name: string;
    address: string;
  }>;
  fileAs: string;
  generation: any;
  givenName: any;
  homeAddress: any;
  homePhones: string[];
  id: string;
  imAddresses: any;
  initials: any;
  jobTitle: any;
  lastModifiedDateTime: string;
  manager: any;
  middleName: any;
  mobilePhone: string;
  nickName: any;
  officeLocation: any;
  otherAddress: any;
  parentFolderId: string;
  personalNotes: string;
  profession: any;
  spouseName: any;
  surname: string;
  title: any;
  yomiCompanyName: any;
  yomiGivenName: any;
  yomiSurname: any;
};
type WazoResponse = {
  email: string;
  exten: string;
  firstname: string;
  lastname: string;
  mobile_phone_number: any;
  uuid: string;
  id: string;
  voicemail_number: any;
};
type ConferenceResponse = {
  backend: string;
  name: string;
  id: number;
  extensions: Array<{
    context: string;
    exten: string;
  }>;
  incalls: Array<{
    context: string;
    exten: string;
  }>;
};
type GoogleResponse = {
  emails: string[];
  id: string;
  name: string;
  numbers: string[];
  numbers_by_label: any;
};

const SOURCE_MOBILE = 'mobile';
export default class Contact {
  type: string;

  id: string | null | undefined;

  uuid: string | null | undefined;

  name: string | null | undefined;

  number: string | null | undefined;

  numbers: Array<{
    label?: string;
    number: string;
  }> | null | undefined;

  favorited: boolean | null | undefined;

  email: string | null | undefined;

  emails: Array<{
    label?: string;
    email: string;
  }> | null | undefined;

  entreprise: string | null | undefined;

  birthday: string | null | undefined;

  address: string | null | undefined;

  note: string | null | undefined;

  endpointId: number | null | undefined;

  personal: boolean | null | undefined;

  state: string | null | undefined;

  lineState: string | null | undefined;

  previousPresential: string | null | undefined;

  lastActivity: string | null | undefined;

  mobile: boolean | null | undefined;

  source: string | null | undefined;

  sourceId: string | null | undefined;

  status: string | null | undefined;

  backend: string | null | undefined;

  personalStatus: string;

  sessions: Array<{
    uuid: string;
    mobile: boolean;
  }> | null | undefined;

  connected: boolean | null | undefined;

  doNotDisturb: boolean | null | undefined;

  ringing: boolean | null | undefined;

  lines: Record<string, any>[];

  static merge(oldContacts: Array<Contact>, newContacts: Array<Contact>): Array<Contact> {
    return newContacts.map(current => {
      const old = oldContacts.find(contact => contact && contact.is(current));
      return old ? current.merge(old) : current;
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

  static parseMany(response: ContactsResponse, offset = 0, limit: (number | null) = null): Array<Contact> {
    if (!response || !response.results || limit === 0) {
      return [];
    }

    const results = limit !== null && limit > 0 ? response.results.slice(offset, limit) : offset > 0 ? response.results.slice(offset) : response.results;
    return results.map(r => Contact.parse(r, response.column_types));
  }

  static manyGraphQlWithNumbersParser(numbers: string[]): (...args: Array<any>) => any {
    return (response: ContactsGraphQlResponse) => {
      if (!response.data || !response.data.me || !response.data.me.contacts) {
        return [];
      }

      return response.data.me.contacts.edges.map((edge, i) => {
        if (!edge.node) {
          return null;
        }

        const {
          email,
        } = edge.node;
        const name = edge.node.firstname && edge.node.lastname ? `${edge.node.firstname || ''} ${edge.node.lastname || ''}` : edge.node.wazoReverse;
        return new Contact({
          name,
          number: numbers[i],
          numbers: [{
            label: 'primary',
            number: numbers[i],
          }],
          backend: edge.node.wazoBackend,
          source: edge.node.wazoSourceName,
          sourceId: edge.node.wazoSourceEntryId || '',
          email: email || '',
          emails: email ? [{
            label: 'primary',
            email,
          }] : [],
          uuid: edge.node.userUuid,
        });
      }).filter(contact => !!contact);
    };
  }

  static fetchNumbers(plain: ContactResponse, columns: Array<string | null | undefined>): Array<string> {
    const numberColumns = columns.map((e, index) => ({
      index,
      columnName: e,
    })).filter(e => e.columnName === 'number' || e.columnName === 'callable').map(e => e.index);
    return plain.column_values.filter((e, index) => numberColumns.some(i => i === index) && e !== null);
  }

  static parse(plain: ContactResponse, columns: Array<string | null | undefined>): Contact {
    const numbers = Contact.fetchNumbers(plain, columns);
    const email = plain.column_values[columns.indexOf('email')];
    return new Contact({
      name: plain.column_values[columns.indexOf('name')],
      number: numbers.length ? numbers[0] : '',
      numbers: numbers.map((number, i) => ({
        label: i === 0 ? 'primary' : 'secondary',
        number,
      })),
      favorited: plain.column_values[columns.indexOf('favorite')],
      email: email || '',
      emails: email ? [{
        label: 'primary',
        email,
      }] : [],
      entreprise: plain.column_values[columns.indexOf('entreprise')] || '',
      birthday: plain.column_values[columns.indexOf('birthday')] || '',
      address: plain.column_values[columns.indexOf('address')] || '',
      note: plain.column_values[columns.indexOf('note')] || '',
      endpointId: plain.relations.endpoint_id,
      personal: plain.column_values[columns.indexOf('personal')],
      source: plain.source,
      sourceId: plain.relations.source_entry_id || '',
      uuid: plain.relations.user_uuid,
      backend: plain.backend || '',
    });
  }

  static parseManyPersonal(results: Array<ContactPersonalResponse>): Array<Contact | null | undefined> {
    return results.map(r => Contact.parsePersonal(r));
  }

  static parsePersonal(plain: ContactPersonalResponse): Contact {
    return new Contact({
      name: `${plain.firstName || plain.firstname || ''} ${plain.lastName || plain.lastname || ''}`,
      number: plain.number || '',
      numbers: plain.number ? [{
        label: 'primary',
        number: plain.number,
      }] : [],
      email: plain.email || '',
      emails: plain.email ? [{
        label: 'primary',
        email: plain.email,
      }] : [],
      source: 'personal',
      sourceId: plain.id || '',
      entreprise: plain.entreprise || '',
      birthday: plain.birthday || '',
      address: plain.address || '',
      note: plain.note || '',
      favorited: plain.favorited,
      personal: true,
      backend: plain.backend || BACKEND.PERSONAL,
    });
  }

  static parseMobile(plain: ContactMobileResponse): Contact {
    let address = '';

    if (plain.postalAddresses.length) {
      const postalAddress = plain.postalAddresses[0];
      address = `${postalAddress.street} ${postalAddress.city} ${postalAddress.postCode} ${postalAddress.country}`;
    }

    const firstName = plain.givenName || '';
    const lastName = plain.familyName || '';
    const companyName = plain.company || '';
    const isCompanyAccount = !firstName && !lastName;
    const name = isCompanyAccount ? companyName : `${firstName} ${lastName}`;

    return new Contact({
      name,
      number: plain.phoneNumbers.length ? plain.phoneNumbers[0].number : '',
      // Make numbers unique
      numbers: [...new Map(plain.phoneNumbers.map(item => [item.number, item])).values()].map((item, idx) => ({
        label: idx === 0 ? 'primary' : 'secondary',
        number: item.number,
      })),
      email: plain.emailAddresses.length ? plain.emailAddresses[0].email : '',
      emails: plain.emailAddresses.length ? [{
        label: 'primary',
        email: plain.emailAddresses[0].email,
      }] : [],
      source: SOURCE_MOBILE,
      sourceId: plain.recordID || '',
      birthday: plain.birthday ? `${plain.birthday.year}-${plain.birthday.month}-${plain.birthday.day}` : '',
      address,
      note: plain.note || '',
      favorited: false,
      personal: true,
    });
  }

  static parseManyOffice365(response: Office365Response[], source: DirectorySource): Array<Contact> {
    return response.map(r => Contact.parseOffice365(r, source));
  }

  static parseOffice365(single: Office365Response, source: DirectorySource): Contact {
    const emails: Array<{
      label?: string;
      email: string;
    }> = [];
    const numbers: Array<{
      label?: string;
      number: string;
    }> = [];

    if (single.emailAddresses) {
      single.emailAddresses.map(email => emails.push({
        email: email.address,
      }));
    }

    if (single.businessPhones) {
      single.businessPhones.map(phone => numbers.push({
        label: 'business',
        number: phone,
      }));
    }

    if (single.mobilePhone) {
      numbers.push({
        label: 'mobile',
        number: single.mobilePhone,
      });
    }

    if (single.homePhones) {
      single.homePhones.map(phone => numbers.push({
        label: 'home',
        number: phone,
      }));
    }

    return new Contact({
      sourceId: single.id || '',
      name: single.displayName || '',
      number: numbers.length ? numbers[0].number : '',
      numbers,
      emails,
      source: source.name,
      backend: BACKEND.OFFICE365,
    });
  }

  static parseManyGoogle(response: GoogleResponse[], source: DirectorySource): Array<Contact> {
    return response.map(r => Contact.parseGoogle(r, source));
  }

  static parseGoogle(single: GoogleResponse, source: DirectorySource): Contact {
    const emails: Array<{
      label?: string;
      email: string;
    }> = [];
    const numbers: Array<{
      label?: string;
      number: string;
    }> = [];

    if (single.emails) {
      single.emails.forEach((email: any) => (typeof email === 'object' ? {
        email: email.address,
        label: email.label,
      } : {
        email,
      }));
    }

    if (single.numbers_by_label) {
      Object.keys(single.numbers_by_label).forEach(label => numbers.push({
        label,
        number: single.numbers_by_label[label],
      }));
    } else if (single.numbers) {
      single.numbers.forEach(phone => numbers.push({
        number: phone,
      }));
    }

    return new Contact({
      sourceId: single.id || '',
      name: single.name || '',
      number: numbers.length ? numbers[0].number : '',
      numbers,
      emails,
      source: source.name,
      backend: BACKEND.GOOGLE,
    });
  }

  static parseManyWazo(response: WazoResponse[], source: DirectorySource): Array<Contact> {
    return response.map(r => Contact.parseWazo(r, source));
  }

  static parseWazo(single: WazoResponse, source: DirectorySource): Contact {
    const emails: any[] = [];
    const numbers: any[] = [];

    if (single.email) {
      emails.push({
        label: 'email',
        email: single.email,
      });
    }

    if (single.exten) {
      numbers.push({
        label: 'exten',
        number: single.exten,
      });
    }

    if (single.mobile_phone_number) {
      numbers.push({
        label: 'mobile',
        number: single.mobile_phone_number,
      });
    }

    return new Contact({
      uuid: single.uuid,
      sourceId: String(single.id) || '',
      name: `${single.firstname}${single.lastname ? ` ${single.lastname}` : ''}`,
      number: numbers.length ? numbers[0].number : '',
      numbers,
      emails,
      source: source.name,
      backend: BACKEND.WAZO,
    });
  }

  static parseManyConference(response: ConferenceResponse[], source: DirectorySource): Array<Contact> {
    return response.map(r => Contact.parseConference(r, source));
  }

  static parseConference(single: ConferenceResponse, source: DirectorySource): Contact {
    const numbers: any[] = [];
    let firstNumber = '';

    if (single && single.extensions && single.extensions.length > 0 && single.extensions[0].exten) {
      firstNumber = single.extensions[0].exten;
      numbers.push({
        label: 'exten',
        number: firstNumber,
      });
    }

    return new Contact({
      sourceId: String(single.id),
      name: single.name,
      number: firstNumber,
      numbers,
      source: source.name,
      backend: BACKEND.CONFERENCE,
    });
  }

  static newFrom(contact: Contact) {
    return newFrom(contact, Contact);
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
    state,
    lineState,
    lastActivity,
    mobile,
    status,
    endpointId,
    personal,
    favorited,
    backend,
    personalStatus,
    sessions,
    connected,
    doNotDisturb,
    ringing,
    previousPresential,
    lines,
  }: ContactArguments = {}) {
    this.id = id;
    this.uuid = uuid;
    this.name = name || '';
    this.number = number;
    this.numbers = numbers;
    this.email = email;
    this.emails = emails;
    this.source = source;
    this.sourceId = sourceId;
    this.entreprise = entreprise;
    this.birthday = birthday;
    this.address = address;
    this.note = note;
    this.state = state;
    this.lineState = lineState;
    this.lastActivity = lastActivity;
    this.mobile = mobile;
    this.status = status;
    this.endpointId = endpointId;
    this.personal = personal;
    this.favorited = favorited;
    this.backend = backend;
    this.personalStatus = personalStatus || '';
    this.sessions = sessions || [];
    this.connected = connected;
    this.doNotDisturb = doNotDisturb;
    this.ringing = ringing;
    this.previousPresential = previousPresential;
    this.lines = lines || [];
    // Useful to compare instead of instanceof with minified code
    this.type = 'Contact';
  }

  setFavorite(value: boolean) {
    this.favorited = value;
    return this;
  }

  is(other: Contact): boolean {
    const sameSourceId = this.sourceId !== null && other.sourceId !== null && this.sourceId === other.sourceId;
    const sameUuid = !!this.uuid && !!other.uuid && this.uuid === other.uuid;
    const hasSameId = sameSourceId || sameUuid;
    const hasSameBackend = !!this.backend && !!other.backend && this.backend === other.backend;
    const hasSameSource = !!this.source && !!other.source && this.source === other.source;
    return !!other && hasSameId && hasSameBackend && hasSameSource;
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
    return this.state === STATE.AVAILABLE;
  }

  isAway(): boolean {
    return this.state === STATE.AWAY;
  }

  isUnavailable(): boolean {
    return this.state === STATE.UNAVAILABLE;
  }

  isInvisible(): boolean {
    return this.state === STATE.INVISIBLE;
  }

  isInCall(): boolean {
    return this.lineState === LINE_STATE.TALKING || this.lineState === LINE_STATE.HOLDING;
  }

  isRinging(): boolean | null | undefined {
    return this.ringing;
  }

  isInUseOrRinging(): boolean {
    return this.lineState === LINE_STATE.TALKING || this.lineState === LINE_STATE.RINGING;
  }

  isProgressing(): boolean {
    return this.lineState === LINE_STATE.PROGRESSING;
  }

  merge(old: Contact): Contact {
    Object.keys(old).filter(key => key !== 'lineState').forEach(key => {
      // @ts-ignore
      this[key] = old[key] || this[key];
    });

    if (old.lineState) {
      this.lineState = old.lineState;
    }

    return this;
  }

  isIntern(): boolean {
    return !!this.uuid;
  }

  hasSourceId(): boolean {
    return !!this.sourceId;
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

  separateName(): {
    firstName: string;
    lastName: string;
  } {
    if (!this.name) {
      return {
        firstName: '',
        lastName: '',
      };
    }

    const names = this.name.split(/\s+/);
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');
    return {
      firstName,
      lastName,
    };
  }

}
