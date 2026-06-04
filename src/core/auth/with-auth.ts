import { NextRequest } from "next/server";

import { authenticate } from "./auth-guard";

export async function withAuth<T>(
  request: NextRequest,
  callback: (user: any) => Promise<T>,
) {
  const currentUser = await authenticate(request);

  return callback(currentUser);
}
