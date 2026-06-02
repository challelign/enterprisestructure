import bcrypt from "bcryptjs";

import { prisma } from "./prisma";

export async function seedAdminUser(
  tenantId: string,
  organizationId: string,
  roleId: string,
) {
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const user = await prisma.user.upsert({
    where: {
      email: "admin@moa.gov.et",
    },
    update: {},
    create: {
      tenantId,

      username: "superadmin",

      email: "admin@moa.gov.et",

      passwordHash,

      accountStatus: "ACTIVE",

      isActive: true,
    },
  });

  await prisma.userOrganizationRole.upsert({
    where: {
      userId_organizationId_roleId: {
        userId: user.id,
        organizationId,
        roleId,
      },
    },
    update: {},
    create: {
      tenantId,

      userId: user.id,

      organizationId,

      roleId,

      isPrimary: true,
    },
  });

  return user;
}
