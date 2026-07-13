export type RefreshTokenErrorReason = 'no_refresh_token' | 'empty_session';

export default class RefreshTokenError extends Error {
  reason: RefreshTokenErrorReason;

  constructor(reason: RefreshTokenErrorReason) {
    super(`Token refresh failed: ${reason}`);
    this.name = 'RefreshTokenError';
    this.reason = reason;
  }
}
