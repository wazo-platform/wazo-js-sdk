import ApiRequester from '../utils/api-requester';
import type { User, Tenant, Token, UUID, LogoutResponse, ListTenantsResponse, ListUsersResponse, ListGroupsResponse, ListPoliciesResponse, GetTenantResponse, GetUserResponse, DeviceToken } from '../domain/types';
import Session from '../domain/Session';
export declare const DEFAULT_BACKEND_USER = "wazo_user";
export declare const BACKEND_LDAP_USER = "ldap_user";
export declare const DETAULT_EXPIRATION = 3600;
type LoginParams = {
    username: string;
    password: string;
    backend?: string;
    expiration: number;
    mobile?: boolean;
    tenantId?: string;
    domainName?: string;
    headers?: Record<string, string>;
};
type SendResetPasswordArgs = {
    username?: string;
    email?: string;
};
declare const _default: (client: ApiRequester, baseUrl: string) => {
    checkToken: (token: Token) => Promise<boolean>;
    authenticate: (token: Token) => Promise<Session | null | undefined>;
    logIn(params: LoginParams): Promise<Session | null | undefined>;
    logOut: (token: Token) => Promise<LogoutResponse>;
    samlLogIn: (samlSessionId: string) => Promise<Session | null | undefined>;
    samlLogOut(): Promise<void | {
        location: string;
    }>;
    initiateIdpAuthentication: (domain: string, redirectUrl: string) => Promise<any>;
    refreshToken: (refreshToken: string, backend: string, expiration: number, isMobile?: boolean, tenantId?: string, domainName?: string) => Promise<Session | null | undefined>;
    deleteRefreshToken: (clientId: string) => Promise<boolean>;
    updatePassword: (userUuid: UUID, oldPassword: string, newPassword: string) => Promise<boolean>;
    getDeviceToken: (userUuid: UUID) => Promise<DeviceToken>;
    sendDeviceToken: (userUuid: UUID, deviceToken: string, apnsVoipToken: string | null | undefined, apnsNotificationToken: string | null | undefined) => Promise<void>;
    getPushNotificationSenderId: (userUuid: UUID) => Promise<string>;
    /**
     * `username` or `email` should be set.
     */
    sendResetPasswordEmail: ({ username, email }: SendResetPasswordArgs) => Promise<boolean>;
    resetPassword: (userUuid: string, password: string) => Promise<boolean>;
    removeDeviceToken: (userUuid: UUID) => Promise<void>;
    createUser: (username: string, password: string, firstname: string, lastname: string) => Promise<User>;
    addUserEmail: (userUuid: UUID, email: string, main?: boolean) => Promise<void>;
    addUserPolicy: (userUuid: UUID, policyUuid: UUID) => Promise<void>;
    getRestrictionPolicies: (scopes: string[]) => Promise<any>;
    deleteUserPolicy: (userUuid: UUID, policyUuid: UUID) => Promise<any>;
    addUserGroup: (userUuid: UUID, groupUuid: UUID) => Promise<any>;
    listUsersGroup: (groupUuid: UUID) => Promise<any>;
    deleteUserGroup: (userUuid: UUID, groupUuid: UUID) => Promise<void>;
    getUser: (userUuid: UUID) => Promise<GetUserResponse>;
    getUserSession: (userUuid: UUID) => Promise<any>;
    deleteUserSession: (userUuid: UUID, sessionUuids: UUID) => Promise<void>;
    listUsers: () => Promise<ListUsersResponse>;
    deleteUser: (userUuid: UUID) => Promise<boolean>;
    listTenants: () => Promise<ListTenantsResponse>;
    getTenant: (tenantUuid: UUID) => Promise<GetTenantResponse>;
    createTenant: (name: string) => Promise<Tenant>;
    updateTenant: (uuid: UUID, name: string, contact: string, phone: string, address: Array<Record<string, any>>) => Promise<Tenant>;
    deleteTenant: (uuid: UUID) => Promise<boolean>;
    createGroup: (name: string) => Promise<void>;
    listGroups: () => Promise<ListGroupsResponse>;
    deleteGroup: (uuid: UUID) => Promise<boolean>;
    createPolicy: (name: string, description: string, aclTemplates: Array<Record<string, any>>) => Promise<void>;
    listPolicies: () => Promise<ListPoliciesResponse>;
    deletePolicy: (policyUuid: UUID) => Promise<boolean>;
    getProviders: (userUuid: UUID) => Promise<any>;
    getProviderToken: (userUuid: UUID, provider: string) => Promise<string>;
    getProviderAuthUrl: (userUuid: UUID, provider: string) => Promise<string>;
    deleteProviderToken: (userUuid: UUID, provider: string) => Promise<void>;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map