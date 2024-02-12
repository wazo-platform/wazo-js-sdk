import Auth from './Auth';
import getApiClient from '../service/getApiClient';
import Profile from '../domain/Profile';

class Configuration {
  async getCurrentUser(): Promise<Profile | undefined> {
    const session = Auth.getSession();
    const { uuid } = session || {};
    if (!uuid) {
      return Promise.resolve(undefined);
    }
    return getApiClient().confd.getUser(uuid);
  }

}

if (!global.wazoConfigurationInstance) {
  global.wazoConfigurationInstance = new Configuration();
}

export default global.wazoConfigurationInstance as Configuration;
