import { NextRequest } from "next/server";

import { authenticate } from "@/core/auth/auth-guard";

import { apiHandler } from "@/shared/utils/api-handler";

export async function GET(request: NextRequest) {
  return apiHandler(async () => {
    const currentUser = await authenticate(request);

    console.log("Authenticated user:", currentUser);
    return currentUser;
  });
}
