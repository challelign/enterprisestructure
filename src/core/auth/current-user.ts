export interface CurrentUser {
  userId: string;
  tenantId: string;
  email: string;
  roles: string[];
  permissions: string[];
  organizations: string[];
}
