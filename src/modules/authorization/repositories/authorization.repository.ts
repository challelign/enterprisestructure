import { prisma } from "@/core/database/prisma";

export class AuthorizationRepository {
  async findRoleWithHierarchy(roleId: string) {
    return prisma.role.findUnique({
      where: {
        id: roleId,
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },

        inheritsFrom: true,
      },
    });
  }

  async findRoleWithPermissions(roleId: string) {
    return prisma.role.findUnique({
      where: {
        id: roleId,
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }
}
