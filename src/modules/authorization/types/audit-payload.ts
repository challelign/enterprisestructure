import { AuditActionType } from "@/generated/prisma/enums";

export interface AuditPayload {
  tenantId: string;

  userId?: string;

  actionType: AuditActionType;

  resourceType?: string;

  resourceId?: string;

  permissionRequired?: string;

  granted: boolean;

  reason?: string;

  ipAddress?: string;

  userAgent?: string;

  organizationId?: string;

  metadata?: unknown;
}
