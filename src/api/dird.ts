import { jsonToGraphQLQuery } from 'json-to-graphql-query/lib/jsonToGraphQLQuery';
import ApiRequester from '../utils/api-requester';
import type { UuidSearchableQueryParams, SearchableQueryParams, PhonebookResponseItem, QueryParams, UUID } from '../domain/types';
import { Contact, ContactsResponse } from '../index';
import type { NewContact, DirectorySource, DirectorySources } from '../index';

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

export default ((client: ApiRequester, baseUrl: string) => ({
  search: (context: string, term: string, offset = 0, limit: (number | null) = null): Promise<Array<Contact>> => client.get(`${baseUrl}/directories/lookup/${context}`, {
    term,
  }).then((response: ContactsResponse) => Contact.parseMany(response, offset, limit)),

  listPersonalContacts: (queryParams?: QueryParams): Promise<Contact[]> => client.get(`${baseUrl}/personal`, queryParams).then((response: any) => Contact.parseManyPersonal(response.items)),

  fetchPersonalContact: (contactUuid: string): Promise<Contact> => client.get(`${baseUrl}/personal/${contactUuid}`).then(Contact.parsePersonal),

  addContact: (contact: NewContact): Promise<Contact> => client.post(`${baseUrl}/personal`, getContactPayload(contact)).then(Contact.parsePersonal),

  editContact: (contact: Contact): Promise<Contact> => client.put(`${baseUrl}/personal/${contact.sourceId || contact.id || ''}`, getContactPayload(contact)).then(Contact.parsePersonal),

  importContacts: async (csv: string): Promise<Contact[]> => {
    const headers = {
      'Content-Type': 'text/csv; charset=utf-8',
      'X-Auth-Token': client.token,
    };
    return client.post(`${baseUrl}/personal/import`, csv, headers).then((result: any) => Contact.parseManyPersonal(result.created));
  },

  deleteContact: (contactUuid: UUID): Promise<void> => client.delete(`${baseUrl}/personal/${contactUuid}`),

  listFavorites: (context: string): Promise<Array<Contact>> => client.get(`${baseUrl}/directories/favorites/${context}`).then(Contact.parseMany),

  markAsFavorite: (source: string, sourceId: string): Promise<boolean> => {
    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;
    return client.put(url, null, null, ApiRequester.successResponseParser);
  },

  removeFavorite: (source: string, sourceId: string): Promise<void> => client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`),

  fetchOffice365Source: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'office365',
  }),

  fetchOffice365Contacts: async (source: DirectorySource, queryParams?: SearchableQueryParams): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/office365/sources/${source.uuid}/contacts`, queryParams).then((response: any) => Contact.parseManyOffice365(response.items, source));
  },

  fetchWazoSource: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'wazo',
  }),

  // Can be used with `queryParams = { uuid: uuid1, uuid2 }` to fetch multiple contacts
  fetchWazoContacts: async (source: DirectorySource, queryParams?: UuidSearchableQueryParams): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/wazo/sources/${source.uuid}/contacts`, queryParams).then((response: any) => Contact.parseManyWazo(response.items, source));
  },

  fetchGoogleSource: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'google',
  }),

  fetchGoogleContacts: async (source: DirectorySource, queryParams?: SearchableQueryParams): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/google/sources/${source.uuid}/contacts`, queryParams).then((response: any) => Contact.parseManyGoogle(response.items, source));
  },

  fetchConferenceSource: (context: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, {
    backend: 'conference',
  }),

  fetchSourcesFor: (context: string, backend: string): Promise<DirectorySources> => client.get(`${baseUrl}/directories/${context}/sources`, { backend }),

  fetchPhonebookContacts: async (source: DirectorySource, queryParams?: QueryParams): Promise<{ items: PhonebookResponseItem[], total: number }> => {
    if (!source) {
      return Promise.resolve({ items: [], total: 0 });
    }

    return client.get(`${baseUrl}/backends/phonebook/sources/${source.uuid}/contacts`, queryParams);
  },

  fetchConferenceContacts: async (source: DirectorySource, queryParams?: SearchableQueryParams): Promise<Contact[]> => {
    if (!source) {
      return Promise.resolve([]);
    }

    return client.get(`${baseUrl}/backends/conference/sources/${source.uuid}/contacts`, queryParams).then((response: any) => Contact.parseManyConference(response.items, source));
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
