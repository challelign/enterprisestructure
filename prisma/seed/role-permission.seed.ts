import { prisma } from "./prisma";
import {
  ROLE_PERMISSION_MATRIX,
} from "./permission-groups";

export async function seedRolePermissions(
  tenantId: string,
) {
  const roles = await prisma.role.findMany();

  const permissions =
    await prisma.permission.findMany();

  const getRole = (roleKey: string) =>
    roles.find(
      (r) => r.roleKey === roleKey,
    );

  const getPermission = (
    permissionKey: string,
  ) =>
    permissions.find(
      (p) =>
        p.permissionKey ===
        permissionKey,
    );

  for (const [roleKey, permissionKeys] of Object.entries(
    ROLE_PERMISSION_MATRIX,
  )) {
    const role = getRole(roleKey);

    if (!role) {
      continue;
    }

    for (const permissionKey of permissionKeys) {
      const permission =
        getPermission(
          permissionKey,
        );

      if (!permission) {
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId:
              permission.id,
          },
        },

        update: {
          effect: "ALLOW",
        },

        create: {
          tenantId,
          roleId: role.id,
          permissionId:
            permission.id,
          effect: "ALLOW",
        },
      });
    }
  }
}