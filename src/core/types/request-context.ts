export interface RequestContext {
  traceId: string;

  tenantId?: string;

  userId?: string;

  organizationId?: string;

  sessionId?: string;
}