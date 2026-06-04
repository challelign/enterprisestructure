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
}
