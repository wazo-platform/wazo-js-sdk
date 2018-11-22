// @flow

import Profile from './Profile';
import Contact from './Contact';
import Line from './Line';
import type { UUID, Token } from './types';
import newFrom from '../utils/new-from';

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

type SessionArguments = {
  token: string,
  uuid: string,
  profile?: Profile,
  utcExpiresAt: string
};

export default class Session {
  token: string;
  uuid: string;
  profile: ?Profile;
  utcExpiresAt: string;

  static parse(plain: Response): ?Session {
    return new Session({
      token: plain.data.token,
      uuid: plain.data.xivo_user_uuid,
      utcExpiresAt: plain.data.utc_expires_at
    });
  }

  static newFrom(profile: Session) {
    return newFrom(profile, Session);
  }

  constructor({ token, uuid, profile, utcExpiresAt }: SessionArguments = {}) {
    this.token = token;
    this.uuid = uuid;
    this.profile = profile;
    this.utcExpiresAt = utcExpiresAt;
  }

  hasExpired(date: Date = new Date()): boolean {
    return date >= new Date(`${this.utcExpiresAt}z`);
  }

  is(contact: Contact): boolean {
    return Boolean(contact) && this.uuid === contact.uuid;
  }

  using(profile: Profile): Session {
    this.profile = profile;

    return this;
  }

  displayName(): string {
    return this.profile ? `${this.profile.firstName} ${this.profile.lastName}` : '';
  }

  hasAccessToVoicemail(): boolean {
    if (!this.profile) {
      return false;
    }
    return !!this.profile.voicemail;
  }

  primaryLine(): ?Line {
    return this.profile ? this.profile.lines[0] : null;
  }

  primaryContext(): ?string {
    const line = this.primaryLine();

    return line ? line.extensions[0].context : null;
  }

  primaryNumber(): ?string {
    const line = this.primaryLine();

    return line ? line.extensions[0].exten : null;
  }
}
