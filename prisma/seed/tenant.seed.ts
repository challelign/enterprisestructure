import { prisma } from "./prisma";

 

export async function seedTenant() {
  return prisma.tenant.upsert({
    where: {
      code: "MOA",
    },
    update: {},
    create: {
      name: "Ministry Of Agriculture",
      code: "MOA",
      isActive: true,
    },
  });
}
