import { logger } from "./logger";

export class AuditLogger {
  static log(action: string, payload?: Record<string, unknown>) {
    logger.info("AUDIT_EVENT", {
      action,
      ...payload,
    });
  }
}
