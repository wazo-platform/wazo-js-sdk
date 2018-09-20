/* @flow */

export type Token = string;
export type UUID = string;
export type DateString = string;

export type RequestError = {
  timestamp: number,
  message: string,
  resource: string,
  error_id: string,
  details: {
    uuid: string
  }
};

export type LoginResponse = {
  metadata: {
    username: string,
    uuid: UUID,
    tenant_uuid: UUID,
    xivo_user_uuid: UUID,
    groups: Array<string>,
    xivo_uuid: UUID,
    tenants: Array<{ uuid: UUID }>,
    auth_id: UUID
  },
  token: Token,
  acls: Array<string>,
  utc_expires_at: DateString,
  xivo_uuid: UUID,
  issued_at: DateString,
  utc_issued_at: DateString,
  auth_id: UUID,
  expires_at: DateString,
  xivo_user_uuid: UUID
};

export type LogoutResponse = {
  data: {
    message: string
  }
};

export type User = {
  username: string,
  uuid: UUID,
  firstname: string,
  lastname: string,
  enabled: Boolean,
  tenant_uuid: string,
  emails: Array<string>
};

export type Tenant = {
  name: string,
  uuid: UUID,
  phone: ?string,
  contact: ?string,
  address: Array<{
    city: ?string,
    country: ?string,
    state: ?string,
    line_1: ?string,
    line_2: ?string,
    zip_code: ?string
  }>,
  parent_uuid: UUID
};

export type Group = {};

export type Policy = {
  acl_templates: Array<string>,
  description: ?string,
  tenant_uuid: UUID,
  uuid: UUID,
  name: string
};

export type ListTenantsResponse = {
  filtered: number,
  total: number,
  items: Array<Tenant>
};

export type ListUsersResponse = {
  filtered: number,
  total: number,
  items: Array<User>
};

export type ListGroupsResponse = {
  filtered: number,
  total: number,
  items: Array<Group>
};

export type ListPoliciesResponse = {
  total: number,
  items: Array<Policy>
};
