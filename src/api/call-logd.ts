import ApiRequester from '../utils/api-requester';
import CallLog from '../domain/CallLog';

export default ((client: ApiRequester, baseUrl: string) => ({
  search: (search: string, limit = 5): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    search,
    limit,
  }).then(CallLog.parseMany),

  searchBy: (field: string, value: string, limit = 5): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    [field]: value,
    limit,
  }).then(CallLog.parseMany),

  listCallLogs: (offset?: number, limit = 5): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    offset,
    limit,
  }).then(CallLog.parseMany),

  listDistinctCallLogs: (offset: number, limit = 5, distinct?: string): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    offset,
    limit,
    distinct,
  }).then(CallLog.parseMany),

  listCallLogsFromDate: (from: Date, number: string): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    from: from.toISOString(),
    number,
  }).then(CallLog.parseMany),
}));
