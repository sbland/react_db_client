export class GenericCatalogueError extends Error {
  name: 'GenericCatalogueError';
  error?: Error;
  constructor(msg: string, error?: Error) {
    super(msg);
    this.error = error;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, GenericCatalogueError.prototype);
  }
}
