import { NextRequest } from "next/server";

import { apiHandler } from "@/shared/utils/api-handler";

import { authenticate } from "@/core/auth/auth-guard";

import { requirePermission } from "@/core/authorization/permission-guard";

import { Permissions } from "@/core/authorization/permission.constants";

export async function GET(request: NextRequest) {
  return apiHandler(async () => {
    const currentUser = await authenticate(request);

    requirePermission(currentUser, Permissions.ROLE_CREATE);
    return {
      success: true,
      message: "Permission check passed",
      currentUser,
    };
  });
}
