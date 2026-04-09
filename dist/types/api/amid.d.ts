import ApiRequester from '../utils/api-requester';
declare const _default: (client: ApiRequester, baseUrl: string) => {
    action: (action: string, args?: Record<string, any>) => Promise<string>;
    getAors: (endpoint: string) => Promise<any[]>;
};
export default _default;
//# sourceMappingURL=amid.d.ts.map