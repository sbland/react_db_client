// export function AsyncRequestError(message: string = '', error: Error | null = null) {
//   this.name = 'AsyncRequestError';
//   this.message = message;
//   this.error = error;
// }
// AsyncRequestError.prototype = Error.prototype;

export class AsyncRequestError extends Error {
  name: 'AsyncRequestError';
  error?: Error;
  constructor(msg: string, error?: Error) {
    super(msg);
    this.error = error;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AsyncRequestError.prototype);
  }
}
