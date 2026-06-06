import { NextRequest } from "next/server";

import { authenticate } from "@/core/auth/auth-guard";

import { apiHandler } from "@/shared/utils/api-handler";
import { authorize } from "@/core/auth/authorize";
import { Permissions } from "@/core/authorization/permission.constants";

export async function GET(request: NextRequest) {
  return apiHandler(async () => {
    const currentUser = await authorize(request, {
      anyPermissions: [Permissions.TAG_READ, Permissions.TAG_UPDATE],
    });
    return {
      success: true,
      message: "Permission check passed",
      currentUser,
    };
  });
}
