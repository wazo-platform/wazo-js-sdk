import type Contact from '../domain/Contact';
import getApiClient from '../service/getApiClient';

class Directory {
  async findMultipleContactsByNumber(numbers: string[], fields?: Record<string, any>): Promise<Contact[]> {
    return getApiClient().dird.findMultipleContactsByNumber(numbers, fields);
  }

}

if (!global.wazoDirectoryInstance) {
  global.wazoDirectoryInstance = new Directory();
}

export default global.wazoDirectoryInstance;
