import { logger } from "./logger";

export class ErrorLogger {
  static error(message: string, error?: unknown) {
    logger.error(message, {
      error,
    });
  }
}
