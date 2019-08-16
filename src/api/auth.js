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
  checkToken(token: Token): Promise<Boolean> {
    return client.head(`${baseUrl}/token/${token}`, null, {});
  },

  authenticate(token: Token): Promise<?Session> {
    return client.get(`${baseUrl}/token/${token}`, null, {}).then(response => Session.parse(response));
  },

  logIn(params: {
    username: string,
    password: string,
    backend: string,
    expiration: number,
    mobile?: boolean,
  }): Promise<?Session> {
    const body = {
      backend: params.backend || DEFAULT_BACKEND_USER,
      expiration: params.expiration || DETAULT_EXPIRATION,
    };
    const headers: Object = {
      Authorization: `Basic ${ApiRequester.base64Encode(`${params.username}:${params.password}`)}`,
      'Content-Type': 'application/json',
    };

    if (params.mobile) {
      headers['Wazo-Session-Type'] = 'mobile';
    }

    return client.post(`${baseUrl}/token`, body, headers).then(response => Session.parse(response));
  },

  logOut(token: Token): Promise<LogoutResponse> {
    return client.delete(`${baseUrl}/token/${token}`, null, {}, ApiRequester.successResponseParser);
  },

  updatePassword(token: Token, userUuid: UUID, oldPassword: string, newPassword: string): Promise<Boolean> {
    const body = {
      new_password: newPassword,
      old_password: oldPassword,
    };

    return client.put(`${baseUrl}/users/${userUuid}/password`, body, token, ApiRequester.successResponseParser);
  },

  sendDeviceToken(token: Token, userUuid: UUID, deviceToken: string, apnsToken: ?string) {
    const body: Object = {
      token: deviceToken,
    };

    if (apnsToken) {
      body.apns_token = apnsToken;
    }

    return client.post(`${baseUrl}/users/${userUuid}/external/mobile`, body, token);
  },

  getPushNotificationSenderId(token: Token, userUuid: UUID) {
    return client
      .get(`${baseUrl}/users/${userUuid}/external/mobile/sender_id`, null, token)
      .then(response => response.sender_id);
  },

  /**
   * `username` or `email` should be set.
   */
  sendResetPasswordEmail({ username, email }: { username: ?string, email: ?string }) {
    const body = {};
    if (username) {
      body.username = username;
    }
    if (email) {
      body.email = email;
    }

    return client.get(`${baseUrl}/users/password/reset`, body, {}, ApiRequester.successResponseParser);
  },

  resetPassword(token: string, userUuid: string, password: string) {
    const body = {
      password,
    };

    return client.post(
      `${baseUrl}/users/password/reset?user_uuid=${userUuid}`,
      body,
      token,
      ApiRequester.successResponseParser,
    );
  },

  removeDeviceToken(token: Token, userUuid: UUID) {
    return client.delete(`${baseUrl}/users/${userUuid}/external/mobile`, null, token);
  },

  createUser(
    token: Token,
    username: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<User | RequestError> {
    const body = {
      username,
      password,
      firstname,
      lastname,
    };

    return client.post(`${baseUrl}/users`, body, token);
  },

  addUserEmail(token: Token, userUuid: UUID, email: string, main?: boolean) {
    const body = {
      emails: [
        {
          address: email,
          main,
        },
      ],
    };

    return client.put(`${baseUrl}/users/${userUuid}/emails`, body, token);
  },

  addUserPolicy(token: Token, userUuid: UUID, policyUuid: UUID) {
    return client.put(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`, null, token);
  },

  deleteUserPolicy(token: Token, userUuid: UUID, policyUuid: UUID) {
    return client.delete(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`, null, token);
  },

  addUserGroup(token: Token, userUuid: UUID, groupUuid: UUID) {
    return client.put(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`, null, token);
  },

  listUsersGroup(token: Token, groupUuid: UUID) {
    return client.get(`${baseUrl}/groups/${groupUuid}/users`, null, token);
  },

  deleteUserGroup(token: Token, userUuid: UUID, groupUuid: UUID) {
    return client.delete(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`, null, token);
  },

  getUser(token: Token, userUuid: UUID): Promise<GetUserResponse> {
    return client.get(`${baseUrl}/users/${userUuid}`, null, token);
  },

  getUserSession(token: Token, userUuid: UUID) {
    return client.get(`${baseUrl}/users/${userUuid}/sessions`, null, token);
  },

  deleteUserSession(token: Token, userUuid: UUID, sessionUuis: UUID) {
    return client.delete(`${baseUrl}/users/${userUuid}/sessions/${sessionUuis}`, null, token);
  },

  listUsers(token: Token): Promise<ListUsersResponse> {
    return client.get(`${baseUrl}/users`, null, token);
  },

  deleteUser(token: Token, userUuid: UUID): Promise<Boolean | RequestError> {
    return client.delete(`${baseUrl}/users/${userUuid}`, null, token);
  },

  listTenants(token: Token): Promise<ListTenantsResponse> {
    return client.get(`${baseUrl}/tenants`, null, token);
  },

  getTenant(token: Token, tenantUuid: UUID): Promise<GetTenantResponse> {
    return client.get(`${baseUrl}/tenants/${tenantUuid}`, null, token);
  },

  createTenant(token: Token, name: string): Promise<Tenant | RequestError> {
    return client.post(`${baseUrl}/tenants`, { name }, token);
  },

  updateTenant(
    token: Token,
    uuid: UUID,
    name: string,
    contact: string,
    phone: string,
    address: Array<Object>,
  ): Promise<Tenant | RequestError> {
    const body = {
      name,
      contact,
      phone,
      address,
    };

    return client.put(`${baseUrl}/tenants/${uuid}`, body, token);
  },

  deleteTenant(token: Token, uuid: UUID): Promise<Boolean | RequestError> {
    return client.delete(`${baseUrl}/tenants/${uuid}`, null, token);
  },

  createGroup(token: Token, name: string) {
    return client.post(`${baseUrl}/groups`, { name }, token);
  },

  listGroups(token: Token): Promise<ListGroupsResponse> {
    return client.get(`${baseUrl}/groups`, null, token);
  },

  deleteGroup(token: Token, uuid: UUID): Promise<Boolean | RequestError> {
    return client.delete(`${baseUrl}/groups/${uuid}`, null, token);
  },

  createPolicy(token: Token, name: string, description: string, aclTemplates: Array<Object>) {
    const body = {
      name,
      description,
      acl_templates: aclTemplates,
    };

    return client.post(`${baseUrl}/policies`, body, token);
  },

  listPolicies(token: Token): Promise<ListPoliciesResponse> {
    return client.get(`${baseUrl}/policies`, null, token);
  },

  deletePolicy(token: Token, policyUuid: UUID): Promise<Boolean | RequestError> {
    return client.delete(`${baseUrl}/policies/${policyUuid}`, null, token);
  },

  getProviders(token: Token, userUuid: UUID) {
    return client.get(`${baseUrl}/users/${userUuid}/external`, null, token);
  },

  getProviderToken(token: Token, userUuid: UUID, provider: string) {
    return client.get(`${baseUrl}/users/${userUuid}/external/${provider}`, null, token);
  },

  getProviderAuthUrl(token: Token, userUuid: UUID, provider: string) {
    return client.post(`${baseUrl}/users/${userUuid}/external/${provider}`, {}, token);
  },

  deleteProviderToken(token: Token, userUuid: UUID, provider: string) {
    return client.delete(`${baseUrl}/users/${userUuid}/external/${provider}`, null, token);
  },
});
