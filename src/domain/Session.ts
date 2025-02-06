/* eslint-disable no-nested-ternary */
import { KEYUTIL, KJUR, b64utoutf8 } from 'jsrsasign';
import moment from 'moment';
import swarmPublicKey from '../pubkey';
import Profile from './Profile';
import Contact from './Contact';
import Line from './Line';
import SipLine from './SipLine';
import type { UUID, Token } from './types';
import newFrom from '../utils/new-from';
import compareVersions from '../utils/compare-version';

const { jws } = KJUR;

const swarmKey = <unknown>(KEYUTIL.getKey(swarmPublicKey)) as string;
const MINIMUM_WAZO_ENGINE_VERSION_FOR_DEFAULT_CONTEXT = '19.08';

type SessionMetadata = {
  jwt?: string;
  username?: string;
  uuid: UUID;
  tenant_uuid?: UUID;
  xivo_user_uuid?: UUID;
  groups?: Array<string>;
  xivo_uuid?: UUID;
  tenants?: Array<{
    uuid: UUID;
  }>;
  auth_id?: UUID;
  [key: string]: any; // Plugin can extend metadata
} | null | undefined;

export type Response = {
  _headers: Headers,
  data: {
    token: Token;
    refresh_token?: Token;
    session_uuid: UUID;
    acls?: Array<string>;
    // deprecated
    acl?: Array<string>;
    utc_expires_at: string;
    xivo_uuid: string;
    issued_at: string;
    auth_id: string;
    expires_at: string;
    xivo_user_uuid: string | null | undefined;
    metadata: SessionMetadata;
  };
};

type Authorization = {
  uuid: string;
  rules: Array<{
    name: string;
    options: Record<string, any>;
  }>;
  service: string | null | undefined;
};

type SessionArguments = {
  acl?: string[];
  token: string;
  refreshToken?: string | null | undefined;
  sessionUuid?: string | null | undefined;
  uuid?: string | null | undefined;
  tenantUuid?: string | null | undefined;
  profile?: Profile | null | undefined;
  expiresAt: Date;
  authorizations?: Array<Authorization>;
  engineVersion?: string | null | undefined;
  // Deprecated, use `stackUuid`
  engineUuid?: string | null | undefined;
  stackUuid?: string | null | undefined;
  stackHostFromHeader?: string | null | undefined;
  metadata?: SessionMetadata
};

export default class Session {
  acl: string[];

  contact?: Contact;

  token: string;

  refreshToken: string | null | undefined;

  uuid: string | null | undefined;

  tenantUuid: string | null | undefined;

  stackUuid: string | null | undefined;

  sessionUuid: string | null | undefined;

  engineVersion: string | null | undefined;

  _stackHostFromHeader: string | undefined | null;

  profile: Profile | null | undefined;

  expiresAt: Date;

  authorizations: Array<Authorization>;

  metadata: SessionMetadata;

