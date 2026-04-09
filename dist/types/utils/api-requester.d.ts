type ConstructorParams = {
    server: string;
    agent: Record<string, any> | null | undefined;
    clientId: string | null | undefined;
    refreshTokenCallback: (...args: Array<any>) => any;
    token?: string | null;
    fetchOptions: Record<string, any> | null | undefined;
    requestTimeout?: number | null;
};
type Methods = 'head' | 'get' | 'post' | 'put' | 'delete' | 'options';
type CallMethod = 'head' | 'get' | 'post' | 'put' | 'delete' | 'options';
type CallBody = Record<string, any> | null | undefined | string;
type CallHeaders = {
    'Wazo-Tenant'?: boolean | string | null;
    [key: string]: any;
} | null | undefined;
type CallParser = ((...args: Array<any>) => any) | undefined;
type CallParams = {
    path: string;
    body?: CallBody;
    headers?: CallHeaders;
    parse?: CallParser;
    firstCall?: boolean;
};
type CallHelpers = {
    (options: CallParams): Promise<any>;
    (path: string, body?: CallBody, headers?: CallHeaders, parse?: CallParser, firstCall?: boolean): Promise<any>;
};
export default class ApiRequester {
    server: string;
    agent: Record<string, any> | null | undefined;
    clientId: string | null | undefined;
    token: string;
    tenant: string | null | undefined;
    fetchOptions: Record<string, any>;
    refreshTokenCallback: (...args: Array<any>) => any;
    refreshTokenPromise: Promise<any> | null | undefined;
    shouldLogErrors: boolean;
    requestTimeout: number;
    head: CallHelpers;
    get: CallHelpers;
    post: CallHelpers;
    put: CallHelpers;
    delete: CallHelpers;
    options: CallHelpers;
    static successResponseParser(response: Record<string, any>): boolean;
    static defaultParser(response: Record<string, any>): any;
    static getQueryString(obj: Record<string, any>): string;
    static base64Encode(str: string): string;
    constructor({ server, refreshTokenCallback, clientId, agent, token, fetchOptions, requestTimeout, }: ConstructorParams);
    setRequestTimeout(requestTimeout: number): void;
    setTenant(tenant: string | null | undefined): void;
    setToken(token: string): void;
    setFetchOptions(options: Record<string, any>): void;
    disableErrorLogging(): void;
    enableErrorLogging(): void;
    call({ path, method, body, headers, parse, firstCall, }: CallParams & {
        method: Methods;
    }): Promise<any>;
    _checkTokenExpired(response: Record<string, any>, err: Record<string, any>): any;
    _isTokenNotFound(err: Record<string, any>): any;
    _replayWithNewToken(err: Record<string, any>, path: string, method: CallMethod, body?: CallBody, headers?: CallHeaders, parse?: CallParser): Promise<any> | undefined;
    getHeaders(header: CallHeaders): Record<string, any>;
    computeUrl(method: CallMethod, path: string, body: CallBody): string;
    get baseUrl(): string;
}
export {};
//# sourceMappingURL=api-requester.d.ts.map