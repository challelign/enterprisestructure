export const Permissions = {
  // User
  USER_CREATE: "user.create",
  USER_READ: "user.read",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",

  // Role
  ROLE_CREATE: "role.create",
  ROLE_READ: "role.read",
  ROLE_UPDATE: "role.update",
  ROLE_DELETE: "role.delete",

  // Permission
  PERMISSION_READ: "permission.read",

  // Organization
  ORGANIZATION_CREATE: "organization.create",
  ORGANIZATION_READ: "organization.read",
  ORGANIZATION_UPDATE: "organization.update",
  ORGANIZATION_DELETE: "organization.delete",

  // Tag
  TAG_CREATE: "tag.create",
  TAG_READ: "tag.read",
  TAG_UPDATE: "tag.update",
  TAG_DELETE: "tag.delete",
} as const;
