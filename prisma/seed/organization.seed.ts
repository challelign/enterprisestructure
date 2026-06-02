import { prisma } from "./prisma";

export async function seedOrganization(tenantId: string) {
  return prisma.organization.upsert({
    where: {
      code: "MOA-HQ",
    },
    update: {},
    create: {
      tenantId,

      name: "Head Office",

      code: "MOA-HQ",

      hierarchyPath: "/MOA-HQ",

      hierarchyLevel: 0,

      organizationType: "HEADQUARTERS",

      isActive: true,
    },
  });
}
