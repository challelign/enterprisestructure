import { prisma } from "./prisma";

export async function seedPermissions(tenantId: string) {
  const permissions = [
    // Dashboard
    ["Dashboard Read", "dashboard.read", "dashboard", "read"],

    // Users
    ["User Create", "user.create", "user", "create"],
    ["User Read", "user.read", "user", "read"],
    ["User Update", "user.update", "user", "update"],
    ["User Delete", "user.delete", "user", "delete"],

    // Roles
    ["Role Create", "role.create", "role", "create"],
    ["Role Read", "role.read", "role", "read"],
    ["Role Update", "role.update", "role", "update"],
    ["Role Delete", "role.delete", "role", "delete"],

    // Organizations
    ["Organization Create", "organization.create", "organization", "create"],
    ["Organization Read", "organization.read", "organization", "read"],
    ["Organization Update", "organization.update", "organization", "update"],
    ["Organization Delete", "organization.delete", "organization", "delete"],

    // Tags
    ["Tag Create", "tag.create", "tag", "create"],
    ["Tag Read", "tag.read", "tag", "read"],
    ["Tag Update", "tag.update", "tag", "update"],
    ["Tag Delete", "tag.delete", "tag", "delete"],

    // Audit
    ["Audit Read", "audit.read", "audit", "read"],
  ];

  const createdPermissions = [];

  for (const [name, permissionKey, resource, action] of permissions) {
    const permission = await prisma.permission.upsert({
      where: {
        permissionKey,
      },

      update: {},

      create: {
        tenantId,
        name,
        permissionKey,
        resource,
        action,
      },
    });

    createdPermissions.push(permission);
  }

  return createdPermissions;
}
