import { PermissionEffect } from "@/generated/prisma/enums";

export interface PermissionGrant {
  permissionKey: string;
  effect: PermissionEffect;
  roleId: string;
  roleKey: string;
  conditions?: unknown;
}
