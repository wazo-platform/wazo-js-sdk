/* @flow */

export default class BadResponse extends Error {
  static fromResponse(error: Object, status: number) {
    return new BadResponse(error.message, status, error.timestamp, error.error_id, error.details);
  }

  static fromText(response: string, status: number) {
    return new BadResponse(response, status);
  }

  message: string;
  status: number;
  timestamp: ?number;
  errorId: ?string;
  details: ?Object;

  constructor(
    message: string,
    status: number,
    timestamp: ?number = null,
    errorId: ?string = null,
    details: ?Object = null,
  ) {
    super(message);

    this.timestamp = timestamp;
    this.status = status;
    this.errorId = errorId;
    this.details = details;
  }
}
