import { prisma } from "./prisma";

export async function cleanupDatabase() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database cleanup is disabled in production");
  }
  console.log("🧹 Cleaning database...");

  // Authentication
  await prisma.userSession.deleteMany();

  // Audit
  await prisma.authorizationAudit.deleteMany();

  // Authorization
  await prisma.userOrganizationRole.deleteMany();

  await prisma.rolePermission.deleteMany();

  // Core Users
  await prisma.user.deleteMany();

  // Authorization
  await prisma.role.deleteMany();

  await prisma.permission.deleteMany();

  // Organization
  await prisma.organization.deleteMany();

  // Tenant
  await prisma.tenant.deleteMany();

  console.log("✅ Database cleaned");
}
