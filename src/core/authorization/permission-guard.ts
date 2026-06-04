// import { ForbiddenError } from "@/core/errors/forbidden-error";

// import { CurrentUser } from "@/core/auth/current-user";
// import { Roles } from "./roles.constants";

// //Create Permission Guard
// export function requirePermission(
//   currentUser: CurrentUser,
//   permission: string,
// ) {
//   // SUPER ADMIN BYPASS
//   console.log("Current User Roles:", currentUser.roles);
//   console.log("Current User Permissions:", currentUser.permissions);
//   if (currentUser.roles.includes(Roles.SUPER_ADMIN,)) {
//     return;
//   }

//   const hasPermission = currentUser.permissions.includes(permission);

//   if (!hasPermission) {
//     throw new ForbiddenError(`Missing permission: ${permission}`);
//   }
// }

// // Create Multiple Permission Guard
// export function requireAnyPermission(
//   currentUser: CurrentUser,
//   permissions: string[],
// ) {

//   if (currentUser.roles.includes(Roles.SUPER_ADMIN)) {
//     return;
//   }

//   const hasPermission = permissions.some((permission) =>
//     currentUser.permissions.includes(permission),
//   );

//   if (!hasPermission) {
//     throw new ForbiddenError("Missing required permissions");
//   }
// }
// // Create ALL Permission Guard
// export function requireAllPermissions(
//   currentUser: CurrentUser,
//   permissions: string[],
// ) {
//   if (currentUser.roles.includes(Roles.SUPER_ADMIN)) {
//     return;
//   }

//   const hasAllPermissions = permissions.every((permission) =>
//     currentUser.permissions.includes(permission),
//   );

//   if (!hasAllPermissions) {
//     throw new ForbiddenError("Missing required permissions");
//   }
// }

import { ForbiddenError } from "@/core/errors/forbidden-error";

import { CurrentUser } from "@/core/auth/current-user";

import {
  Roles,
  ADMIN_BYPASS_ROLES,
} from "./roles.constants";

function hasBypassRole(
  currentUser: CurrentUser,
) {
  return currentUser.roles.some((role) =>
    ADMIN_BYPASS_ROLES.includes(
      role as (typeof ADMIN_BYPASS_ROLES)[number],
    ),
  );
}

// ====================================
// SINGLE PERMISSION
// ====================================

export function requirePermission(
  currentUser: CurrentUser,
  permission: string,
) {
  console.log(
    "Current User Roles:",
    currentUser.roles,
  );

  console.log(
    "Current User Permissions:",
    currentUser.permissions,
  );

  if (hasBypassRole(currentUser)) {
    return;
  }

  const hasPermission =
    currentUser.permissions.includes(
      permission,
    );

  if (!hasPermission) {
    throw new ForbiddenError(
      `Missing permission: ${permission}`,
    );
  }
}

// ====================================
// ANY PERMISSION
// ====================================

export function requireAnyPermission(
  currentUser: CurrentUser,
  permissions: string[],
) {
  if (hasBypassRole(currentUser)) {
    return;
  }

  const hasPermission =
    permissions.some((permission) =>
      currentUser.permissions.includes(
        permission,
      ),
    );

  if (!hasPermission) {
    throw new ForbiddenError(
      "Missing required permissions",
    );
  }
}

// ====================================
// ALL PERMISSIONS
// ====================================

export function requireAllPermissions(
  currentUser: CurrentUser,
  permissions: string[],
) {
  if (hasBypassRole(currentUser)) {
    return;
  }

  const hasAllPermissions =
    permissions.every((permission) =>
      currentUser.permissions.includes(
        permission,
      ),
    );

  if (!hasAllPermissions) {
    throw new ForbiddenError(
      "Missing required permissions",
    );
  }
}