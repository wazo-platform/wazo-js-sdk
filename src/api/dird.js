/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, Token, Contact } from '../types';

const getContactPayload = (contact: Contact) => ({
  email: contact.email,
  firstname: contact.firstName,
  lastname: contact.lastName,
  number: contact.phoneNumber,
  entreprise: contact.entreprise,
  birthday: contact.birthday,
  address: contact.address,
  note: contact.note
});

export default (client: ApiRequester, baseUrl: string) => ({
  search(token: Token, context: string, term: string) {
    return client.get(`${baseUrl}/directories/lookup/${context}`, { term }, token);
  },

  listPersonalContacts(token: Token) {
    return client.get(`${baseUrl}/personal`, null, token);
  },

  addContact(token: Token, contact: Contact) {
    return client.post(`${baseUrl}/personal`, getContactPayload(contact), token);
  },

  editContact(token: Token, contact: Contact): Promise<Object> {
    return client.put(`${baseUrl}/personal/${contact.id}`, getContactPayload(contact), token);
  },

  deleteContact(token: Token, contactUuid: UUID) {
    return client.delete(`${baseUrl}/personal/${contactUuid}`, null, token);
  },

  listFavorites(token: Token, context: string): Promise<Array<Contact>> {
    return client.get(`${baseUrl}/directories/favorites/${context}`, null, token);
  },

  markAsFavorite(token: Token, source: string, sourceId: string) {
    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;
    return client.put(url, 'put', null, token, ApiRequester.successResponseParser);
  },

  removeFavorite(token: Token, source: string, sourceId: string) {
    return client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`, null, token);
  }
});
