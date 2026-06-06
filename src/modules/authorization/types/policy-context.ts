export interface PolicyContext {
  userId: string;
  tenantId: string;
  organizationId?: string;
  regionId?: string;
  zoneId?: string;
  woredaId?: string;
  resourceOwnerId?: string;
}
