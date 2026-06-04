import { AppError } from "./app-error";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", errors?: unknown) {
    super(message, 403, errors);
  }
}
