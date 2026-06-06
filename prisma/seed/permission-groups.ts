export const PERMISSION_GROUPS = {
  DASHBOARD: ["dashboard.read"],

  USERS: ["user.create", "user.read", "user.update", "user.delete"],

  ROLES: ["role.create", "role.read", "role.update", "role.delete"],

  ORGANIZATIONS: [
    "organization.create",
    "organization.read",
    "organization.update",
    "organization.delete",
  ],

  TAGS: ["tag.create", "tag.read", "tag.update", "tag.delete"],

  AUDIT: ["audit.read"],

  INSPECTION: ["inspection.approve"],

  //   if there are more permission groups, add them here
  // example REPORTS: ["report.create", "report.read", "report.update", "report.delete"],
  /*
 USER_MANAGEMENT: [...],

  ROLE_MANAGEMENT: [...],

  ORGANIZATION_MANAGEMENT: [...],

  AUDIT_MANAGEMENT: [...],

  TAG_MANAGEMENT: [...],
*/
} as const;

export const ROLE_PERMISSION_MATRIX = {
  public_user: [...PERMISSION_GROUPS.DASHBOARD],

  user: [...PERMISSION_GROUPS.TAGS],

  auditor: [...PERMISSION_GROUPS.AUDIT],

  inspector: ["tag.update"],

  supervisor: [...PERMISSION_GROUPS.INSPECTION, "organization.read"],

  sub_manager: ["user.read", "role.read"],

  manager: [
    ...PERMISSION_GROUPS.TAGS,

    "user.create",
    "user.update",

    "organization.update",
  ],

  admin: [
    ...PERMISSION_GROUPS.USERS,
    ...PERMISSION_GROUPS.ROLES,
    ...PERMISSION_GROUPS.ORGANIZATIONS,
    ...PERMISSION_GROUPS.AUDIT,
  ],

  super_admin: [],
} as const;
