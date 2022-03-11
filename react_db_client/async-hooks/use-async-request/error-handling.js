export function AsyncRequestError(message = '', error) {
  this.name = 'AsyncRequestError';
  this.message = message;
  this.error = error;
}
AsyncRequestError.prototype = Error.prototype;
