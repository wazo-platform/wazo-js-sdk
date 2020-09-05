// @flow

import type Session from '../domain/Session';
import WazoApiClient from '../api-client';

import checks from './checks/index';

class Checker {
  session: Session;
  server: string;

  constructor(server: string, session: Session) {
    this.server = server;
    this.session = session;
  }

  async check(onCheckBegin: Function = () => {}, onCheckResult: Function = () => {}) {
    await this._addEngineVersion();

    for (let i = 0; i < checks.length; i++) {
      const { name, check } = checks[i];

      onCheckBegin(name);
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await check(this.server, this.session);
        onCheckResult(name, result);
      } catch (e) {
        onCheckResult(name, e);
      }
    }
  }

  async _addEngineVersion() {
    if (!this.session.engineVersion) {
      const apiClient = new WazoApiClient({ server: this.server });
      apiClient.setToken(this.session.token);

      const { wazo_version: engineVersion } = await apiClient.confd.getInfos();
      this.session.engineVersion = engineVersion;
    }
  }
}

export default Checker;
