import BadResponse from './BadResponse';

export default class ServerError extends BadResponse {
  static fromResponse(error: Record<string, any>, status: number) {
    return new ServerError(error.message || JSON.stringify(error), status, error.timestamp, error.error_id, error.details);
  }

  static fromText(response: string, status: number) {
    return new ServerError(response, status);
  }

}
