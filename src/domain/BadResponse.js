/* @flow */

export default class BadResponse {
  static fromResponse(response: Object) {
    return new BadResponse(response.message, response.timestamp, response.error_id, response.details);
  }

  static fromText(response: string) {
    return new BadResponse(response);
  }

  message: string;
  timestamp: ?number;
  errorId: ?string;
  details: ?Object;

  constructor(message: string, timestamp: ?number = null, errorId: ?string = null, details: ?Object = null) {
    this.message = message;
    this.timestamp = timestamp;
    this.errorId = errorId;
    this.details = details;
  }
}
