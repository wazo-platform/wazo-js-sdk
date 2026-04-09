import Profile from './Profile';
import Contact from './Contact';
import Line from './Line';
import SipLine from './SipLine';
import type { UUID, Token } from './types';
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
    [key: string]: any;
} | null | undefined;
export type Response = {
    _headers: Headers;
    data: {
        token: Token;
        refresh_token?: Token;
        session_uuid: UUID;
        acls?: Array<string>;
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
    engineUuid?: string | null | undefined;
    stackUuid?: string | null | undefined;
    stackHostFromHeader?: string | null | undefined;
    metadata?: SessionMetadata;
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
    static parse(plain: Response): Session | null | undefined;
    static newFrom(profile: Session): any;
    constructor({ token, uuid, tenantUuid, profile, expiresAt, authorizations, acl, engineVersion, refreshToken, sessionUuid, stackUuid, metadata, stackHostFromHeader, }: SessionArguments);
    hasExpired(date?: Date): boolean;
    is(contact: Contact): boolean;
    using(profile: Profile): Session;
    hasAuthorizations(): boolean;
    displayName(): string;
    hasAccessToVoicemail(): boolean;
    primaryLine(): Line | null | undefined;
    primarySipLine(): SipLine | null | undefined;
    primaryWebRtcLine(): SipLine | null | undefined;
    primaryCtiLine(): SipLine | null | undefined;
    getContact(): Contact;
    primaryContext(): string;
    hasEngineVersionGte(version: string): boolean;
    primaryNumber(): string | null | undefined;
    allLines(): Line[];
    allNumbers(): string[];
    hasExtension(extension: string): boolean;
    getHostFromHeader(): string | null | undefined;
    get acls(): Array<string> | null | undefined;
    /**
     * @deprecated Use `stackUuid` instead.
     */
    get engineUuid(): string | null | undefined;
    toJSON(): this & {
        engineUuid: string | null | undefined;
    };
}
export {};
//# sourceMappingURL=Session.d.ts.map