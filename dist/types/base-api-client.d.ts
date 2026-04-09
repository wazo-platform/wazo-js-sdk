import authMethods from './api/auth';
import ApiRequester from './utils/api-requester';
export type ConstructorParams = {
    server: string;
    agent?: Record<string, any> | null | undefined;
    clientId?: string;
    refreshToken?: string | null | undefined;
    isMobile?: boolean | null | undefined;
    fetchOptions?: Record<string, any>;
};
export default class BaseApiClient {
    client: ApiRequester;
    auth: ReturnType<typeof authMethods>;
    refreshToken: string | null | undefined;
    onRefreshToken: ((...args: Array<any>) => any) | null | undefined;
    onRefreshTokenError: ((...args: Array<any>) => any) | null | undefined;
    refreshExpiration: number | null | undefined;
    refreshBackend: string | null | undefined;
    refreshTenantId: string | null | undefined;
    refreshDomainName: string | null | undefined;
    isMobile: boolean;
    fetchOptions: Record<string, any>;
    constructor({ server, agent, refreshToken, clientId, isMobile, fetchOptions, }: ConstructorParams);
    initializeEndpoints(): void;
    updateParameters({ server, agent, clientId, fetchOptions }: Record<string, any>): void;
    forceRefreshToken(): Promise<string | null>;
    refreshTokenCallback(): Promise<string | null>;
    setToken(token: string): void;
    setTenant(tenant: string): void;
    setRefreshToken(refreshToken: string | null | undefined): void;
    setRequestTimeout(requestTimeout: number): void;
    setClientId(clientId: string | null | undefined): void;
    setOnRefreshToken(onRefreshToken: (...args: Array<any>) => any): void;
    setOnRefreshTokenError(callback: (...args: Array<any>) => any): void;
    setRefreshExpiration(refreshExpiration: number): void;
    setRefreshBackend(refreshBackend: string): void;
    setRefreshTenantId(tenantId: string | null | undefined): void;
    setRefreshDomainName(domainName: string | null | undefined): void;
    setIsMobile(isMobile: boolean): void;
    setFetchOptions(fetchOptions: Record<string, any>): void;
    disableErrorLogging(): void;
}
//# sourceMappingURL=base-api-client.d.ts.map