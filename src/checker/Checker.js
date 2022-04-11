// @flow

import type Session from '../domain/Session';
import WazoApiClient from '../api-client';
import IssueReporter from '../service/IssueReporter';

import checks from './checks/index';

const logger = IssueReporter.loggerFor('engine-check');

class Checker {
  session: Session;
  server: string;
  externalAppConfig: Object;
  checks: Object[];

  constructor(server: string, session: Session, externalAppConfig: Object = {}) {
    this.server = server;
    this.session = session;
    this.externalAppConfig = externalAppConfig;
    this.checks = [...checks];
  }

  async check(onCheckBegin: Function = () => {}, onCheckResult: Function = () => {}) {
    await this._addEngineVersion();

    logger.info('Engine check starting', { code: 'start-engine-check' });

    for (let i = 0; i < this.checks.length; i++) {
      const { name, check } = this.checks[i];

      logger.info(`Checking ${name} ...`, { code: `checking-${name}` });

      onCheckBegin(name);
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await check(this.server, this.session, this.externalAppConfig);
        logger.info(`Checking ${name} success.`, { result, code: `check-${name}-success` });

        onCheckResult(name, result);
      } catch (e) {
        e.code = `check-${name}-failed`;
        logger.info(`Checking ${name} failure`, { message: e.message });

        onCheckResult(name, e);
      }
    }

    logger.info('Engine check done.', { code: 'check-engine-done' });
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
