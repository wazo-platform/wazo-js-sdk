import { jsonToGraphQLQuery } from 'json-to-graphql-query/lib/jsonToGraphQLQuery';
import ApiRequester from '../utils/api-requester';
import type { PhonebookResponseItem, UUID } from '../domain/types';
import { Contact, ContactsResponse } from '../index';
import type { NewContact, DirectorySource, DirectorySources } from '../index';

type PhoneBookSearchQueryParams = {
  order?: string;
  direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

const getContactPayload = (contact: NewContact | Contact) => ({
  email: contact.email,
  firstname: (contact as any).firstName ? (contact as any).firstName : '',
  lastname: (contact as any).lastName ? (contact as any).lastName : '',
  number: (contact as any).phoneNumber ? (contact as any).phoneNumber : '',
  entreprise: contact.entreprise ? contact.entreprise : '',
  birthday: contact.birthday ? contact.birthday : '',
  address: contact.address ? contact.address : '',
  note: contact.note ? contact.note : '',
});

export interface DirD {
  search: (context: string, term: string) => Promise<Array<Contact>>;
  listPersonalContacts: (queryParams?: ContactSearchQueryParams) => Promise<Array<Contact>>;
  fetchPersonalContact: (contactUuid: string) => Promise<Contact>;
  addContact: (contact: NewContact) => Promise<Contact>;
  editContact: (contact: Contact) => Promise<Contact>;
  importContacts: (csv: string) => Promise<Contact[]>;
  deleteContact: (contactUuid: UUID) => Promise<void>,
  listFavorites: (context: string) => Promise<Array<Contact>>;
  markAsFavorite: (source: string, sourceId: string) => Promise<boolean>;
  removeFavorite: (source: string, sourceId: string) => Promise<void>;
  fetchOffice365Source: (context: string) => Promise<DirectorySources>;
  fetchOffice365Contacts: (source: DirectorySource, queryParams: ContactSearchQueryParams) => Promise<Contact[]> ;
  fetchWazoSource: (context: string) => Promise<DirectorySources>;
  fetchSourcesFor: (context: string, backend: string) => Promise<DirectorySources>;
  fetchWazoContacts: (source: DirectorySource, queryParams: ContactSearchQueryParams) => Promise<Contact[]>;
  fetchGoogleSource: (context: string) => Promise<DirectorySources>;
  fetchGoogleContacts: (source: DirectorySource, queryParams: ContactSearchQueryParams) => Promise<Contact[]>;
  fetchConferenceSource: (context: string) => Promise<DirectorySources>;
  fetchConferenceContacts: (source: DirectorySource) => Promise<Contact[]>;
  fetchPhonebookContacts: (source: DirectorySource, params?: PhoneBookSearchQueryParams) => Promise<{ items: PhonebookResponseItem[], total: number }>;
  findMultipleContactsByNumber: (numbers: string[], fields?: Record<string, any>) => Promise<Contact[]>;
}

type ContactSearchQueryParams = {
  order?: string;
  direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  search?: string;
  uuid?: string;
} | null;
export default ((client: ApiRequester, baseUrl: string): DirD => ({
  search: (context: string, term: string, offset = 0, limit: (number | null) = null): Promise<Array<Contact>> => client.get(`${baseUrl}/directories/lookup/${context}`, {
    term,
  }).then((response: ContactsResponse) => Contact.parseMany(response, offset, limit)),
  listPersonalContacts: (queryParams: ContactSearchQueryParams = null): Promise<Array<Contact>> => client.get(`${baseUrl}/personal`, queryParams).then((response: any) => Contact.parseManyPersonal(response.items)),
  fetchPersonalContact: (contactUuid: string): Promise<Contact> => client.get(`${baseUrl}/personal/${contactUuid}`).then(Contact.parsePersonal),
  addContact: (contact: NewContact): Promise<Contact> => client.post(`${baseUrl}/personal`, getContactPayload(contact)).then(Contact.parsePersonal),
  editContact: (contact: Contact): Promise<Contact> => client.put(`${baseUrl}/personal/${contact.sourceId || contact.id || ''}`, getContactPayload(contact)).then(Contact.parsePersonal),
  importContacts: (csv: string): Promise<Contact[]> => {
    const headers = {
      'Content-Type': 'text/csv; charset=utf-8',
      'X-Auth-Token': client.token,
    };
    return client.post(`${baseUrl}/personal/import`, csv, headers).then((result: any) => Contact.parseManyPersonal(result.created));
  },
  deleteContact: (contactUuid: UUID) => client.delete(`${baseUrl}/personal/${contactUuid}`),
  listFavorites: (context: string): Promise<Array<Contact>> => client.get(`${baseUrl}/directories/favorites/${context}`).then(Contact.parseMany),
  markAsFavorite: (source: string, sourceId: string): Promise<boolean> => {
    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;
    return client.put(url, null, null, ApiRequester.successResponseParser);
  },
  removeFavorite: (source: string, sourceId: string) => client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`),
  fetchOffice365Source: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'office365',
  }),
  fetchOffice365Contacts: (source: DirectorySource, queryParams: ContactSearchQueryParams = null): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/office365/sources/${source.uuid}/contacts`, queryParams).then((response: any) => Contact.parseManyOffice365(response.items, source));
  },
  fetchWazoSource: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'wazo',
  }),
  // Can be used with `queryParams = { uuid: uuid1, uuid2 }` to fetch multiple contacts
  fetchWazoContacts: (source: DirectorySource, queryParams: ContactSearchQueryParams = null): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/wazo/sources/${source.uuid}/contacts`, queryParams).then((response: any) => Contact.parseManyWazo(response.items, source));
  },
  fetchGoogleSource: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'google',
  }),
  fetchGoogleContacts: (source: DirectorySource, queryParams: ContactSearchQueryParams = null): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/google/sources/${source.uuid}/contacts`, queryParams).then((response: any) => Contact.parseManyGoogle(response.items, source));
  },
  fetchConferenceSource: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'conference',
  }),
  fetchSourcesFor: (context: string, backend: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, { backend }),
  fetchPhonebookContacts: (source: DirectorySource, params?: PhoneBookSearchQueryParams): Promise<{ items: PhonebookResponseItem[], total: number }> => {
    if (!source) {
      return Promise.resolve({ items: [], total: 0 });
    }

    return client.get(`${baseUrl}/backends/phonebook/sources/${source.uuid}/contacts`, params);
  },
  fetchConferenceContacts: (source: DirectorySource): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/conference/sources/${source.uuid}/contacts`).then((response: any) => Contact.parseManyConference(response.items, source));
  },
  // Graphql
  findMultipleContactsByNumber: (numbers: string[], fields?: Record<string, any>): Promise<Contact[]> => {
    const query = jsonToGraphQLQuery({
      me: {
        contacts: {
          __args: {
            profile: 'default',
            extens: numbers,
          },
          edges: {
            node: fields || {
              firstname: true,
              lastname: true,
              wazoReverse: true,
              wazoBackend: true,
              email: true,
              wazoSourceEntryId: true,
              wazoSourceName: true,
              '... on WazoContact': {
                userUuid: true,
              },
            },
          },
        },
      },
    });
    return client.post(`${baseUrl}/graphql`, {
      query: `{${query}}`,
    }).then(Contact.manyGraphQlWithNumbersParser(numbers));
  },
}));
