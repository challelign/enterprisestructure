/*Verify Refresh Token
↓
Find Session
↓
Check Active
↓
Generate New Access Token
↓
Generate New Refresh Token
↓
Rotate Refresh Token
↓
Update Session
↓
Return New Tokens
*/

// ====== Imports =====

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
import { NextRequest, NextResponse } from "next/server";

import { AuthService } from "@/modules/auth/services/auth.service";

import { RefreshTokenSchema } from "@/modules/auth/dto/refresh-token.dto";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  const body = await request.json();

  const dto = RefreshTokenSchema.parse(body);

  const result = await authService.refreshToken(dto.refreshToken);

  return NextResponse.json(result);
}
