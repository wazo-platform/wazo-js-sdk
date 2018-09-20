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

export type Group = {
  // @TODO
};

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

export type AccessdGroup = {
  // @TODO
};

export type Link = {
  href: string,
  rel: string
};

export type Line = {
  id: number,
  endpoint_sip: {
    id: number,
    username: string,
    links: Array<Link>
  },
  endpoint_sccp: ?string,
  endpoint_custom: ?string,
  extensions: Array<{
    id: number,
    exten: string,
    context: string,
    links: Array<Link>
  }>
};

export type ConfdUser = {
  id: Number,
  uuid: UUID,
  firstname: string,
  lastname: string,
  email: string,
  timezone: ?string,
  language: ?string,
  description: ?string,
  caller_id: string,
  outgoing_caller_id: string,
  mobile_phone_number: string,
  username: ?string,
  password: ?string,
  music_on_hold: ?Boolean, // to check
  preprocess_subroutine: ?string, // to check
  call_transfer_enabled: Boolean,
  dtmf_hangup_enabled: Boolean,
  call_record_enabled: Boolean,
  online_call_record_enabled: Boolean,
  supervision_enabled: Boolean,
  ring_seconds: number,
  simultaneous_calls: number,
  call_permission_password: string,
  subscription_type: number,
  created_at: DateString,
  enabled: Boolean,
  tenant_uuid: UUID,
  links: Array<Link>,
  agent: ?string, // to check
  cti_profile: ?string, // to check
  call_permissions: String<>,
  fallbacks: {
    noanswer_destination: ?string,
    busy_destination: ?string,
    congestion_destination: ?string,
    fail_destination: ?string
  },
  groups: Array<AccessdGroup>,
  incalls: Array<Object>, // @TODO
  lines: Array<Line>,
  forwards: {
    busy: {
      enable: Boolean,
      destination: ?string
    },
    noanswer: {
      enable: Boolean,
      destination: ?string
    },
    unconditional: {
      enable: Boolean,
      destination: ?string
    }
  },
  schedules: [], // @TODO
  services: {
    dnd: {
      enabled: Boolean
    },
    incallfilter: {
      enabled: Boolean
    }
  },
  switchboards: Array<Object>, // @TODO
  voicemail: ?string,
  queues: Array<Object> // @TODO
};

export type ListConfdUsersResponse = {
  total: number,
  items: Array<ConfdUser>
};

export type Application = {
  uuid: UUID,
  tenant_uuid: UUID,
  name: string,
  destination: string,
  destination_options: {
    music_on_hold: string,
    type: string
  },
  links: Array<Link>
};

export type ListApplicationsResponse = {
  total: number,
  items: Array<Application>
};

export type Node = {
  uuid: UUID,
  calls: Array<Object> // @TODO
};

export type CallNode = {
  // @TODO
};

export type ListNodesResponse = {
  items: Array<Node>
};

export type ListCallNodesResponse = {
  uuid: UUID,
  items: Array<CallNode>
};
