import { NextRequest } from "next/server";

import { apiHandler } from "@/shared/utils/api-handler";

import { authorize } from "@/core/auth/authorize";

import { Permissions } from "@/core/authorization/permission.constants";


/*
requirePermission()      → ONE permission
requireAnyPermission()   → OR
requireAllPermissions()  → AND
*/
export async function GET(request: NextRequest) {
  return apiHandler(async () => {
    // const currentUser = await authorize(request, {
    //   permission: Permissions.ORGANIZATION_READ,
    // });

    // Multiple Permissions
    /**     
     const currentUser =
  await authorize(request, {
    anyPermissions: [
      Permissions.TAG_READ,
      Permissions.TAG_UPDATE,
    ],
  });
     */

    //  All Permissions
    /*
  const currentUser =
  await authorize(request, {
    allPermissions: [
      Permissions.TAG_READ,
      Permissions.TAG_UPDATE,
    ],
  });

  */

 const currentUser =
  await authorize(request, {
    anyPermissions: [
      Permissions.TAG_READ,
      Permissions.TAG_UPDATE,
    ],
  });
    return {
      success: true,
      message: "Permission check passed",
      currentUser,
    };
  });
}
