import { prisma } from "@/core/database/prisma";
import { AuditPayload } from "../types/audit-payload";

export class AuthorizationAuditRepository {
  async create(data: AuditPayload) {
    return prisma.authorizationAudit.create({
      data: {
        tenantId: data.tenantId,

        userId: data.userId,

        actionType: data.actionType,

        resourceType: data.resourceType,

        resourceId: data.resourceId,

        permissionRequired: data.permissionRequired,

        granted: data.granted,

        reason: data.reason,

        ipAddress: data.ipAddress,

        userAgent: data.userAgent,

        organizationId: data.organizationId,

        metadata: data.metadata as any,
      },
    });
  }
}
