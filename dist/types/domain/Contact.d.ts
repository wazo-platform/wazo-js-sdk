import Session from './Session';
import type { DirectorySource } from './DirectorySource';
export declare const BACKEND: {
    OFFICE365: string;
    PERSONAL: string;
    GOOGLE: string;
    WAZO: string;
    CONFERENCE: string;
    PHONEBOOK: string;
};
export interface NewContact {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    entreprise?: string;
    birthday?: string;
    note?: string;
    sessions: Array<{
        uuid: string;
        mobile: boolean;
    }> | null | undefined;
    connected?: boolean;
}
export type ContactResponse = {
    source: string;
    backend: string;
    column_values: Array<any>;
    relations: {
        user_id: number;
        xivo_id: string;
        agent_id?: number | null;
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
    firstName?: string;
    lastName?: string;
    number?: string;
    numbers: Array<{
        label?: string;
        number: string;
    }> | null | undefined;
    email?: string;
    entreprise?: string;
    birthday?: string;
    address?: string;
    note?: string;
    firstname?: string;
    lastname?: string;
    backend?: string;
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
    firstName?: string;
    lastName?: string;
    external?: boolean;
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
    sourceId?: string;
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
    firstname: string;
    lastname: string;
    numbers: string[];
    numbers_by_label: any;
};
export default class Contact {
    static BACKEND: {
        OFFICE365: string;
        PERSONAL: string;
        GOOGLE: string;
        WAZO: string;
        CONFERENCE: string;
        PHONEBOOK: string;
    };
    type: string;
    id?: string;
    uuid?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    external?: boolean;
    number?: string;
    numbers: Array<{
        label?: string;
        number: string;
    }> | null | undefined;
    favorited?: boolean;
    email?: string;
    emails: Array<{
        label?: string;
        email: string;
    }> | null | undefined;
    entreprise?: string;
    birthday?: string;
    address?: string;
    note?: string;
    endpointId?: number;
    personal?: boolean;
    state?: string;
    lineState?: string;
    previousPresential?: string;
    lastActivity?: string;
    mobile?: boolean;
    source?: string;
    sourceId?: string;
    status?: string;
    backend?: string;
    personalStatus: string;
    sessions: Array<{
        uuid: string;
        mobile: boolean;
    }> | null | undefined;
    connected?: boolean;
    doNotDisturb?: boolean;
    ringing?: boolean;
    lines: Record<string, any>[];
    static merge(oldContacts: Array<Contact>, newContacts: Array<Contact>): Array<Contact>;
    static sortContacts(a: Contact, b: Contact): number;
    static parseMany(response: ContactsResponse, offset?: number, limit?: (number | null)): Array<Contact>;
    static manyGraphQlWithNumbersParser(numbers: string[]): (...args: Array<any>) => any;
    static fetchNumbers(plain: ContactResponse, columns: Array<string | null | undefined>): Array<string>;
    static parse(plain: ContactResponse, columns: Array<string | null | undefined>): Contact;
    static parseManyPersonal(results: Array<ContactPersonalResponse>): Contact[];
    static parsePersonal(plain: ContactPersonalResponse): Contact;
    static parseMobile(plain: ContactMobileResponse): Contact;
    static parseManyOffice365(response: Office365Response[], source: DirectorySource): Array<Contact>;
    static parseOffice365(single: Office365Response, source: DirectorySource): Contact;
    static parseManyGoogle(response: GoogleResponse[], source: DirectorySource): Array<Contact>;
    static parseGoogle(single: GoogleResponse, source: DirectorySource): Contact;
    static parseManyWazo(response: WazoResponse[], source: DirectorySource): Array<Contact>;
    static parseWazo(single: WazoResponse, source: DirectorySource): Contact;
    static parseManyConference(response: ConferenceResponse[], source: DirectorySource): Array<Contact>;
    static parseConference(single: ConferenceResponse, source: DirectorySource): Contact;
    static newFrom(contact: Contact): any;
    constructor({ id, uuid, name, firstName, lastName, external, number, numbers, email, emails, source, sourceId, entreprise, birthday, address, note, state, lineState, lastActivity, mobile, status, endpointId, personal, favorited, backend, personalStatus, sessions, connected, doNotDisturb, ringing, previousPresential, lines, }?: ContactArguments);
    setFavorite(value: boolean): this;
    is(other: Contact): boolean;
    hasId(id: string): boolean;
    hasNumber(number: string): boolean;
    hasEndpointId(endpointId: number): boolean;
    isAvailable(): boolean;
    isAway(): boolean;
    isUnavailable(): boolean;
    isInvisible(): boolean;
    isInCall(): boolean;
    isRinging(): boolean | null | undefined;
    isInUseOrRinging(): boolean;
    isProgressing(): boolean;
    merge(old: Contact): Contact;
    isIntern(): boolean;
    hasSourceId(): boolean;
    isCallable(session: Session): boolean;
    isFromMobile(): boolean;
    isFavorite(): boolean | undefined;
    separateName(): {
        firstName: string;
        lastName: string;
    };
}
export {};
//# sourceMappingURL=Contact.d.ts.map