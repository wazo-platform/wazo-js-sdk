// @flow
import { KEYUTIL, jws, b64utoutf8 } from 'jsrsasign';

import { swarmPublicKey } from '../../config';
import Profile from './Profile';
import Contact from './Contact';
import Line from './Line';
import type { UUID, Token } from './types';
import newFrom from '../utils/new-from';

const swarmKey = KEYUTIL.getKey(swarmPublicKey);

const Authorizations = {
  DESKTOP: 'application-client-access'
};

type Response = {
  data: {
    token: Token,
    acls: Array<string>,
    utc_expires_at: string,
    xivo_uuid: string,
    issued_at: string,
    auth_id: string,
    expires_at: string,
    xivo_user_uuid: ?string,
    metadata: ?{
      jwt?: string,
      username?: string,
      uuid: UUID,
      tenant_uuid?: UUID,
      xivo_user_uuid?: UUID,
      groups?: Array<string>,
      xivo_uuid?: UUID,
      tenants?: Array<{ uuid: UUID }>,
      auth_id?: UUID
    }
  }
};

type Authorization = {
  uuid: string,
  rules: Array<{ name: string, options: Object }>,
  service: ?string
};

type SessionArguments = {
  token: string,
  uuid: ?string,
  tenantUuid?: string,
  profile?: Profile,
  expiresAt: Date,
  authorizations?: Array<Authorization>
};

export default class Session {
  token: string;
  uuid: ?string;
  tenantUuid: ?string;
  profile: ?Profile;
  expiresAt: Date;
  authorizations: Array<Authorization>;

  static parse(plain: Response): ?Session {
    const token = plain.data.metadata ? plain.data.metadata.jwt : null;
    let authorizations = [];

    // Add authorizations from JWT
    if (token) {
      const isValid = jws.JWS.verifyJWT(token, swarmKey, { alg: ['RS256'], verifyAt: new Date() });
      if (isValid) {
        const decodedToken = jws.JWS.readSafeJSONString(b64utoutf8(token.split('.')[1]));
        authorizations = decodedToken ? decodedToken.authorizations : [];
      }
    }

    return new Session({
      token: plain.data.token,
      uuid: plain.data.metadata ? plain.data.metadata.uuid : null,
      authorizations,
      tenantUuid: plain.data.metadata ? plain.data.metadata.tenant_uuid : undefined,
      expiresAt: new Date(`${plain.data.utc_expires_at}z`)
    });
  }

  static newFrom(profile: Session) {
    return newFrom(profile, Session);
  }

  constructor({ token, uuid, tenantUuid, profile, expiresAt, authorizations }: SessionArguments = {}) {
    this.token = token;
    this.uuid = uuid;
    this.tenantUuid = tenantUuid || null;
    this.profile = profile;
    this.expiresAt = expiresAt;
    this.authorizations = authorizations || [];
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

  hasAuthorizations() {
    return this.authorizations && !!this.authorizations.length;
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

  hasDesktopAuthorizations(): boolean {
    const desktopRule = rule => rule.name === Authorizations.DESKTOP;
    const desktopAuthorization = (authorization: Authorization) => authorization.rules.find(desktopRule);

    return this.authorizations.find(desktopAuthorization);
  }

  hasSubscription(): boolean {
    return this.profile.subscriptionType <= 0;
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
