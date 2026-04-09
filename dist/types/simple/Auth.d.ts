import Session from '../domain/Session';
export declare class InvalidSubscription extends Error {
}
export declare class InvalidAuthorization extends Error {
}
export declare class NoTenantIdError extends Error {
}
export declare class NoDomainNameError extends Error {
}
export declare class NoSamlRouteError extends Error {
}
export declare class SamlConfigError extends Error {
}
export declare class Auth {
    clientId: string;
    expiration: number;
    minSubscriptionType: number | null;
    authorizationName: string | null;
    host: string | null;
    session: Session | null;
    onRefreshTokenCallback?: (token: string, session: Session) => void;
    onRefreshTokenCallbackError?: (error: any) => void;
    onHostFromHeadersCallback?: (stackHostFromHeaders: string) => void;
    authenticated: boolean;
    mobile: boolean;
    BACKEND_WAZO: string;
    BACKEND_LDAP: string;
    usingEdgeServer: boolean | undefined;
    onSetUsingEdgeServer?: (usingEdgeServer: boolean) => void;
    constructor();
    init(clientId: string, expiration: number, minSubscriptionType: number | null | undefined, authorizationName: string | null, mobile: boolean): void;
    setFetchOptions(options: Record<string, any>): void;
    logIn(username: string, password: string, backend?: string, extra?: string | Record<string, any>): Promise<Session | null>;
    samlLogIn(samlSessionId: string): Promise<Session | null>;
    samlLogOut(): Promise<void | {
        location: string;
    }>;
    initiateIdpAuthentication(domain: string, redirectUrl: string): Promise<{
        location: string;
        saml_session_id: string;
    } | undefined>;
    logInViaRefreshToken(refreshToken: string): Promise<Session | null>;
    validateToken(token: string, refreshToken?: string, headerUserUuid?: string): Promise<Session | undefined | null>;
    generateNewToken(refreshToken: string): Promise<Session | null | undefined>;
    logout(deleteRefreshToken?: boolean, saml?: boolean): Promise<void | {
        location: string;
    }>;
    setOnHostFromHeaders(callback: (hostFromHeaders: string) => void): void;
    setOnSetUsingEdgeServer(callback: (usingEdgeServer: boolean) => void): void;
    setOnRefreshToken(callback: (...args: Array<any>) => any): void;
    setOnRefreshTokenError(callback: (...args: Array<any>) => any): void;
    checkAuthorizations(session: Session, authorizationName: string | null | undefined): void;
    checkSubscription(session: Session, minSubscriptionType: number): void;
    setHost(host: string): void;
    setApiToken(token: string): void;
    setRefreshToken(refreshToken: string): void;
    setRefreshTenantId(refreshTenantId: string): void;
    setRefreshDomainName(domainName: string): void;
    setRequestTimeout(requestTimeout: number): void;
    forceRefreshToken(): Promise<string | null>;
    setIsMobile(mobile: boolean): void;
    getHost(): string | undefined;
    getSession(): Session | undefined;
    getFirstName(): string;
    getLastName(): string;
    setClientId(clientId: string): void;
    getName(): string;
    _getHttpUserUuidHeaders(uuid: string): any;
    setHttpUserUuidHeader(uuid: string): void;
    checkHttpUserUuidHeader(uuid: string | null | undefined): Promise<void>;
    _onAuthenticated(rawSession: Session): Promise<Session | null>;
}
declare const _default: Auth;
export default _default;
//# sourceMappingURL=Auth.d.ts.map