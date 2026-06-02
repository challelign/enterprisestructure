/**
 * Seed Tenant
 ↓
Seed Organization
 ↓
Seed Roles
 ↓
Seed Admin User
 */

import { prisma } from "./prisma";

import { seedTenant } from "./tenant.seed";
import { seedOrganization } from "./organization.seed";
import { seedRoles } from "./role.seed";
import { seedAdminUser } from "./user.seed";

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Tenant
  const tenant = await seedTenant();

  console.log(`✅ Tenant created: ${tenant.name}`);

  // 2. Organization
  const organization = await seedOrganization(tenant.id);

  console.log(`✅ Organization created: ${organization.name}`);

  // 3. Roles
  const roles = await seedRoles(tenant.id);

  console.log(`✅ Roles created: ${roles.length}`);

  const superAdminRole = roles.find((x) => x.roleKey === "super_admin");

  if (!superAdminRole) {
    throw new Error("Super Admin role not found");
  }

  // 4. Admin User
  const admin = await seedAdminUser(
    tenant.id,
    organization.id,
    superAdminRole.id,
  );

  console.log(`✅ Admin user created: ${admin.email}`);

  console.log("🎉 Database seed completed");
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
