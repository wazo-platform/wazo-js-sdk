// @flow
import getApiClient from '../service/getApiClient';

class Directory {

  async findMultipleContactsByNumber(numbers: string[]) {
    return getApiClient().dird.findMultipleContactsByNumber(numbers);
  }

}

if (!global.wazoDirectoryInstance) {
  global.wazoDirectoryInstance = new Directory();
}

export default global.wazoDirectoryInstance;
