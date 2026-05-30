import { prisma } from "@/core/database/prisma";

 

export class BaseRepository {
  protected db = prisma;

  protected applyTenant(where: any, tenantId: string) {
    return {
      ...where,
      tenantId,
    };
  }
}
// Each module will follow:
// controller → service → repository → prisma

