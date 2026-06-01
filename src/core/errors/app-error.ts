export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation Error") {
    super(400, message);
  }
}
