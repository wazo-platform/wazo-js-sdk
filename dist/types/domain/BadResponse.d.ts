export default class BadResponse extends Error {
    static fromResponse(error: Record<string, any>, status: number): BadResponse;
    static fromText(response: string, status: number): BadResponse;
    status: number;
    timestamp: number | null | undefined;
    errorId: string | null | undefined;
    details: Record<string, any> | null | undefined;
    error: Record<string, any> | Error | null | undefined;
    constructor(message: string, status: number, timestamp?: number | null | undefined, errorId?: string | null | undefined, details?: Record<string, any> | null | undefined, error?: Record<string, any> | Error | null | undefined);
}
//# sourceMappingURL=BadResponse.d.ts.map