/* @flow */
import ApiRequester from '../utils/api-requester';
import type {
  User,
  Tenant,
  Token,
  UUID,
  LogoutResponse,
  ListTenantsResponse,
  RequestError,
  ListUsersResponse,
  ListGroupsResponse,
  ListPoliciesResponse,
  GetTenantResponse,
  GetUserResponse,
} from '../domain/types';
import Session from '../domain/Session';

const DEFAULT_BACKEND_USER = 'wazo_user';
const DETAULT_EXPIRATION = 3600;

export default (client: ApiRequester, baseUrl: string) => ({
  checkToken: (token: Token): Promise<Boolean> => client.head(`${baseUrl}/token/${token}`, null, {}),

  authenticate: (token: Token): Promise<?Session> =>
    client.get(`${baseUrl}/token/${token}`, null, {}).then(response => Session.parse(response)),

  logIn(params: {
    username: string,
    password: string,
    backend: string,
    expiration: number,
    mobile?: boolean,
  }): Promise<?Session> {
    const body: Object = {
      backend: params.backend || DEFAULT_BACKEND_USER,
      expiration: params.expiration || DETAULT_EXPIRATION,
    };
    const headers: Object = {
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

    return client.post(`${baseUrl}/token`, body, headers).then(response => Session.parse(response));
  },

  logOut: (token: Token): Promise<LogoutResponse> =>
    client.delete(`${baseUrl}/token/${token}`, null, {}, ApiRequester.successResponseParser),

  refreshToken: (refreshToken: string, backend: string, expiration: number): Promise<?Session> => {
    const body: Object = {
      backend: backend || DEFAULT_BACKEND_USER,
      expiration: expiration || DETAULT_EXPIRATION,
      refresh_token: refreshToken,
      client_id: client.clientId,
    };

    const headers: Object = {
      'Content-Type': 'application/json',
    };

    return client.post(`${baseUrl}/token`, body, headers, ApiRequester.defaultParser, false).then(Session.parse);
  },

  updatePassword: (userUuid: UUID, oldPassword: string, newPassword: string): Promise<Boolean> => {
    const body = {
      new_password: newPassword,
      old_password: oldPassword,
    };

    return client.put(`${baseUrl}/users/${userUuid}/password`, body, null, ApiRequester.successResponseParser);
  },

  sendDeviceToken: (userUuid: UUID, deviceToken: string, apnsToken: ?string) => {
    const body: Object = {
      token: deviceToken,
    };

    if (apnsToken) {
      body.apns_token = apnsToken;
    }

    return client.post(`${baseUrl}/users/${userUuid}/external/mobile`, body);
  },

  getPushNotificationSenderId: (userUuid: UUID) =>
    client.get(`${baseUrl}/users/${userUuid}/external/mobile/sender_id`, null).then(response => response.sender_id),

  /**
   * `username` or `email` should be set.
   */
  sendResetPasswordEmail: ({ username, email }: { username: ?string, email: ?string }) => {
    const body = {};
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

    return client.post(
      `${baseUrl}/users/password/reset?user_uuid=${userUuid}`,
      body,
      null,
      ApiRequester.successResponseParser,
    );
  },

  removeDeviceToken: (userUuid: UUID) => client.delete(`${baseUrl}/users/${userUuid}/external/mobile`),

  createUser: (
    username: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<User | RequestError> => {
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
      emails: [
        {
          address: email,
          main,
        },
      ],
    };

    return client.put(`${baseUrl}/users/${userUuid}/emails`, body);
  },

  addUserPolicy: (userUuid: UUID, policyUuid: UUID) =>
    client.put(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),

  deleteUserPolicy: (userUuid: UUID, policyUuid: UUID) =>
    client.delete(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),

  addUserGroup: (userUuid: UUID, groupUuid: UUID) => client.put(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),

  listUsersGroup: (groupUuid: UUID) => client.get(`${baseUrl}/groups/${groupUuid}/users`),

  deleteUserGroup: (userUuid: UUID, groupUuid: UUID) =>
    client.delete(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),

  getUser: (userUuid: UUID): Promise<GetUserResponse> => client.get(`${baseUrl}/users/${userUuid}`),

  getUserSession: (userUuid: UUID) => client.get(`${baseUrl}/users/${userUuid}/sessions`),

  deleteUserSession: (userUuid: UUID, sessionUuids: UUID) =>
    client.delete(`${baseUrl}/users/${userUuid}/sessions/${sessionUuids}`),

  listUsers: (): Promise<ListUsersResponse> => client.get(`${baseUrl}/users`),

  deleteUser: (userUuid: UUID): Promise<Boolean | RequestError> => client.delete(`${baseUrl}/users/${userUuid}`),

  listTenants: (): Promise<ListTenantsResponse> => client.get(`${baseUrl}/tenants`),

  getTenant: (tenantUuid: UUID): Promise<GetTenantResponse> => client.get(`${baseUrl}/tenants/${tenantUuid}`),

  createTenant: (name: string): Promise<Tenant | RequestError> => client.post(`${baseUrl}/tenants`, { name }),

  updateTenant: (
    uuid: UUID,
    name: string,
    contact: string,
    phone: string,
    address: Array<Object>,
  ): Promise<Tenant | RequestError> => {
    const body = {
      name,
      contact,
      phone,
      address,
    };

    return client.put(`${baseUrl}/tenants/${uuid}`, body);
  },

  deleteTenant: (uuid: UUID): Promise<Boolean | RequestError> => client.delete(`${baseUrl}/tenants/${uuid}`),

  createGroup: (name: string) => client.post(`${baseUrl}/groups`, { name }),

  listGroups: (): Promise<ListGroupsResponse> => client.get(`${baseUrl}/groups`),

  deleteGroup: (uuid: UUID): Promise<Boolean | RequestError> => client.delete(`${baseUrl}/groups/${uuid}`),

  createPolicy: (name: string, description: string, aclTemplates: Array<Object>) => {
    const body = {
      name,
      description,
      acl_templates: aclTemplates,
    };

    client.post(`${baseUrl}/policies`, body);
  },

  listPolicies: (): Promise<ListPoliciesResponse> => client.get(`${baseUrl}/policies`),

  deletePolicy: (policyUuid: UUID): Promise<Boolean | RequestError> =>
    client.delete(`${baseUrl}/policies/${policyUuid}`),

  getProviders: (userUuid: UUID) => client.get(`${baseUrl}/users/${userUuid}/external`),

  getProviderToken: (userUuid: UUID, provider: string) =>
    client.get(`${baseUrl}/users/${userUuid}/external/${provider}`),

  getProviderAuthUrl: (userUuid: UUID, provider: string) =>
    client.post(`${baseUrl}/users/${userUuid}/external/${provider}`, {}),

  deleteProviderToken: (userUuid: UUID, provider: string) =>
    client.delete(`${baseUrl}/users/${userUuid}/external/${provider}`),
});
