import type Contact from '../domain/Contact';
import getApiClient from '../service/getApiClient';

class Directory {
  async findMultipleContactsByNumber(numbers: string[]): Promise<Contact[]> {
    return getApiClient().dird.findMultipleContactsByNumber(numbers);
  }

}

if (!global.wazoDirectoryInstance) {
  global.wazoDirectoryInstance = new Directory();
}

export default global.wazoDirectoryInstance;
