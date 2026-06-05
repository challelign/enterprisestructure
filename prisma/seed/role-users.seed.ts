import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function seedRoleUsers(tenantId: string, organizationId: string) {
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  //start need to remove all user organization roles and users before seeding new ones to avoid duplicates and conflicts
  await prisma.userOrganizationRole.deleteMany();

  await prisma.user.deleteMany();
  // end of cleanup
  const createdUsers = [];

  const users = [
    {
      username: "superadmin",
      email: "superadmin@moa.gov.et",
      roleKey: "super_admin",
    },
    {
      username: "admin",
      email: "admin@moa.gov.et",
      roleKey: "admin",
    },
    {
      username: "manager",
      email: "manager@moa.gov.et",
      roleKey: "manager",
    },
    {
      username: "submanager",
      email: "submanager@moa.gov.et",
      roleKey: "sub_manager",
    },
    {
      username: "supervisor",
      email: "supervisor@moa.gov.et",
      roleKey: "supervisor",
    },
    {
      username: "inspector",
      email: "inspector@moa.gov.et",
      roleKey: "inspector",
    },
    {
      username: "auditor",
      email: "auditor@moa.gov.et",
      roleKey: "auditor",
    },
    {
      username: "user",
      email: "user@moa.gov.et",
      roleKey: "user",
    },
    {
      username: "publicuser",
      email: "publicuser@moa.gov.et",
      roleKey: "public_user",
    },
  ];

  for (const item of users) {
    const role = await prisma.role.findUnique({
      where: {
        roleKey: item.roleKey,
      },
    });

    if (!role) {
      continue;
    }
    /*
    const user = await prisma.user.upsert({
      where: {
        email: item.email,
      },
      update: {},
      create: {
        tenantId,

        username: item.username,

        email: item.email,

        passwordHash,

        accountStatus: "ACTIVE",

        isActive: true,
      },
    });
*/

    const user = await prisma.user.upsert({
      where: {
        username: item.username,
      },

      update: {
        email: item.email,
      },

      create: {
        tenantId,
        username: item.username,
        email: item.email,
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
          roleId: role.id,
        },
      },

      update: {},

      create: {
        tenantId,
        userId: user.id,
        organizationId,
        roleId: role.id,
        isPrimary: true,
      },
    });

    createdUsers.push(user);
  }
  return createdUsers;
}
