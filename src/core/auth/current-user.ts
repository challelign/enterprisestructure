import { PermissionGrant } from "@/modules/authorization/types/permission-grant";
export interface CurrentUser {
  userId: string;
  tenantId: string;
  email: string;
  roles: string[];
  organizations: string[];
  permissions: string[];
  permissionGrants: PermissionGrant[];
}
