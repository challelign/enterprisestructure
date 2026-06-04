export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public errors?: unknown
  ) {
    super(message);

    this.name = this.constructor.name;

    Object.setPrototypeOf(
      this,
      new.target.prototype
    );
  }
}