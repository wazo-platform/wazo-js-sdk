// @flow

import { Record } from 'immutable';

import Profile from './Profile';
import Contact from './Contact';
import Line from './Line';
import type { UUID, Token } from './types';

type Response = {
  data: {
    token: Token,
    acls: Array<string>,
    utc_expires_at: string,
    xivo_uuid: string,
    issued_at: string,
    auth_id: string,
    expires_at: string,
    xivo_user_uuid: string,
    metadata: ?{
      username: string,
      uuid: UUID,
      tenant_uuid: UUID,
      xivo_user_uuid: UUID,
      groups: Array<string>,
      xivo_uuid: UUID,
      tenants: Array<{ uuid: UUID }>,
      auth_id: UUID
    }
  }
};

const SessionRecord = Record({
  token: undefined,
  uuid: undefined,
  profile: undefined
});

export default class Session extends SessionRecord {
  token: string;
  uuid: string;
  profile: Profile;

  static parse(plain: Response): Session {
    return new Session({
      token: plain.data.token,
      uuid: plain.data.xivo_user_uuid
    });
  }

  static using(profile: Profile): Session {
    return this.set('profile', profile);
  }

  is(contact: Contact): boolean {
    return Boolean(contact) && this.uuid === contact.uuid;
  }

  displayName(): string {
    return `${this.profile.firstname} ${this.profile.lastname}`;
  }

  primaryLine(): Line {
    return this.profile.lines[0];
  }

  primaryContext(): string {
    return this.primaryLine().extensions[0].context;
  }

  primaryNumber(): string {
    return this.primaryLine().extensions[0].exten;
  }
}
