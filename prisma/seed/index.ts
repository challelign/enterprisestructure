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
import { seedRoleUsers } from "./role.users.seed";
import { cleanupDatabase } from "./cleanup";

async function main() {

  console.log("🌱 Starting database seed...");
  await cleanupDatabase(); 

  // 1. Tenant
  const tenant = await seedTenant();

  console.log(`✅ Tenant created: ${tenant.name}`);

  // 2. Organization
  const organization = await seedOrganization(tenant.id);

  console.log(`✅ Organization created: ${organization.name}`);

  // 3. Roles
  const roles = await seedRoles(tenant.id);

  console.log(`✅ Roles created: ${roles.length}`);

 const roleUsers = await seedRoleUsers(tenant.id, organization.id);

  console.log(`✅ Role users created: ${roleUsers?.length || 0}`);

  /*
  // we seed role users before seeding admin user because the admin user will be created with the super admin role, so we need to make sure that the super admin role is created before seeding the admin user.

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
*/
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
