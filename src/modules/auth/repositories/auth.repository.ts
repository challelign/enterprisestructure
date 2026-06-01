import { prisma } from "@/core/database/prisma";

export class AuthRepository {
  async findTenantByCode(code: string) {
    return prisma.tenant.findUnique({
      where: { code },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        organizationRoles: {
          include: {
            role: true,
            organization: true,
          },
        },
      },
    });
  }
}
