export const Roles = {
  SUPER_ADMIN: "super_admin",

  SYSTEM_ADMIN: "system_admin",

  TENANT_ADMIN: "tenant_admin",

  ORGANIZATION_ADMIN: "organization_admin",
} as const;

export const ADMIN_BYPASS_ROLES = [
  Roles.SUPER_ADMIN,
  // Roles.SYSTEM_ADMIN,
] as const;
