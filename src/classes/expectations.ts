class MXMException extends Error {
  static codes: { [key: number]: string } = {
    400: 'The request had bad syntax or was inherently impossible to be satisfied.',
    401: 'Authentication failed, probably because of invalid/missing API key.',
    402: 'The usage limit has been reached, either you exceeded per day requests limits or your balance is insufficient.',
    403: 'You are not authorized to perform this operation.',
    404: 'The requested resource was not found.',
    405: 'The requested method was not found.',
    500: 'Ops. Something went wrong.',
    503: "Our system is a bit busy at the moment and your request can't be satisfied.",
  };

  status_code: number;
  message: string;
  requestURL: string;

  constructor(status_code: number, requestURL: string, message?: string) {
    const errorMessage =
      message ?? MXMException.codes[status_code] ?? 'Unknown Error';
    super(errorMessage);
    this.status_code = status_code;
    this.message = errorMessage;
    this.requestURL = requestURL;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toString(): string {
    return `Error code: ${this.status_code} - message: ${this.message}\nRequest URL: ${this.requestURL}`;
  }
}

class MusixmatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MusixmatchError';
  }
}

export { MXMException, MusixmatchError };