  static parse(plain: Response): Session | null | undefined {
    const token = plain.data.metadata ? plain.data.metadata.jwt : null;
    let authorizations = [];

    // Add authorizations from JWT
    if (token) {
      const isValid = jws.JWS.verifyJWT(token, swarmKey, {
        alg: ['RS256'],
        // @ts-ignore: date / number
        verifyAt: new Date(),
      });

      if (isValid) {
        const decodedToken: any = jws.JWS.readSafeJSONString(b64utoutf8(token.split('.')[1]));
        authorizations = decodedToken ? decodedToken.authorizations : [];
      }
    }

    return new Session({
      token: plain.data.token,
      refreshToken: plain.data.refresh_token || null,
      uuid: plain.data.metadata ? plain.data.metadata.uuid : null,
      sessionUuid: plain.data.session_uuid,
      authorizations,
      acl: plain.data.acls ? plain.data.acls : plain.data.acl ? plain.data.acl : [],
      tenantUuid: plain.data.metadata ? plain.data.metadata.tenant_uuid : undefined,
      expiresAt: moment.utc(plain.data.utc_expires_at).toDate(),
      stackUuid: plain.data.xivo_uuid,
      metadata: plain.data.metadata,
      // eslint-disable-next-line
      stackHostFromHeader: plain._headers?.get?.('wazo-stack-host'),
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
    acl,
    engineVersion,
    refreshToken,
    sessionUuid,
    stackUuid,
    metadata,
    stackHostFromHeader = undefined,
  }: SessionArguments) {
    this.token = token;
    this.uuid = uuid;
    this.tenantUuid = tenantUuid || null;
    this.profile = profile;
    this.expiresAt = expiresAt;
    this.authorizations = authorizations || [];
    this.acl = acl || [];
    this.engineVersion = engineVersion;
    this.refreshToken = refreshToken;
    this.sessionUuid = sessionUuid;
    this.stackUuid = stackUuid;
    this.metadata = metadata;
    this._stackHostFromHeader = stackHostFromHeader;
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

  primaryLine(): Line | null | undefined {
    return this.profile && this.profile.lines.length > 0 ? this.profile.lines[0] : null;
  }

  primarySipLine(): SipLine | null | undefined {
    return this.profile && this.profile.sipLines.length > 0 ? this.profile.sipLines[0] : null;
  }

  primaryWebRtcLine(): SipLine | null | undefined {
    return this.profile && (this.profile.sipLines || []).find(sipLine => sipLine && sipLine.isWebRtc());
  }

  primaryCtiLine(): SipLine | null | undefined {
    return this.profile && (this.profile.sipLines || []).find(sipLine => sipLine && !sipLine.isWebRtc());
  }

  getContact(): Contact {
    if (this.contact) {
      return this.contact;
    }

    const { email, firstName, lastName, mobileNumber, state, status } = this.profile || {};
    const number = this.primaryNumber() || '';
    const numbers = [{ label: 'primary', number }];

    if (mobileNumber) {
      numbers.push({ label: 'mobile', number: mobileNumber });
    }

    return new Contact({
      uuid: this.uuid || '',
      email,
      name: `${firstName} ${lastName}`,
      number,
      numbers,
      state: state || '',
      status,
      backend: 'wazo',
      source: 'default',
    });
  }

  primaryContext(): string {
    if (this.engineVersion) {
      if (this.hasEngineVersionGte(MINIMUM_WAZO_ENGINE_VERSION_FOR_DEFAULT_CONTEXT)) {
        return 'default';
      }
    }

    const line = this.primaryLine();
    return line && Array.isArray(line.extensions) && line.extensions.length > 0 ? line.extensions[0].context : 'default';
  }

  hasEngineVersionGte(version: string): boolean {
    return !!this.engineVersion && compareVersions(String(this.engineVersion), String(version)) >= 0;
  }

  primaryNumber(): string | null | undefined {
    const line = this.primaryLine();
    return line && Array.isArray(line.extensions) && line.extensions.length ? line.extensions[0].exten : null;
  }

  allLines(): Line[] {
    return this.profile ? this.profile.lines || [] : [];
  }

  allNumbers(): string[] {
    const extensions = this.allLines().map(line => line.extensions?.map(extension => extension.exten) || []);

    if (!extensions.length) {
      return [];
    }

    return extensions.reduce((a, b) => a.concat(b));
  }

  hasExtension(extension: string): boolean {
    return this.allNumbers().some(number => number === extension);
  }

  getHostFromHeader() {
    return this._stackHostFromHeader;
  }

  get acls(): Array<string> | null | undefined {
    console.warn('`acls` property of Session has been removed in Wazo\'s SDK, please use `acl` instead.');
    return this.acl;
  }

  get engineUuid(): string | null | undefined {
    console.warn('`engineUuid` property of Session has been removed in Wazo\'s SDK, please use `stackUuid` instead.');
    return this.stackUuid;
  }

  toJSON() {
    return {
      ...this,
      // Added `engineUuid` because of the getter, it won't be included in `JSON.stringify()` methods.
      engineUuid: this.engineUuid,
    };
  }
}
