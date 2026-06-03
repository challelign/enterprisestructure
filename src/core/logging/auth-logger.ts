import { logger } from "./logger";

export class AuthLogger {
  static loginSuccess(userId: string, email: string) {
    logger.info("LOGIN_SUCCESS", {
      userId,
      email,
    });
  }

  static loginFailed(email: string, reason: string) {
    logger.warn("LOGIN_FAILED", {
      email,
      reason,
    });
  }

  static logout(userId: string) {
    logger.info("LOGOUT", {
      userId,
    });
  }
}
