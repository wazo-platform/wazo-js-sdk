// @flow
/* eslint-disable max-classes-per-file */
import Session from '../domain/Session';
import { DETAULT_EXPIRATION } from '../api/auth';
import getApiClient, {
  setCurrentServer,
  setApiToken,
  setRefreshToken,
  setApiClientId,
  setRefreshExpiration,
  setOnRefreshToken,
} from '../service/getApiClient';

import Wazo from './index';

export class InvalidSubscription extends Error {}
export class InvalidAuthorization extends Error {}

class Auth {
  clientId: string;
  expiration: number;
  minSubscriptionType: number;
  authorizationName: ?string;
  host: ?string;
  session: ?Session;
  onRefreshTokenCallback: ?Function;
  authenticated: boolean;
  mobile: boolean;

  constructor() {
    this.expiration = DETAULT_EXPIRATION;
    this.authenticated = false;
  }

  init(clientId: string, expiration: number, minSubscriptionType: number, authorizationName: ?string, mobile: boolean) {
    this.clientId = clientId;
    this.expiration = expiration;
    this.minSubscriptionType = minSubscriptionType;
    this.authorizationName = authorizationName;
    this.host = null;
    this.session = null;
    this.mobile = mobile || false;

    setApiClientId(this.clientId);
    setRefreshExpiration(this.expiration);
    setOnRefreshToken((token: string, session: Session) => {
      setApiToken(token);
      Wazo.Websocket.updateToken(token);

      if (this.onRefreshTokenCallback) {
        this.onRefreshTokenCallback(token, session);
      }
    });
  }

  async logIn(username: string, password: string) {
    const rawSession = await getApiClient().auth.logIn({
      username,
      password,
      expiration: this.expiration,
      mobile: this.mobile,
    });
    return this._onAuthenticated(rawSession);
  }

  async logInViaRefreshToken(refreshToken: string) {
    const rawSession = await getApiClient().auth.refreshToken(refreshToken, null, this.expiration, this.mobile);
    return this._onAuthenticated(rawSession);
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
      const rawSession = await getApiClient().auth.authenticate(token);
      return this._onAuthenticated(rawSession);
    } catch (e) {
      return false;
    }
  }

  async generateNewToken(refreshToken: string) {
    return getApiClient().auth.refreshToken(refreshToken, null, this.expiration);
  }

  async logout(deleteRefreshToken: boolean = true) {
    try {
      Wazo.Websocket.close();

      if (this.clientId && deleteRefreshToken) {
        await getApiClient().auth.deleteRefreshToken(this.clientId);
      }
    } catch (e) {
      // Nothing to
    }

    try {
      await getApiClient().auth.logOut(this.session ? this.session.token : null);
    } catch (e) {
      // Nothing to
    }

    this.session = null;
    this.authenticated = false;
  }

  setOnRefreshToken(callback: Function) {
    this.onRefreshTokenCallback = callback;
  }

  checkAuthorizations(session: Session, authorizationName: ?string) {
    if (!authorizationName) {
      return;
    }
    const { authorizations } = session;
    if (!authorizations.find(authorization => authorization.rules.find(rule => rule.name === authorizationName))) {
      throw new InvalidAuthorization(`No authorization '${authorizationName || ''}' found for your account.`);
    }
  }

  checkSubscription(session: Session, minSubscriptionType: number) {
    const userSubscriptionType = session.profile ? session.profile.subscriptionType : null;
    if (!userSubscriptionType || userSubscriptionType <= minSubscriptionType) {
      const message = `Invalid subscription ${userSubscriptionType || ''}, required at least ${minSubscriptionType}`;
      throw new InvalidSubscription(message);
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

  getFirstName(): string {
    if (!this.session || !this.session.profile) {
      return '';
    }
    return this.session.profile.firstName;
  }

  getLastName(): string {
    if (!this.session || !this.session.profile) {
      return '';
    }

    return this.session.profile.lastName;
  }

  setClientId(clientId: string) {
    this.clientId = clientId;

    setApiClientId(this.clientId);
  }

  getName() {
    return `${this.getFirstName()} ${this.getLastName()}`;
  }

  async _onAuthenticated(rawSession: Session) {
    if (this.authenticated && this.session) {
      return this.session;
    }
    const session = rawSession;
    if (!session) {
      return null;
    }

    setApiToken(session.token);

    try {
      const [profile, { wazo_version: engineVersion }] = await Promise.all([
        getApiClient().confd.getUser(session.uuid),
        getApiClient().confd.getInfos(),
      ]);

      session.engineVersion = engineVersion;
      session.profile = profile;

      this.checkAuthorizations(session, this.authorizationName);
      this.checkSubscription(session, this.minSubscriptionType);
    } catch (e) {
      // Destroy tokens when validation fails
      if (this.clientId) {
        await getApiClient().auth.deleteRefreshToken(this.clientId);
      }
      if (session) {
        await getApiClient().auth.logOut(session.token);
      }

      throw e;
    }

    try {
      const sipLines = await getApiClient().confd.getUserLinesSip(
        session.uuid,
        // $FlowFixMe
        session.profile.lines.map(line => line.id),
      );

      // $FlowFixMe
      session.profile.sipLines = sipLines.filter(line => !!line);
    } catch (e) {
      // When an user has only a sccp line, getSipLines return a 404
    }

    this.authenticated = true;

    Wazo.Websocket.open(this.host, session);

    this.session = session;

    return session;
  }
}

if (!global.wazoAuthInstance) {
  global.wazoAuthInstance = new Auth();
}

export default global.wazoAuthInstance;
