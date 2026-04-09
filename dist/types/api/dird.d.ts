import type { PhonebookResponseItem, QueryParams, SearchableQueryParams, UUID, UuidSearchableQueryParams } from '../domain/types';
import type { DirectorySource, DirectorySources, NewContact } from '../index';
import { Contact } from '../index';
import ApiRequester from '../utils/api-requester';
declare const _default: (client: ApiRequester, baseUrl: string) => {
    search: (context: string, term: string, offset?: number, limit?: (number | null)) => Promise<Array<Contact>>;
    listPersonalContacts: (queryParams?: QueryParams) => Promise<Contact[]>;
    fetchPersonalContact: (contactUuid: string) => Promise<Contact>;
    addContact: (contact: NewContact) => Promise<Contact>;
    editContact: (contact: Contact) => Promise<Contact>;
    importContacts: (csv: string) => Promise<Contact[]>;
    deleteContact: (contactUuid: UUID) => Promise<void>;
    listFavorites: (context: string) => Promise<Array<Contact>>;
    markAsFavorite: (source: string, sourceId: string) => Promise<boolean>;
    removeFavorite: (source: string, sourceId: string) => Promise<void>;
    fetchOffice365Source: (context: string) => Promise<DirectorySources>;
    fetchOffice365Contacts: (source: DirectorySource, queryParams?: SearchableQueryParams) => Promise<Contact[]>;
    fetchWazoSource: (context: string) => Promise<DirectorySources>;
    fetchWazoContacts: <T = Contact[]>(source: DirectorySource, queryParams?: UuidSearchableQueryParams, options?: {
        parser?: (response: {
            items: any[];
            total: number;
        }, source: DirectorySource) => T;
    }) => Promise<T>;
    fetchGoogleSource: (context: string) => Promise<DirectorySources>;
    fetchGoogleContacts: (source: DirectorySource, queryParams?: SearchableQueryParams) => Promise<Contact[]>;
    fetchConferenceSource: (context: string) => Promise<DirectorySources>;
    fetchSourcesFor: (context: string, backend: string) => Promise<DirectorySources>;
    fetchPhonebookContacts: (source: DirectorySource, queryParams?: QueryParams) => Promise<{
        items: PhonebookResponseItem[];
        total: number;
    }>;
    fetchConferenceContacts: (source: DirectorySource, queryParams?: SearchableQueryParams) => Promise<Contact[]>;
    findMultipleContactsByNumber: (numbers: string[], fields?: Record<string, any>) => Promise<Contact[]>;
};
export default _default;
//# sourceMappingURL=dird.d.ts.map