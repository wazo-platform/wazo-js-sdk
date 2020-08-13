// @flow
import getApiClient from '../service/getApiClient';

class Configuration {

  async getCurrentUser() {
    return getApiClient().confd.getUser(Wazo.Auth.getSession().uuid);
  }

}

if (!global.wazoConfigurationInstance) {
    global.wazoConfigurationInstance = new Configuration();
}

export default global.wazoConfigurationInstance;
