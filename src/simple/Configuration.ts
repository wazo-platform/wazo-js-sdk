import Auth from './Auth';
import getApiClient from '../service/getApiClient';
import Profile from '../domain/Profile';

class Configuration {
  async getCurrentUser(): Promise<Profile> {
    const session = Auth.getSession();
    return getApiClient().confd.getUser(session ? session.uuid : '');
  }

}

if (!global.wazoConfigurationInstance) {
  global.wazoConfigurationInstance = new Configuration();
}

export default global.wazoConfigurationInstance;
