type Logger = {
    TRACE: string;
    DEBUG: string;
    INFO: string;
    LOG: string;
    WARN: string;
    ERROR: string;
};
type LoggerWithMethods = Logger & {
    trace: (...args: any) => void;
    debug: (...args: any) => void;
    info: (...args: any) => void;
    log: (...args: any) => void;
    warn: (...args: any) => void;
    error: (...args: any) => void;
    apply: (this: Logger, ...args: any) => void;
};
declare class IssueReporter {
    TRACE: string;
    INFO: string;
    LOG: string;
    WARN: string;
    ERROR: string;
    oldConsoleMethods: Record<string, any> | null;
    enabled: boolean;
    remoteClientConfiguration: Record<string, any> | null | undefined;
    buffer: Record<string, any>[];
    bufferTimeout: any | null | undefined;
    _boundProcessBuffer: (...args: Array<any>) => any;
    _boundParseLoggerBody: (...args: Array<any>) => any;
    _callback: ((...args: Array<any>) => any) | null | undefined;
    constructor();
    init(): void;
    setCallback(cb: (...args: Array<any>) => any): void;
    configureRemoteClient(configuration?: Record<string, any>): void;
    enable(): void;
    disable(): void;
    loggerFor(category: string): LoggerWithMethods;
    removeSlashes(str: string): string;
    obfuscateHeaderToken(headers: object): object;
    log(level: string, ...args: any): void;
    logRequest(url: string, options: Record<string, any>, response: Record<string, any>, start: Date): void;
    getLogs(): never[];
    getParsedLogs(): never[];
    getReport(): string;
    _catchConsole(): void;
    _sendToRemoteLogger(level: string, payload?: Record<string, any>): void;
    _parseLoggerBody(payload: Record<string, any>): string;
    _addToBuffer(payload: Record<string, any>): void;
    _processBuffer(): void;
    _computeRetryDelay(attempt: number, initial?: number, maxWait?: number): number;
    _sendDebugToGrafana(payload: string | Record<string, any> | Record<string, any>[], retry?: number): void;
    _writeRetryCount(message: string | Record<string, any>, count: number): string | Record<string, any>;
    _isLevelAbove(level1: string, level2: string): boolean;
    _makeCategory(category: string): string;
}
declare const _default: IssueReporter;
export default _default;
//# sourceMappingURL=IssueReporter.d.ts.map