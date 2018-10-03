/* @flow */
import BadResponse from './BadResponse';

export default class ServerError extends BadResponse {
  static fromResponse(error: Object, status: number) {
    return new ServerError(error.message, status, error.timestamp, error.error_id, error.details);
  }

  static fromText(response: string, status: number) {
    return new ServerError(response, status);
  }
}
