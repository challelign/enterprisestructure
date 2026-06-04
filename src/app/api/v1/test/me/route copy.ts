import { NextRequest } from "next/server";
import { apiHandler } from "@/shared/utils/api-handler";
import { withAuth } from "@/core/auth/with-auth";

export async function GET(
  request: NextRequest,
) {
  return apiHandler(async () =>
    withAuth(
      request,
      async (user) => {
        return {
          // userId: user.userId,
          // roles: user.roles,
          // permissions: user.permissions,
          // organizations: user.organizations,
          // tenantId: user.tenantId,
          // email: user.email,
          // profile: user.profile,          
          user
        };
      },
    ),
  );
}