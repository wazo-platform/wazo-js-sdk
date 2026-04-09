import ApiRequester from '../utils/api-requester';
import CallLog, { CallLogQueryParams } from '../domain/CallLog';
type ListCallLogsQueryParams = Exclude<CallLogQueryParams, 'offset' | 'limit'>;
declare const _default: (client: ApiRequester, baseUrl: string) => {
    search: (search: string, limit?: number) => Promise<Array<CallLog>>;
    searchBy: (field: string, value: string, limit?: number) => Promise<Array<CallLog>>;
    listCallLogs: (offset?: number, limit?: number, queryParameters?: ListCallLogsQueryParams) => Promise<Array<CallLog>>;
    listDistinctCallLogs: (offset: number, limit?: number, distinct?: string) => Promise<Array<CallLog>>;
    listCallLogsFromDate: (from: Date, number: string) => Promise<Array<CallLog>>;
};
export default _default;
//# sourceMappingURL=call-logd.d.ts.map