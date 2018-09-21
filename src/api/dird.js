/* @flow */
import { callApi, getHeaders, successResponseParser } from '../utils';
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

export default (baseUrl: string) => ({
  search(token: Token, context: string, term: string) {
    return callApi(`${baseUrl}/directories/lookup/${context}`, 'get', { term }, getHeaders(token));
  },

  listPersonalContacts(token: Token) {
    return callApi(`${baseUrl}/personal`, 'get', null, getHeaders(token));
  },

  addContact(token: Token, contact: Contact) {
    return callApi(`${baseUrl}/personal`, 'post', getContactPayload(contact), getHeaders(token));
  },

  editContact(token: Token, contact: Contact): Promise<Object> {
    return callApi(`${baseUrl}/personal/${contact.id}`, 'put', getContactPayload(contact), getHeaders(token));
  },

  deleteContact(token: Token, contactUuid: UUID) {
    return callApi(`${baseUrl}/personal/${contactUuid}`, 'delete', null, getHeaders(token));
  },

  listFavorites(token: Token, context: string): Promise<Array<Contact>> {
    return callApi(`${baseUrl}/directories/favorites/${context}`, 'get', null, getHeaders(token));
  },

  markAsFavorite(token: Token, source: string, sourceId: string) {
    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;
    return callApi(url, 'put', null, getHeaders(token), successResponseParser);
  },

  removeFavorite(token: Token, source: string, sourceId: string) {
    return callApi(`${baseUrl}/directories/favorites/${source}/${sourceId}`, 'delete', null, getHeaders(token));
  }
});
