import { NextRequest, NextResponse } from "next/server";

import { LogoutSchema } from "@/modules/auth/dto/logout.dto";

import { AuthService } from "@/modules/auth/services/auth.service";
import { apiHandler } from "@/shared/utils/api-handler";

const authService = new AuthService();
/**
 * POST /api/v1/auth/logout
 * 
 * REQUEST
 * {
  "sessionId":"123"
}
 * RESPONSE
 * {
  "success": true,
  "message": "Logged out successfully"
}
 */
export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    const body = await request.json();

    const dto = LogoutSchema.parse(body);

    return await authService.logout(dto.sessionId);
  });
}
