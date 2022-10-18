class BaseError extends Error {
  constructor(e?: string) {
    super(e)
    this.name = new.target.name
  }
}

export class RESTError extends BaseError {
  // eslint-disable-next-line no-unused-vars
  constructor(public code: number, message?: string) {
    super(message)
  }
}
