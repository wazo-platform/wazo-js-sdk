import authMethods from './api/auth';
import ApiRequester from './utils/api-requester';
import IssueReporter from './service/IssueReporter';
import { obfuscateToken } from './utils/string';
import { AUTH_VERSION } from './constants';

export type ConstructorParams = {
  server: string;
  agent?: Record<string, any> | null | undefined;
  clientId?: string;
  refreshToken?: string | null | undefined;
  isMobile?: boolean | null | undefined;
  fetchOptions?: Record<string, any>;
};

const logger = IssueReporter ? IssueReporter.loggerFor('api') : console;

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

  constructor({
    server,
    agent = null,
    refreshToken,
    clientId,
    isMobile = false,
    fetchOptions,
  }: ConstructorParams) {
    this.updateParameters({
      server,
      agent,
      clientId,
      fetchOptions,
    });
    this.refreshToken = refreshToken;
    this.isMobile = isMobile || false;
  }

  initializeEndpoints(): void {
    this.auth = authMethods(this.client, `auth/${AUTH_VERSION}`);
  }

  updateParameters({ server, agent, clientId, fetchOptions }: Record<string, any>) {
    const refreshTokenCallback = this.refreshTokenCallback.bind(this);
    this.client = new ApiRequester({
      server,
      agent,
      refreshTokenCallback,
      clientId,
      fetchOptions,
    });
    this.initializeEndpoints();
  }

  async forceRefreshToken(): Promise<string | null> {
    logger.info('forcing refresh token, calling callback');
    return this.refreshTokenCallback();
  }

  async refreshTokenCallback(): Promise<string | null> {
    logger.info('refresh token callback called', {
      refreshToken: obfuscateToken(this.refreshToken),
      refreshBackend: this.refreshBackend,
      refreshTenantId: this.refreshTenantId,
      refreshDomainName: this.refreshDomainName,
      refreshExpiration: this.refreshExpiration,
      isMobile: this.isMobile,
    });

    if (!this.refreshToken) {
      return null;
    }

    try {
      const session = await this.auth.refreshToken(
        this.refreshToken,
        this.refreshBackend as string,
        this.refreshExpiration as number,
        this.isMobile,
        this.refreshTenantId as string,
        this.refreshDomainName as string,
      );
      if (!session) {
        return null;
      }

      logger.info('token refreshed', {
        token: obfuscateToken(session.token),
      });

      if (this.onRefreshToken) {
        this.onRefreshToken(session.token, session);
      }

      this.setToken(session.token);
      return session.token;
    } catch (error: any) {
      logger.error('token refresh, error', error);

      if (this.onRefreshTokenError) {
        this.onRefreshTokenError(error);
      }
    }

    return null;
  }

  setToken(token: string) {
    this.client.setToken(token);
  }

  setTenant(tenant: string) {
    this.client.setTenant(tenant);
  }

  setRefreshToken(refreshToken: string | null | undefined) {
    this.refreshToken = refreshToken;
  }

  setRequestTimeout(requestTimeout: number) {
    this.client.setRequestTimeout(requestTimeout);
  }

  setClientId(clientId: string | null | undefined) {
    this.client.clientId = clientId;
  }

  setOnRefreshToken(onRefreshToken: (...args: Array<any>) => any) {
    this.onRefreshToken = onRefreshToken;
  }

  setOnRefreshTokenError(callback: (...args: Array<any>) => any) {
    this.onRefreshTokenError = callback;
  }

  setRefreshExpiration(refreshExpiration: number) {
    this.refreshExpiration = refreshExpiration;
  }

  setRefreshBackend(refreshBackend: string) {
    this.refreshBackend = refreshBackend;
  }

  setRefreshTenantId(tenantId: string | null | undefined) {
    console.warn('Use of `setRefreshTenantId` is deprecated, use `setRefreshDomainName` instead');
    this.refreshTenantId = tenantId;
  }

  setRefreshDomainName(domainName: string | null | undefined) {
    this.refreshDomainName = domainName;
  }

  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }

  setFetchOptions(fetchOptions: Record<string, any>) {
    this.fetchOptions = fetchOptions;
    this.client.setFetchOptions(fetchOptions);
  }

  disableErrorLogging() {
    this.client.disableErrorLogging();
  }
}
