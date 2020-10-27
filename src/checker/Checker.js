// @flow

import type Session from '../domain/Session';
import WazoApiClient from '../api-client';
import IssueReporter from '../service/IssueReporter';

import checks from './checks/index';

const logger = IssueReporter.loggerFor('engine-check');

class Checker {
  session: Session;
  server: string;
  checks: Object[];

  constructor(server: string, session: Session) {
    this.server = server;
    this.session = session;
    this.checks = [...checks];
  }

  async check(onCheckBegin: Function = () => {}, onCheckResult: Function = () => {}) {
    await this._addEngineVersion();

    logger(logger.INFO, 'Engine check starting');

    for (let i = 0; i < this.checks.length; i++) {
      const { name, check } = this.checks[i];

      logger(logger.INFO, `Checking ${name} ...`);

      onCheckBegin(name);
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await check(this.server, this.session);
        logger(logger.INFO, `Checking ${name} success.`, { result });

        onCheckResult(name, result);
      } catch (e) {
        logger(logger.INFO, `Checking ${name} failure`, { message: e.message });

        onCheckResult(name, e);
      }
    }

    logger(logger.INFO, 'Engine check done.');
  }

  addCheck(check: Object) {
    this.checks.push(check);
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
