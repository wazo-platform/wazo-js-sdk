// @flow
/* eslint-disable max-classes-per-file */
import semver from 'semver';
import { realFetch } from '../utils/api-requester';

export class InvalidVersion extends Error {}

class VersionChecker {
  key: string;
  versions: Object;
  fetchPromise: ?Promise<any>;

  constructor() {
    this.versions = {};
  }

  setKey(key: string) {
    this.key = key;
  }

  async fetchFile(fileUrl: string) {
    this.fetchPromise = realFetch()(fileUrl).then(response => {
      return response.json().then((versions: Object) => {
        this.versions = versions;
        this.fetchPromise = null;
      }).catch(() => {
        this.fetchPromise = null;
      });
    }).catch(() => {
      this.fetchPromise = null;
    });

    return this.fetchPromise;
  }

  async canAccess(engineVersion: string, appVersion: string): Promise<boolean> {
    if (this.fetchPromise) {
      await this.fetchPromise;
    }

    if (!(engineVersion in this.versions)) {
      return true;
    }

    const engine = this.versions[engineVersion];
    if (!(this.key in engine)) {
      return true;
    }

    const { min, max } = engine[this.key];
    if (min && semver.gt(min, appVersion)) {
      return false;
    }

    if (max && semver.lt(max, appVersion)) {
      return false;
    }

    return true;
  }
}

export default new VersionChecker();
