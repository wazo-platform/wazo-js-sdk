export default class BadResponse extends Error {
  static fromResponse(error: Record<string, any>, status: number) {
    // @ts-ignore
    return new BadResponse(error.message || JSON.stringify(error), status, error.timestamp, error.error_id, error.details, error);
  }

  static fromText(response: string, status: number) {
    return new BadResponse(response, status);
  }

  status: number;

  timestamp: number | null | undefined;

  errorId: string | null | undefined;

  details: Record<string, any> | null | undefined;

  error: Error | null | undefined;

  constructor(message: string, status: number, timestamp: number | null | undefined = null, errorId: string | null | undefined = null, details: Record<string, any> | null | undefined = null, error: Error | null | undefined = null) {
    super(message);
    this.timestamp = timestamp;
    this.status = status;
    this.errorId = errorId;
    this.details = details;
    this.error = error;
  }

}
