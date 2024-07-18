import ApiRequester from '../utils/api-requester';
import type { User, Tenant, Token, UUID, LogoutResponse, ListTenantsResponse, ListUsersResponse, ListGroupsResponse, ListPoliciesResponse, GetTenantResponse, GetUserResponse } from '../domain/types';
import Session, { Response } from '../domain/Session';

export const DEFAULT_BACKEND_USER = 'wazo_user';
export const BACKEND_LDAP_USER = 'ldap_user';
export const DETAULT_EXPIRATION = 3600;

type LoginParams = {
  username: string;
  password: string;
  backend?: string;
  expiration: number;
  mobile?: boolean;
  tenantId?: string;
  domainName?: string;
};

type SamlLoginBody = {
  saml_session_id: string,
  access_type?: 'online' | 'offline';
  client_id?: string;
};

type SendResetPasswordArgs = {
  username?: string,
  email?: string,
};

export interface AuthD {
  checkToken: (token: Token) => Promise<boolean>;
  authenticate: (token: Token) => Promise<Session | null | undefined>;
  logIn(params: LoginParams): Promise<Session | null | undefined> ;
  logOut: (token: Token) => Promise<LogoutResponse>;
  samlLogIn: (samlSessionId: string, options? : { mobile?: boolean }) => Promise<Session | null | undefined>;
  initiateIdpAuthentication(domain: string, redirectUrl: string): Promise<any>;
  refreshToken: (refreshToken: string, backend: string, expiration: number, isMobile?: boolean, tenantId?: string, domainName?: string) => Promise<Session | null | undefined>;
  deleteRefreshToken: (clientId: string) => Promise<boolean>;
  updatePassword: (userUuid: UUID, oldPassword: string, newPassword: string) => Promise<boolean>;
  sendDeviceToken: (userUuid: UUID, deviceToken: string, apnsVoipToken: string | null | undefined, apnsNotificationToken: string | null | undefined) => Promise<void>;
  getPushNotificationSenderId: (userUuid: UUID) => Promise<string>;
  sendResetPasswordEmail: (params: SendResetPasswordArgs) => Promise<boolean>;
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
  getUserSession: (userUuid: UUID) => Promise<any>; // @TODO
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
  getProviders: (userUuid: UUID) => Promise<any>; // @TODO
  getProviderToken: (userUuid: UUID, provider: string) => Promise<string>; // @TODO; validate
  getProviderAuthUrl: (userUuid: UUID, provider: string) => Promise<string>;
  deleteProviderToken: (userUuid: UUID, provider: string) => Promise<void>;
}

