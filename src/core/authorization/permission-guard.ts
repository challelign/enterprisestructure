
import { ForbiddenError } from "@/core/errors/forbidden-error";

import { CurrentUser } from "@/core/auth/current-user";

import { Roles, ADMIN_BYPASS_ROLES } from "./roles.constants";

// ====================================
// ONLY SUPER ADMIN BYPASS
// ====================================

function hasBypassRole(currentUser: CurrentUser) {
  return currentUser.roles.some((role) =>
    ADMIN_BYPASS_ROLES.includes(role as (typeof ADMIN_BYPASS_ROLES)[number]),
  );
}

// ====================================
// SINGLE PERMISSION
// It first checks if the user has any bypass role using hasBypassRole(currentUser). If so, it returns immediately, skipping the permission check.

// It checks if the permission string provided is included in the currentUser.permissions array.
// ====================================

export function requirePermission(
  currentUser: CurrentUser,
  permission: string,
) {
  console.log("Current User Roles:", currentUser.roles);

  console.log("Current User Permissions:", currentUser.permissions);

  if (hasBypassRole(currentUser)) {
    return;
  }

  const hasPermission = currentUser.permissions.includes(permission);

  if (!hasPermission) {
    throw new ForbiddenError(`Missing permission: ${permission}`);
  }
}

// ====================================
// ANY PERMISSION
// It takes an array of permissions. It uses the some array method to check if the user has any of the permissions in the provided array. If currentUser.permissions includes at least one of the items in permissions, hasPermission is true.
// ====================================

export function requireAnyPermission(
  currentUser: CurrentUser,
  permissions: string[],
) {
  if (hasBypassRole(currentUser)) {
    return;
  }

  const hasPermission = permissions.some((permission) =>
    currentUser.permissions.includes(permission),
  );

  if (!hasPermission) {
    throw new ForbiddenError("Missing required permissions");
  }
}

// ====================================
// ALL PERMISSIONS
// It takes an array of permissions. It uses the every array method to verify that all of the permissions in the provided array are present in currentUser.permissions. If even one is missing, hasAllPermissions will evaluate to false.
// ====================================

export function requireAllPermissions(
  currentUser: CurrentUser,
  permissions: string[],
) {
  if (hasBypassRole(currentUser)) {
    return;
  }

  const hasAllPermissions = permissions.every((permission) =>
    currentUser.permissions.includes(permission),
  );

  if (!hasAllPermissions) {
    throw new ForbiddenError("Missing required permissions");
  }
}

/*
export function requirePermission(
  currentUser: CurrentUser,
  permission: string,
) {
  // ONLY SUPER ADMIN BYPASS
  if (currentUser.roles.includes("super_admin")) {
    return;
  }

  const hasPermission = currentUser.permissions.includes(permission);

  if (!hasPermission) {
    throw new ForbiddenError(`Missing permission: ${permission}`);
  }
}
export function requireAnyPermission(
  currentUser: CurrentUser,
  permissions: string[],
) {
  if (currentUser.roles.includes("super_admin")) {
    return;
  }

  const hasPermission = permissions.some((permission) =>
    currentUser.permissions.includes(permission),
  );

  if (!hasPermission) {
    throw new ForbiddenError("Missing required permissions");
  }
}
export function requireAllPermissions(
  currentUser: CurrentUser,
  permissions: string[],
) {
  if (currentUser.roles.includes("super_admin")) {
    return;
  }

  const hasAllPermissions = permissions.every((permission) =>
    currentUser.permissions.includes(permission),
  );

  if (!hasAllPermissions) {
    throw new ForbiddenError("Missing required permissions");
  }
}

*/
