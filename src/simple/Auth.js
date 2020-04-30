// @flow
import type Session from '../domain/Session';
import getApiClient, {
  setCurrentServer,
  setApiToken,
  setRefreshToken,
  setApiClientId,
  setRefreshExpiration,
  setOnRefreshToken,
} from '../service/getApiClient';
import Wazo from './index';

class Auth {
  clientId: string;
  expiration: number;
  minSubscriptionType: number;
  host: ?string;
  session: ?Session;
  onRefreshTokenCallback: ?Function;

  init(clientId: string, expiration: number, minSubscriptionType: number) {
    this.clientId = clientId;
    this.expiration = expiration;
    this.minSubscriptionType = minSubscriptionType;
    this.host = null;
    this.session = null;

    setApiClientId(this.clientId);
    setRefreshExpiration(this.expiration);
    setOnRefreshToken(token => {
      setApiToken(token);
      Wazo.Websocket.updateToken(token);

      if (this.onRefreshTokenCallback) {
        this.onRefreshTokenCallback(token);
      }
    });
  }

  async logIn(username: string, password: string) {
    const session = await getApiClient().auth.logIn({ username, password, expiration: this.expiration });
    await this._onAuthenticated(session);

    return session;
  }

  async validateToken(token: string, refreshToken: string) {
    if (!token) {
      return null;
    }

    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    // Check if the token is valid
    try {
      const session = await getApiClient().auth.authenticate(token);
      await this._onAuthenticated(session);

      return session;
    } catch (e) {
      return false;
    }
  }

  async generateNewToken(refreshToken: string) {
    return getApiClient().auth.refreshToken(refreshToken, null, this.expiration);
  }

  async logout() {
    try {
      Wazo.Websocket.close();

      await getApiClient().auth.deleteRefreshToken(this.clientId);
    } catch (e) {
      // Nothing to
    }

    try {
      await getApiClient().auth.logOut(this.session ? this.session.token : null);
    } catch (e) {
      // Nothing to
    }

    this.session = null;
  }

  setOnRefreshToken(callback: Function) {
    this.onRefreshTokenCallback = callback;
  }

  checkSubscription(session: Session, minSubscriptionType: number) {
    const userSubscriptionType = session.profile ? session.profile.subscriptionType : null;
    if (!userSubscriptionType || userSubscriptionType <= minSubscriptionType) {
      throw new Error(`Invalid subscription ${userSubscriptionType || ''}, required at least ${minSubscriptionType}`);
    }
  }

  setHost(host: string) {
    this.host = host;

    setCurrentServer(host);
  }

  getHost() {
    return this.host;
  }

  getSession() {
    return this.session;
  }

  async _onAuthenticated(rawSession: Session) {
    const session = rawSession;
    if (!session) {
      return null;
    }

    setApiToken(session.token);

    session.profile = await getApiClient().confd.getUser(session.uuid);

    this.session = session;

    this.checkSubscription(session, this.minSubscriptionType);

    return Wazo.Websocket.open(this.host, session);
  }
}

if (!global.wazoAuthInstance) {
  global.wazoAuthInstance = new Auth();
}

export default global.wazoAuthInstance;
