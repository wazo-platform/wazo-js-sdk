import BadResponse from './BadResponse';
export default class ServerError extends BadResponse {
    static fromResponse(error: Record<string, any>, status: number): ServerError;
    static fromText(response: string, status: number): ServerError;
}
//# sourceMappingURL=ServerError.d.ts.map