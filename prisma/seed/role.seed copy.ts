import { prisma } from "./prisma";

export async function seedRoles(tenantId: string) {
  const roles = [
    {
      name: "Super Admin",
      roleKey: "super_admin",
      hierarchyLevel: 10,
    },
    {
      name: "Admin",
      roleKey: "admin",
      hierarchyLevel: 20,
    },
    {
      name: "Manager",
      roleKey: "manager",
      hierarchyLevel: 30,
    },
    {
      name: "Sub Manager",
      roleKey: "sub_manager",
      hierarchyLevel: 40,
    },
    {
      name: "Supervisor",
      roleKey: "supervisor",
      hierarchyLevel: 50,
    },
    {
      name: "Inspector",
      roleKey: "inspector",
      hierarchyLevel: 60,
    },
    {
      name: "Auditor",
      roleKey: "auditor",
      hierarchyLevel: 70,
    },
    {
      name: "User",
      roleKey: "user",
      hierarchyLevel: 80,
    },
    {
      name: "Public User",
      roleKey: "public_user",
      hierarchyLevel: 90,
    },
  ];

  const createdRoles = [];

  for (const role of roles) {
    const result = await prisma.role.upsert({
      where: {
        roleKey: role.roleKey,
      },
      update: {},
      create: {
        tenantId,
        ...role,
      },
    });

    createdRoles.push(result);
  }

  return createdRoles;
}
