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
  tenantUuid?: string,
  profile?: Profile,
  expiresAt: Date
};

export default class Session {
  token: string;
  uuid: string;
  tenantUuid: ?string;
  profile: ?Profile;
  expiresAt: Date;

  static parse(plain: Response): ?Session {
    return new Session({
      token: plain.data.token,
      uuid: plain.data.xivo_user_uuid,
      tenantUuid: plain.data.metadata ? plain.data.metadata.tenant_uuid : undefined,
      expiresAt: new Date(`${plain.data.utc_expires_at}z`)
    });
  }

  static newFrom(profile: Session) {
    return newFrom(profile, Session);
  }

  constructor({ token, uuid, tenantUuid, profile, expiresAt }: SessionArguments = {}) {
    this.token = token;
    this.uuid = uuid;
    this.tenantUuid = tenantUuid || null;
    this.profile = profile;
    this.expiresAt = expiresAt;
  }

  hasExpired(date: Date = new Date()): boolean {
    return date >= this.expiresAt;
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

  allLines(): Line[] {
    return this.profile ? this.profile.lines || [] : [];
  }

  allNumbers(): string[] {
    const extensions = this.allLines().map(line => line.extensions.map(extension => extension.exten));
    if (!extensions.length) {
      return [];
    }

    return extensions.reduce((a, b) => a.concat(b));
  }

  hasExtension(extension: string): boolean {
    return this.allNumbers().some(number => number === extension);
  }
}
