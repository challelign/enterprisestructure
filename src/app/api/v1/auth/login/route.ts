import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/modules/auth/services/auth.service";
import { LoginSchema } from "@/modules/auth/dto/login.dto";
import { apiHandler } from "@/shared/utils/api-handler";

/**
 * Login
 │
 ▼
Access Token (15m)
Refresh Token (30d)
 │
 ▼
Access Token Expired
 │
 ▼
POST /auth/refresh
 │
 ▼
Verify Refresh Token
 │
 ▼
Find Session
 │
 ▼
Generate New Tokens
 │
 ▼
Replace Old Refresh Token
 │
 ▼
Return New Tokens
 */

const authService = new AuthService();

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    const body = await request.json();

    const dto = LoginSchema.parse(body);

    const userAgent = request.headers.get("user-agent") ?? undefined;

    const forwardedFor = request.headers.get("x-forwarded-for");

    const ipAddress = forwardedFor?.split(",")[0]?.trim();

    return authService.login(dto.tenantCode, dto.email, dto.password, {
      ipAddress,
      userAgent,
    });
  });
}
