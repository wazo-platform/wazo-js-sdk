import authMethods from './api/auth';
import RefreshTokenError, { type RefreshTokenErrorReason } from './domain/RefreshTokenError';
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

  refreshTokenErrorNotified = false;

  // The single in-flight refresh, shared by every entry point (401 replay, forceRefreshToken,
  // requesters recreated by updateParameters) so concurrent callers never race two refreshes.
  refreshTokenPromise: Promise<string | null> | null = null;

  // Bumped on every successful refresh and every setRefreshToken(newToken). A refresh attempt
  // captures the current value at start; if it later fails against a newer generation, its
  // failure is stale (superseded by fresh credentials) and must not notify the consumer.
  refreshTokenGeneration = 0;

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
    // Dedup: collapse concurrent callers onto a single in-flight refresh. Every entry point
    // (401 replay, forceRefreshToken, requesters recreated by updateParameters) reaches this
    // method, so this is the one place that guarantees a single auth.refreshToken call.
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const generation = this.refreshTokenGeneration;
    const promise = this.performTokenRefresh(generation);
    this.refreshTokenPromise = promise;

    try {
      return await promise;
    } finally {
      // Only clear the pointer if it still points at our attempt. A concurrent setRefreshToken
      // (or newer caller) may have replaced it with a fresher in-flight promise, which we must
      // not wipe or we'd re-enable overlapping refreshes.
      if (this.refreshTokenPromise === promise) {
        this.refreshTokenPromise = null;
      }
    }
  }

  async performTokenRefresh(generation: number): Promise<string | null> {
    logger.info('refresh token callback called', {
      refreshToken: obfuscateToken(this.refreshToken),
      refreshBackend: this.refreshBackend,
      refreshTenantId: this.refreshTenantId,
      refreshDomainName: this.refreshDomainName,
      refreshExpiration: this.refreshExpiration,
      isMobile: this.isMobile,
    });

    if (!this.refreshToken) {
      this.notifyRefreshTokenError(new RefreshTokenError('no_refresh_token'), 'no_refresh_token', generation);
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
        this.notifyRefreshTokenError(new RefreshTokenError('empty_session'), 'empty_session', generation);
        return null;
      }

      // A newer refresh or setRefreshToken superseded this attempt while it was in flight: its
      // result is stale, so don't overwrite the fresher credentials the winning attempt applied.
      if (generation !== this.refreshTokenGeneration) {
        logger.info('ignoring stale token refresh success');
        return null;
      }

      logger.info('token refreshed', {
        token: obfuscateToken(session.token),
      });

      // Re-arm the one-shot error notification and supersede any older in-flight attempt now
      // that a refresh has succeeded.
      this.refreshTokenErrorNotified = false;
      this.refreshTokenGeneration += 1;

      // Apply the token before notifying, so a throwing onRefreshToken handler can't cause the
      // freshly obtained token to be dropped (and misreported as a stale failure).
      this.setToken(session.token);

      if (this.onRefreshToken) {
        try {
          this.onRefreshToken(session.token, session);
        } catch (e) {
          logger.error('onRefreshToken handler failed', e);
        }
      }

      return session.token;
    } catch (error: any) {
      logger.error('token refresh, error', error);
      this.notifyRefreshTokenError(error, undefined, generation);
    }

    return null;
  }

  notifyRefreshTokenError(error: Error, reason?: RefreshTokenErrorReason, generation: number = this.refreshTokenGeneration) {
    // A newer successful refresh or a new refresh token supersedes this attempt: its failure is
    // stale, so ignore it rather than logging out a user who just received fresh credentials.
    if (generation !== this.refreshTokenGeneration) {
      logger.info('ignoring stale token refresh failure', { reason });
      return;
    }

    if (reason) {
      // Always log, so persistent refresh failures stay visible in the field (the reason
      // this PR exists) even after the consumer has been notified.
      logger.error('token refresh failed', { reason });
    }

    // Consume the one-shot only when a handler is actually invoked. Otherwise an early 401
    // (before the consumer wires setOnRefreshTokenError) would silently burn the notification,
    // and a handler registered later would never hear about the persistent failure.
    if (!this.onRefreshTokenError) {
      return;
    }

    // Refresh failures are persistent: every expired-token 401 retriggers a refresh that fails
    // the same way (a missing token, an empty session, or a revoked refresh token rejecting with
    // a 401). Notify the consumer only once until a refresh succeeds or a new refresh token is
    // set, otherwise a burst of failing requests would fire a burst of callbacks (and possibly
    // repeated logouts).
    if (this.refreshTokenErrorNotified) {
      return;
    }
    this.refreshTokenErrorNotified = true;

    try {
      this.onRefreshTokenError(error);
    } catch (e) {
      logger.error('onRefreshTokenError handler failed', e);
    }
  }

  setToken(token: string) {
    this.client.setToken(token);
  }

  setTenant(tenant: string) {
    this.client.setTenant(tenant);
  }

  setRefreshToken(refreshToken: string | null | undefined) {
    const changed = refreshToken !== this.refreshToken;
    this.refreshToken = refreshToken;

    if (refreshToken) {
      this.refreshTokenErrorNotified = false;

      // Only a *different* token supersedes an in-flight refresh. Re-setting the identical token
      // (e.g. consumers rehydrating credentials on app resume) must not bump the generation, or a
      // refresh already running with that same token would have its success discarded as stale.
      if (changed) {
        // New credentials supersede any in-flight refresh: bump the generation so a still-running
        // stale attempt's failure is ignored, and drop the shared promise so the next caller
        // refreshes with the new token instead of awaiting the stale one.
        this.refreshTokenGeneration += 1;
        this.refreshTokenPromise = null;
        // ApiRequester keeps its own in-flight cache for 401 replays; drop it too, otherwise the
        // next _replayWithNewToken keeps awaiting the superseded refresh (old token) instead of
        // starting a fresh one with the new token.
        this.client.refreshTokenPromise = null;
      }
    }
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
