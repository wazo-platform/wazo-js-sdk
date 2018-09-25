/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, Token } from '../domain/types';
import Contact from '../domain/Contact';
import BadResponse from '../domain/BadResponse';
import type { NewContact } from '../domain/Contact';

const getContactPayload = (contact: NewContact | Contact) => ({
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
  search(token: Token, context: string, term: string): Promise<Array<Contact> | BadResponse> {
    return client.get(`${baseUrl}/directories/lookup/${context}`, { term }, token)
      .then(ApiRequester.parseBadResponse(response => Contact.parseMany(response)));
  },

  listPersonalContacts(token: Token): Promise<Array<Contact> | BadResponse> {
    return client.get(`${baseUrl}/personal`, null, token)
      .then(ApiRequester.parseBadResponse(response => Contact.parseManyPersonal(response)));
  },

  addContact(token: Token, contact: NewContact): Promise<Contact | BadResponse> {
    return client.post(`${baseUrl}/personal`, getContactPayload(contact), token)
      .then(ApiRequester.parseBadResponse(response => Contact.parsePersonal(response)));
  },

  editContact(token: Token, contact: Contact): Promise<Contact | BadResponse> {
    return client.put(`${baseUrl}/personal/${contact.id}`, getContactPayload(contact), token);
  },

  deleteContact(token: Token, contactUuid: UUID) {
    return client.delete(`${baseUrl}/personal/${contactUuid}`, null, token);
  },

  listFavorites(token: Token, context: string): Promise<Array<Contact> | BadResponse> {
    return client.get(`${baseUrl}/directories/favorites/${context}`, null, token)
      .then(ApiRequester.parseBadResponse(response => Contact.parseMany(response)));
  },

  markAsFavorite(token: Token, source: string, sourceId: string): Promise<Boolean> {
    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;

    return client.put(url, 'put', null, token, ApiRequester.successResponseParser);
  },

  removeFavorite(token: Token, source: string, sourceId: string) {
    return client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`, null, token);
  }
});
