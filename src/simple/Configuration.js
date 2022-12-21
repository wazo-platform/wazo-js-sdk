import Auth from './Auth';
import getApiClient from '../service/getApiClient';

class Configuration {

  async getCurrentUser() {
    const session = Auth.getSession();
    return getApiClient().confd.getUser(session ? session.uuid : '');
  }

}

if (!global.wazoConfigurationInstance) {
  global.wazoConfigurationInstance = new Configuration();
}

export default global.wazoConfigurationInstance;
