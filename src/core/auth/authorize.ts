import { NextRequest } from "next/server";
import { authenticate } from "./auth-guard";
import {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
} from "@/core/authorization/permission-guard";

export async function authorize(
  request: NextRequest,
  options: {
    permission?: string;
    anyPermissions?: string[];
    allPermissions?: string[];
  },
) {
  const currentUser = await authenticate(request);

  if (options.permission) {
    requirePermission(currentUser, options.permission);
  }

  if (options.anyPermissions?.length) {
    requireAnyPermission(currentUser, options.anyPermissions);
  }

  if (options.allPermissions?.length) {
    requireAllPermissions(currentUser, options.allPermissions);
  }

  return currentUser;
}
