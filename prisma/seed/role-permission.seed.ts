import { prisma } from "./prisma";

export async function seedRolePermissions(tenantId: string) {
  const roles = await prisma.role.findMany();

  const permissions = await prisma.permission.findMany();

  const getRole = (key: string) => roles.find((r) => r.roleKey === key);

  const getPermission = (key: string) =>
    permissions.find((p) => p.permissionKey === key);

  const assignments = [
    {
      role: "public_user",
      permissions: ["dashboard.read"],
    },

    {
      role: "user",
      permissions: ["tag.read"],
    },

    {
      role: "auditor",
      permissions: ["audit.read"],
    },

    {
      role: "inspector",
      permissions: ["tag.update"],
    },

    {
      role: "supervisor",
      permissions: ["organization.read"],
    },

    {
      role: "sub_manager",
      permissions: ["user.read"],
    },

    {
      role: "manager",
      permissions: ["tag.create"],
    },

    {
      role: "admin",
      permissions: ["user.create", "user.update", "role.read"],
    },

    {
      role: "super_admin",
      permissions: [],
    },
  ];

  for (const assignment of assignments) {
    const role = getRole(assignment.role);

    if (!role) {
      continue;
    }

    for (const permissionKey of assignment.permissions) {
      const permission = getPermission(permissionKey);

      if (!permission) {
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },

        update: {},

        create: {
          tenantId,
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
}
