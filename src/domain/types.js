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
    uuid: string,
  },
};

export type LogoutResponse = {
  data: {
    message: string,
  },
};

export type User = {
  username: string,
  uuid: UUID,
  firstname: string,
  lastname: string,
  enabled: boolean,
  tenant_uuid: string,
  emails: Array<string>,
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
    zip_code: ?string,
  }>,
  parent_uuid: UUID,
};

export type Group = {
  // @TODO
};

export type Policy = {
  acl_templates: Array<string>,
  description: ?string,
  tenant_uuid: UUID,
  uuid: UUID,
  name: string,
};

export type ListTenantsResponse = {
  filtered: number,
  total: number,
  items: Array<Tenant>,
};

export type ListUsersResponse = {
  filtered: number,
  total: number,
  items: Array<User>,
};

export type ListGroupsResponse = {
  filtered: number,
  total: number,
  items: Array<Group>,
};

export type ListPoliciesResponse = {
  total: number,
  items: Array<Policy>,
};

export type AccessdGroup = {
  // @TODO
};

export type Link = {
  href: string,
  rel: string,
};

export type Line = {
  id: number,
  endpoint_sip: {
    id: number,
    username: string,
    links: Array<Link>,
  },
  endpoint_sccp: ?string,
  endpoint_custom: ?string,
  extensions: Array<{
    id: number,
    exten: string,
    context: string,
    links: Array<Link>,
  }>,
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
  music_on_hold: ?boolean, // to check
  preprocess_subroutine: ?string, // to check
  call_transfer_enabled: boolean,
  dtmf_hangup_enabled: boolean,
  call_record_enabled: boolean,
  online_call_record_enabled: boolean,
  supervision_enabled: boolean,
  ring_seconds: number,
  simultaneous_calls: number,
  call_permission_password: string,
  subscription_type: number,
  created_at: DateString,
  enabled: boolean,
  tenant_uuid: UUID,
  links: Array<Link>,
  agent: ?string, // to check
  cti_profile: ?string, // to check
  call_permissions: String<>,
  fallbacks: {
    noanswer_destination: ?string,
    busy_destination: ?string,
    congestion_destination: ?string,
    fail_destination: ?string,
  },
  groups: Array<AccessdGroup>,
  incalls: Array<Object>, // @TODO
  lines: Array<Line>,
  forwards: {
    busy: {
      enable: boolean,
      destination: ?string,
    },
    noanswer: {
      enable: boolean,
      destination: ?string,
    },
    unconditional: {
      enable: boolean,
      destination: ?string,
    },
  },
  schedules: [], // @TODO
  services: {
    dnd: {
      enabled: boolean,
    },
    incallfilter: {
      enabled: boolean,
    },
  },
  switchboards: Array<Object>, // @TODO
  voicemail: ?string,
  queues: Array<Object>, // @TODO
};

export type ListConfdUsersResponse = {
  total: number,
  items: Array<ConfdUser>,
};

export type Application = {
  uuid: UUID,
  tenant_uuid: UUID,
  name: string,
  destination: string,
  destination_options: {
    music_on_hold: string,
    type: string,
  },
  links: Array<Link>,
};

export type ListApplicationsResponse = {
  total: number,
  items: Array<Application>,
};

export type Node = {
  uuid: UUID,
  calls: Array<Object>, // @TODO
};

export type CallNode = {
  // @TODO
};

export type ListNodesResponse = {
  items: Array<Node>,
};

export type ListCallNodesResponse = {
  uuid: UUID,
  items: Array<CallNode>,
};

export type GetTenantResponse = {
  // @TODO
};

export type GetUserResponse = {
  // @TODO
};

export type WebRtcConfig = {
  id: number,
  host: string,
  line: { id: number, links: Array<Link> },
  links: Array<Link>,
  options: Array<Array<string>>,
  secret: string,
  tenant_uuid: string,
  type: string,
  username: string,
};
