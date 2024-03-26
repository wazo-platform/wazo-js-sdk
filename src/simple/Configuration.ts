import Auth from './Auth';
import getApiClient from '../service/getApiClient';
import Profile from '../domain/Profile';

class Configuration {
  async getCurrentUser(): Promise<Profile> {
    const session = Auth.getSession();
    return getApiClient().confd.getUser(`${session ? session.uuid : ''}`);
  }

}

const instance = new Configuration();

if (!global.wazoConfigurationInstance) {
  global.wazoConfigurationInstance = instance;
}

export default instance;
