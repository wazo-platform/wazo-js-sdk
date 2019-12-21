/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID } from '../domain/types';
import Contact from '../domain/Contact';
import type { NewContact } from '../domain/Contact';
import type { DirectorySource, DirectorySources } from '../domain/DirectorySource';
import type { Sources } from '../index';

const getContactPayload = (contact: NewContact | Contact) => ({
  email: contact.email,
  firstname: contact.firstName ? contact.firstName : '',
  lastname: contact.lastName ? contact.lastName : '',
  number: contact.phoneNumber ? contact.phoneNumber : '',
  entreprise: contact.entreprise ? contact.entreprise : '',
  birthday: contact.birthday ? contact.birthday : '',
  address: contact.address ? contact.address : '',
  note: contact.note ? contact.note : '',
});

type ContactSearchQueryParams = {
  order?: string,
  direction?: 'asc' | 'desc',
  limit?: number,
  offset?: number,
  search?: string,
  uuid?: string,
} | null;

export default (client: ApiRequester, baseUrl: string) => ({
  search: (context: string, term: string): Promise<Array<Contact>> =>
    client.get(`${baseUrl}/directories/lookup/${context}`, { term }).then(Contact.parseMany),

  listPersonalContacts: (queryParams: ContactSearchQueryParams = null): Promise<Array<Contact>> =>
    client.get(`${baseUrl}/personal`, queryParams).then(response => Contact.parseManyPersonal(response.items)),

  addContact: (contact: NewContact): Promise<Contact> =>
    client.post(`${baseUrl}/personal`, getContactPayload(contact)).then(Contact.parsePersonal),

  editContact: (contact: Contact): Promise<Contact> =>
    client
      .put(`${baseUrl}/personal/${contact.sourceId || contact.id || ''}`, getContactPayload(contact))
      .then(Contact.parsePersonal),

  deleteContact: (contactUuid: UUID) => client.delete(`${baseUrl}/personal/${contactUuid}`),

  listFavorites: (context: string): Promise<Array<Contact>> =>
    client.get(`${baseUrl}/directories/favorites/${context}`).then(Contact.parseMany),

  markAsFavorite: (source: string, sourceId: string): Promise<Boolean> => {
    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;

    return client.put(url, null, null, ApiRequester.successResponseParser);
  },

  removeFavorite: (source: string, sourceId: string) =>
    client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`),

  fetchOffice365Source: (context: string): Promise<DirectorySources> =>
    client.get(`${baseUrl}/directories/${context}/sources`, { backend: 'office365' }),

  fetchOffice365Contacts: (source: DirectorySource, queryParams: ContactSearchQueryParams = null): Promise<Contact[]> =>
    client
      .get(`${baseUrl}/backends/office365/sources/${source.uuid}/contacts`, queryParams)
      .then(response => Contact.parseManyOffice365(response.items, source)),

  fetchWazoSource: (context: string): Promise<Sources> =>
    client.get(`${baseUrl}/directories/${context}/sources`, { backend: 'wazo' }),

  // Can be used with `queryParams = { uuid: uuid1, uuid2 }` to fetch multiple contacts
  fetchWazoContacts: (source: DirectorySource, queryParams: ContactSearchQueryParams = null): Promise<Contact[]> =>
    client
      .get(`${baseUrl}/backends/wazo/sources/${source.uuid}/contacts`, queryParams)
      .then(response => Contact.parseManyWazo(response.items, source)),

  fetchGoogleSource: (context: string): Promise<Sources> =>
    client.get(`${baseUrl}/directories/${context}/sources`, { backend: 'google' }),

  fetchGoogleContacts: (source: DirectorySource, queryParams: ContactSearchQueryParams = null): Promise<Contact[]> =>
    client
      .get(`${baseUrl}/backends/google/sources/${source.uuid}/contacts`, queryParams)
      .then(response => Contact.parseManyGoogle(response.items, source)),

  fetchConferenceSource: (context: string): Promise<Sources> =>
    client.get(`${baseUrl}/directories/${context}/sources`, { backend: 'conference' }),

  fetchConferenceContacts: (source: DirectorySource): Promise<Contact[]> =>
    client
      .get(`${baseUrl}/backends/conference/sources/${source.uuid}/contacts`)
      .then(response => Contact.parseManyConference(response.items, source)),
});