export default ((client: ApiRequester, baseUrl: string): AuthD => ({
  checkToken: (token: Token): Promise<boolean> => client.head(`${baseUrl}/token/${token}`, null, {}),
  authenticate: (token: Token): Promise<Session | null | undefined> => client.get(`${baseUrl}/token/${token}`, null, {}).then((response: Response) => Session.parse(response)),

  logIn(params: {
    username: string;
    password: string;
    backend: string;
    expiration: number;
    mobile?: boolean;
    tenantId?: string;
    domainName?: string;
  }): Promise<Session | null | undefined> {
    const body: Record<string, any> = {
      backend: params.backend || DEFAULT_BACKEND_USER,
      expiration: params.expiration || DETAULT_EXPIRATION,
    };
    const headers: Record<string, any> = {
      Authorization: `Basic ${ApiRequester.base64Encode(`${params.username}:${params.password}`)}`,
      'Content-Type': 'application/json',
    };

    if (client.clientId) {
      body.access_type = 'offline';
      body.client_id = client.clientId;
    }

    if (params.mobile) {
      headers['Wazo-Session-Type'] = 'mobile';
    }

    if (params.tenantId) {
      console.warn('Use of `tenantId` is deprecated when calling logIn() method, use `domainName` instead.');
      body.tenant_id = params.tenantId;
    }

    if (params.domainName) {
      body.domain_name = params.domainName;
    }

    return client.post(`${baseUrl}/token`, body, headers).then((response: Response) => Session.parse(response));
  },

  logOut: (token: Token): Promise<LogoutResponse> => client.delete(`${baseUrl}/token/${token}`, null, {}, ApiRequester.successResponseParser),

  samlLogIn: async (samlSessionId: string, options : { mobile?: boolean } = {}): Promise<Session | null | undefined> => {
    const headers: Record<string, any> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const body: SamlLoginBody = {
      saml_session_id: samlSessionId,
    };

    if (client.clientId) {
      body.access_type = 'offline';
      body.client_id = client.clientId;
    }

    if (options.mobile) {
      headers['Wazo-Session-Type'] = 'mobile';
    }

    return client.post(`${baseUrl}/token`, body, headers).then(Session.parse);
  },

  initiateIdpAuthentication: async (domain: string, redirectUrl: string) => {
    const body = {
      domain,
      redirect_url: redirectUrl,
    };

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return client.post(`${baseUrl}/saml/sso`, body, headers);
  },
  refreshToken: (refreshToken: string, backend: string, expiration: number, isMobile?: boolean, tenantId?: string, domainName?: string): Promise<Session | null | undefined> => {
    const body: Record<string, any> = {
      backend: backend || DEFAULT_BACKEND_USER,
      expiration: expiration || DETAULT_EXPIRATION,
      refresh_token: refreshToken,
      client_id: client.clientId,
    };

    if (tenantId) {
      console.warn('Use of `tenantId` is deprecated when calling refreshToken() method, use `domainName` instead.');
      body.tenant_id = tenantId;
    }

    if (domainName) {
      body.domain_name = domainName;
    }

    const headers: Record<string, any> = {
      'Content-Type': 'application/json',
      ...(isMobile ? {
        'Wazo-Session-Type': 'mobile',
      } : {}),
    };
    return client.post(`${baseUrl}/token`, body, headers, ApiRequester.defaultParser, false).then(Session.parse);
  },
  deleteRefreshToken: (clientId: string): Promise<boolean> => client.delete(`${baseUrl}/users/me/tokens/${clientId}`, null, null, ApiRequester.successResponseParser),
  updatePassword: (userUuid: UUID, oldPassword: string, newPassword: string): Promise<boolean> => {
    const body = {
      new_password: newPassword,
      old_password: oldPassword,
    };
    return client.put(`${baseUrl}/users/${userUuid}/password`, body, null, ApiRequester.successResponseParser);
  },
  sendDeviceToken: (userUuid: UUID, deviceToken: string, apnsVoipToken: string | null | undefined, apnsNotificationToken: string | null | undefined) => {
    const body: Record<string, any> = {
      token: deviceToken,
    };

    if (apnsVoipToken) {
      // Should be called `voip_token`, but we can't changed it to be retro-compatible
      body.apns_token = apnsVoipToken;
      body.apns_voip_token = apnsVoipToken;
    }

    if (apnsNotificationToken) {
      body.apns_notification_token = apnsNotificationToken;
    }

    return client.post(`${baseUrl}/users/${userUuid}/external/mobile`, body);
  },
  getPushNotificationSenderId: (userUuid: UUID) => client.get(`${baseUrl}/users/${userUuid}/external/mobile/sender_id`, null).then((response: Record<string, any>) => response.sender_id),

  /**
   * `username` or `email` should be set.
   */
  sendResetPasswordEmail: ({
    username,
    email,
  }) => {
    const body: any = {};

    if (username) {
      body.username = username;
    }

    if (email) {
      body.email = email;
    }

    return client.get(`${baseUrl}/users/password/reset`, body, {}, ApiRequester.successResponseParser);
  },
  resetPassword: (userUuid: string, password: string) => {
    const body = {
      password,
    };
    return client.post(`${baseUrl}/users/password/reset?user_uuid=${userUuid}`, body, null, ApiRequester.successResponseParser);
  },
  removeDeviceToken: (userUuid: UUID) => client.delete(`${baseUrl}/users/${userUuid}/external/mobile`),
  createUser: (username: string, password: string, firstname: string, lastname: string): Promise<User> => {
    const body = {
      username,
      password,
      firstname,
      lastname,
    };
    return client.post(`${baseUrl}/users`, body);
  },
  addUserEmail: (userUuid: UUID, email: string, main?: boolean) => {
    const body = {
      emails: [{
        address: email,
        main,
      }],
    };
    return client.put(`${baseUrl}/users/${userUuid}/emails`, body);
  },
  addUserPolicy: (userUuid: UUID, policyUuid: UUID) => client.put(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),
  getRestrictionPolicies: (scopes: string[]) => client.post(`${baseUrl}/token/${client.token}/scopes/check`, {
    scopes,
  }),
  deleteUserPolicy: (userUuid: UUID, policyUuid: UUID) => client.delete(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),
  addUserGroup: (userUuid: UUID, groupUuid: UUID) => client.put(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),
  listUsersGroup: (groupUuid: UUID) => client.get(`${baseUrl}/groups/${groupUuid}/users`),
  deleteUserGroup: (userUuid: UUID, groupUuid: UUID) => client.delete(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),
  getUser: (userUuid: UUID): Promise<GetUserResponse> => client.get(`${baseUrl}/users/${userUuid}`),
  getUserSession: (userUuid: UUID) => client.get(`${baseUrl}/users/${userUuid}/sessions`),
  deleteUserSession: (userUuid: UUID, sessionUuids: UUID) => client.delete(`${baseUrl}/users/${userUuid}/sessions/${sessionUuids}`),
  listUsers: (): Promise<ListUsersResponse> => client.get(`${baseUrl}/users`),
  deleteUser: (userUuid: UUID): Promise<boolean> => client.delete(`${baseUrl}/users/${userUuid}`),
  listTenants: (): Promise<ListTenantsResponse> => client.get(`${baseUrl}/tenants`),
  getTenant: (tenantUuid: UUID): Promise<GetTenantResponse> => client.get(`${baseUrl}/tenants/${tenantUuid}`),
  createTenant: (name: string): Promise<Tenant> => client.post(`${baseUrl}/tenants`, {
    name,
  }),
  updateTenant: (uuid: UUID, name: string, contact: string, phone: string, address: Array<Record<string, any>>): Promise<Tenant> => {
    const body = {
      name,
      contact,
      phone,
      address,
    };
    return client.put(`${baseUrl}/tenants/${uuid}`, body);
  },
  deleteTenant: (uuid: UUID): Promise<boolean> => client.delete(`${baseUrl}/tenants/${uuid}`),
  createGroup: (name: string) => client.post(`${baseUrl}/groups`, {
    name,
  }),
  listGroups: (): Promise<ListGroupsResponse> => client.get(`${baseUrl}/groups`),
  deleteGroup: (uuid: UUID): Promise<boolean> => client.delete(`${baseUrl}/groups/${uuid}`),
  createPolicy: (name: string, description: string, aclTemplates: Array<Record<string, any>>) => {
    const body = {
      name,
      description,
      acl_templates: aclTemplates,
      // deprecated
      acl: aclTemplates,
    };
    return client.post(`${baseUrl}/policies`, body);
  },
  listPolicies: (): Promise<ListPoliciesResponse> => client.get(`${baseUrl}/policies`),
  deletePolicy: (policyUuid: UUID): Promise<boolean> => client.delete(`${baseUrl}/policies/${policyUuid}`),
  getProviders: (userUuid: UUID) => client.get(`${baseUrl}/users/${userUuid}/external`),
  getProviderToken: (userUuid: UUID, provider: string) => client.get(`${baseUrl}/users/${userUuid}/external/${provider}`),
  getProviderAuthUrl: (userUuid: UUID, provider: string) => client.post(`${baseUrl}/users/${userUuid}/external/${provider}`, {}),
  deleteProviderToken: (userUuid: UUID, provider: string) => client.delete(`${baseUrl}/users/${userUuid}/external/${provider}`),
}));
