export interface RequestContext {
  traceId: string;
  tenantId: string;
  userId?: string;
  organizationId?: string;
  roles?: string[];
  permissions?: string[];
}