/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, Token } from '../domain/types';
import Contact from '../domain/Contact';
import type { NewContact } from '../domain/Contact';

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

export default (client: ApiRequester, baseUrl: string) => ({
  search(token: Token, context: string, term: string): Promise<Array<Contact>> {
    return client
      .get(`${baseUrl}/directories/lookup/${context}`, { term }, token)
      .then(response => Contact.parseMany(response));
  },

  listPersonalContacts(token: Token): Promise<Array<Contact>> {
    return client.get(`${baseUrl}/personal`, null, token).then(response => Contact.parseManyPersonal(response.items));
  },

  addContact(token: Token, contact: NewContact): Promise<Contact> {
    return client
      .post(`${baseUrl}/personal`, getContactPayload(contact), token)
      .then(response => Contact.parsePersonal(response));
  },

  editContact(token: Token, contact: Contact): Promise<Contact> {
    return client.put(`${baseUrl}/personal/${contact.sourceId || ''}`, getContactPayload(contact), token);
  },

  deleteContact(token: Token, contactUuid: UUID) {
    return client.delete(`${baseUrl}/personal/${contactUuid}`, null, token);
  },

  listFavorites(token: Token, context: string): Promise<Array<Contact>> {
    return client
      .get(`${baseUrl}/directories/favorites/${context}`, null, token)
      .then(response => Contact.parseMany(response));
  },

  markAsFavorite(token: Token, source: string, sourceId: string): Promise<Boolean> {
    const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;

    return client.put(url, null, token, ApiRequester.successResponseParser);
  },

  removeFavorite(token: Token, source: string, sourceId: string) {
    return client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`, null, token);
  }
});
