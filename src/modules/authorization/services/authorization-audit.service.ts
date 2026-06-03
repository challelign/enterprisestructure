import { AuthorizationAuditRepository } from "../repositories/authorization-audit.repository";
import { AuditPayload } from "../types/audit-payload";

export class AuthorizationAuditService {
  constructor(private repository = new AuthorizationAuditRepository()) {}

  async writeAudit(payload: AuditPayload) {
    return this.repository.create(payload);
  }
}
