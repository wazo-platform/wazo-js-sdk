/* @flow */
import BadResponse from './BadResponse';

export default class ServerError extends BadResponse {
  static fromResponse(response: Object) {
    return new ServerError(response.message, response.timestamp, response.error_id, response.details);
  }

  static fromText(response: string) {
    return new ServerError(response);
  }
}
