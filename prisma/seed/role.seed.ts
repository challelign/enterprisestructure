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
      update: {
        name: role.name,
        hierarchyLevel: role.hierarchyLevel,
      },
      create: {
        tenantId,
        ...role,
      },
    });

    createdRoles.push(result);
  }

  // =====================================================
  // BUILD ROLE HIERARCHY
  // =====================================================

  const publicUser = createdRoles.find((r) => r.roleKey === "public_user")!;

  const user = createdRoles.find((r) => r.roleKey === "user")!;

  const auditor = createdRoles.find((r) => r.roleKey === "auditor")!;

  const inspector = createdRoles.find((r) => r.roleKey === "inspector")!;

  const supervisor = createdRoles.find((r) => r.roleKey === "supervisor")!;

  const subManager = createdRoles.find((r) => r.roleKey === "sub_manager")!;

  const manager = createdRoles.find((r) => r.roleKey === "manager")!;

  const admin = createdRoles.find((r) => r.roleKey === "admin")!;

  const superAdmin = createdRoles.find((r) => r.roleKey === "super_admin")!;

  await prisma.role.update({
    where: { id: user.id },
    data: {
      inheritsFromId: publicUser.id,
    },
  });

  await prisma.role.update({
    where: { id: auditor.id },
    data: {
      inheritsFromId: user.id,
    },
  });

  await prisma.role.update({
    where: { id: inspector.id },
    data: {
      inheritsFromId: auditor.id,
    },
  });

  await prisma.role.update({
    where: { id: supervisor.id },
    data: {
      inheritsFromId: inspector.id,
    },
  });

  await prisma.role.update({
    where: { id: subManager.id },
    data: {
      inheritsFromId: supervisor.id,
    },
  });

  await prisma.role.update({
    where: { id: manager.id },
    data: {
      inheritsFromId: subManager.id,
    },
  });

  await prisma.role.update({
    where: { id: admin.id },
    data: {
      inheritsFromId: manager.id,
    },
  });

  await prisma.role.update({
    where: { id: superAdmin.id },
    data: {
      inheritsFromId: admin.id,
    },
  });

  return createdRoles;
}

/**
 * Resulting Hierarchy
Public User
    ↑
User
    ↑
Auditor
    ↑
Inspector
    ↑
Supervisor
    ↑
Sub Manager
    ↑
Manager
    ↑
Admin
    ↑
Super Admin
 */
