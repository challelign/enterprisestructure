import { NextRequest, NextResponse } from "next/server";

import { LogoutSchema } from "@/modules/auth/dto/logout.dto";

import { AuthService } from "@/modules/auth/services/auth.service";

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
  const body = await request.json();

  const dto = LogoutSchema.parse(body);

  const result = await authService.logout(dto.sessionId);

  return NextResponse.json(result);
}
