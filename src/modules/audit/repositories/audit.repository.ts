import { prisma } from "@/core/database/prisma";

export class AuditRepository {
  async create(data: any) {
    return prisma.authorizationAudit.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.authorizationAudit.findUnique({
      where: { id },
    });
  }

  async findMany(skip = 0, take = 20) {
    return prisma.authorizationAudit.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
