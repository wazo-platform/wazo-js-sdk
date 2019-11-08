// @flow
import { KEYUTIL, jws, b64utoutf8 } from 'jsrsasign';

import { swarmPublicKey } from '../../config';
import Profile from './Profile';
import Contact from './Contact';
import Line from './Line';
import SipLine from './SipLine';
import type { UUID, Token } from './types';
import newFrom from '../utils/new-from';
import compareVersions from '../utils/compare-version';

const swarmKey = KEYUTIL.getKey(swarmPublicKey);
const MINIMUM_WAZO_ENGINE_VERSION_FOR_DEFAULT_CONTEXT = '19.08';

type Response = {
  data: {
    token: Token,
    refresh_token?: Token,
    session_uuid: UUID,
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
      auth_id?: UUID,
    },
  },
};

type Authorization = {
  uuid: string,
  rules: Array<{ name: string, options: Object }>,
  service: ?string,
};

type SessionArguments = {
  token: string,
  refreshToken?: ?string,
  sessionUuid?: ?string,
  uuid?: ?string,
  tenantUuid?: ?string,
  profile?: ?Profile,
  expiresAt: Date,
  authorizations?: Array<Authorization>,
  engineVersion?: ?string,
};

export default class Session {
  token: string;
  refreshToken: ?string;
  uuid: ?string;
  tenantUuid: ?string;
  sessionUuid: ?string;
  engineVersion: ?string;
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
      refreshToken: plain.data.refresh_token || null,
      uuid: plain.data.metadata ? plain.data.metadata.uuid : null,
      sessionUuid: plain.data.session_uuid,
      authorizations,
      tenantUuid: plain.data.metadata ? plain.data.metadata.tenant_uuid : undefined,
      expiresAt: new Date(`${plain.data.utc_expires_at}z`),
    });
  }

  static newFrom(profile: Session) {
    return newFrom(profile, Session);
  }

  constructor({
    token,
    uuid,
    tenantUuid,
    profile,
    expiresAt,
    authorizations,
    engineVersion,
    refreshToken,
    sessionUuid,
  }: SessionArguments = {}) {
    this.token = token;
    this.uuid = uuid;
    this.tenantUuid = tenantUuid || null;
    this.profile = profile;
    this.expiresAt = expiresAt;
    this.authorizations = authorizations || [];
    this.engineVersion = engineVersion;
    this.refreshToken = refreshToken;
    this.sessionUuid = sessionUuid;
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

  primaryLine(): ?Line {
    return this.profile && this.profile.lines.length > 0 ? this.profile.lines[0] : null;
  }

  primarySipLine(): ?SipLine {
    return this.profile && this.profile.sipLines.length > 0 ? this.profile.sipLines[0] : null;
  }

  primaryWebRtcLine(): ?SipLine {
    return this.profile && this.profile.sipLines.find(sipLine => sipLine.isWebRtc());
  }

  primaryCtiLine(): ?SipLine {
    return this.profile && this.profile.sipLines.find(sipLine => !sipLine.isWebRtc());
  }

  primaryContext(): string {
    if (this.engineVersion) {
      if (this.hasEngineVersionGte(MINIMUM_WAZO_ENGINE_VERSION_FOR_DEFAULT_CONTEXT)) {
        return 'default';
      }
    }

    const line = this.primaryLine();

    return line && line.extensions.length > 0 ? line.extensions[0].context : 'default';
  }

  hasEngineVersionGte(version: string) {
    return this.engineVersion && compareVersions(String(this.engineVersion), String(version)) >= 0;
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
