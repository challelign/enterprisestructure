import { prisma } from "@/core/database/prisma";

export class UserRepository {
  async findByEmail(tenantId: string, email: string) {
    return prisma.user.findFirst({
      where: {
        tenantId,
        email,
        isDeleted: false,
      },
    });
  }
}
