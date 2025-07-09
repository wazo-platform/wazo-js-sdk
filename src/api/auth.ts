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
  headers?: Record<string, string>;
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

export default ((client: ApiRequester, baseUrl: string) => ({
  checkToken: (token: Token): Promise<boolean> => client.head(`${baseUrl}/token/${token}`, null, {}),

  authenticate: (token: Token): Promise<Session | null | undefined> => client.get(`${baseUrl}/token/${token}`, null, {}).then((response: Response) => Session.parse(response)),

  logIn(params: LoginParams): Promise<Session | null | undefined> {
    const body: Record<string, any> = {
      backend: params.backend || DEFAULT_BACKEND_USER,
      expiration: params.expiration || DETAULT_EXPIRATION,
    };
    const headers: Record<string, string> = {
      Authorization: `Basic ${ApiRequester.base64Encode(`${params.username}:${params.password}`)}`,
      'Content-Type': 'application/json',
      ...(params.headers || {}),
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

  samlLogIn: async (samlSessionId: string): Promise<Session | null | undefined> => {
    const headers: Record<string, string> = {
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

    if (Wazo.Auth.mobile) {
      headers['Wazo-Session-Type'] = 'mobile';
    }

    return client.post(`${baseUrl}/token`, body, headers).then(Session.parse);
  },

  samlLogOut(): Promise<void | { location:string }> {
    return client.get(`${baseUrl}/saml/logout`, null, null);
  },

  initiateIdpAuthentication: async (domain: string, redirectUrl: string): Promise<any> => {
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

    const headers: Record<string, string> = {
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

  getDeviceToken: (userUuid: UUID)=>client.get(`${baseUrl}/users/${userUuid}/external/mobile`),

  sendDeviceToken: (userUuid: UUID, deviceToken: string, apnsVoipToken: string | null | undefined, apnsNotificationToken: string | null | undefined): Promise<void> => {
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

  getPushNotificationSenderId: (userUuid: UUID): Promise<string> => client.get(`${baseUrl}/users/${userUuid}/external/mobile/sender_id`, null).then((response: Record<string, any>) => response.sender_id),

  /**
   * `username` or `email` should be set.
   */
  sendResetPasswordEmail: ({ username, email }: SendResetPasswordArgs): Promise<boolean> => {
    const body: any = {};

    if (username) {
      body.username = username;
    }

    if (email) {
      body.email = email;
    }

    return client.get(`${baseUrl}/users/password/reset`, body, {}, ApiRequester.successResponseParser);
  },

  resetPassword: (userUuid: string, password: string): Promise<boolean> => {
    const body = {
      password,
    };
    return client.post(`${baseUrl}/users/password/reset?user_uuid=${userUuid}`, body, null, ApiRequester.successResponseParser);
  },

  removeDeviceToken: (userUuid: UUID): Promise<void> => client.delete(`${baseUrl}/users/${userUuid}/external/mobile`),

  createUser: (username: string, password: string, firstname: string, lastname: string): Promise<User> => {
    const body = {
      username,
      password,
      firstname,
      lastname,
    };
    return client.post(`${baseUrl}/users`, body);
  },

  addUserEmail: (userUuid: UUID, email: string, main?: boolean): Promise<void> => {
    const body = {
      emails: [{
        address: email,
        main,
      }],
    };
    return client.put(`${baseUrl}/users/${userUuid}/emails`, body);
  },

  addUserPolicy: (userUuid: UUID, policyUuid: UUID): Promise<void> => client.put(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),

  getRestrictionPolicies: (scopes: string[]): Promise<any> => client.post(`${baseUrl}/token/${client.token}/scopes/check`, { scopes }),

  deleteUserPolicy: (userUuid: UUID, policyUuid: UUID): Promise<any> => client.delete(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),

  addUserGroup: (userUuid: UUID, groupUuid: UUID): Promise<any> => client.put(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),

  listUsersGroup: (groupUuid: UUID): Promise<any> => client.get(`${baseUrl}/groups/${groupUuid}/users`),

  deleteUserGroup: (userUuid: UUID, groupUuid: UUID): Promise<void> => client.delete(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),

  getUser: (userUuid: UUID): Promise<GetUserResponse> => client.get(`${baseUrl}/users/${userUuid}`),

  getUserSession: (userUuid: UUID): Promise<any> => client.get(`${baseUrl}/users/${userUuid}/sessions`),

  deleteUserSession: (userUuid: UUID, sessionUuids: UUID): Promise<void> => client.delete(`${baseUrl}/users/${userUuid}/sessions/${sessionUuids}`),

  listUsers: (): Promise<ListUsersResponse> => client.get(`${baseUrl}/users`),

  deleteUser: (userUuid: UUID): Promise<boolean> => client.delete(`${baseUrl}/users/${userUuid}`),

  listTenants: (): Promise<ListTenantsResponse> => client.get(`${baseUrl}/tenants`),

  getTenant: (tenantUuid: UUID): Promise<GetTenantResponse> => client.get(`${baseUrl}/tenants/${tenantUuid}`),

  createTenant: (name: string): Promise<Tenant> => client.post(`${baseUrl}/tenants`, { name }),

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

  createGroup: (name: string): Promise<void> => client.post(`${baseUrl}/groups`, { name }),

  listGroups: (): Promise<ListGroupsResponse> => client.get(`${baseUrl}/groups`),

  deleteGroup: (uuid: UUID): Promise<boolean> => client.delete(`${baseUrl}/groups/${uuid}`),

  createPolicy: (name: string, description: string, aclTemplates: Array<Record<string, any>>): Promise<void> => {
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

  getProviders: (userUuid: UUID): Promise<any> => client.get(`${baseUrl}/users/${userUuid}/external`),

  getProviderToken: (userUuid: UUID, provider: string): Promise<string> => client.get(`${baseUrl}/users/${userUuid}/external/${provider}`),

  getProviderAuthUrl: (userUuid: UUID, provider: string): Promise<string> => client.post(`${baseUrl}/users/${userUuid}/external/${provider}`, {}),

  deleteProviderToken: (userUuid: UUID, provider: string): Promise<void> => client.delete(`${baseUrl}/users/${userUuid}/external/${provider}`),
}));
