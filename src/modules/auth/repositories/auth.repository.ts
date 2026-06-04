import { prisma } from "@/core/database/prisma";

export class AuthRepository {
  async findTenantByCode(code: string) {
    return prisma.tenant.findUnique({
      where: { code },
    });
  }

  async findTenantById(id: string) {
    return prisma.tenant.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        profile: true,
        organizationRoles: {
          where: {
            isActive: true,
          },
          include: {
            role: true,
            organization: true,
          },
        },
      },
    });
  }

  /**
   * 
   * @param userId
   * 
   * User
   *    └── Roles
             └── Permissions
    User
      └── Organizations
   * @returns 
   */
  async findUserForAuthorization(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        tenant: true,
        profile:true,

        organizationRoles: {
          where: {
            isActive: true,
          },

          include: {
            organization: true,
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
