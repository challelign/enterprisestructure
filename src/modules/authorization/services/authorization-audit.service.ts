import { AuditService } from "@/modules/audit/services/audit.service"; 
import { AuditPayload } from "../types/audit-payload";

export class AuthorizationAuditService {
private auditService =
  new AuditService();

  async writeAudit(payload: AuditPayload) {
    return await this.auditService.log(payload);
  }
}
