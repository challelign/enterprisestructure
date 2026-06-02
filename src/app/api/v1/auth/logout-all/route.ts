import { NextRequest, NextResponse } from "next/server";

import { LogoutAllSchema } from "@/modules/auth/dto/logout-all.dto";

import { AuthService } from "@/modules/auth/services/auth.service";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  const body = await request.json();

  const dto = LogoutAllSchema.parse(body);

  const result = await authService.logoutAllDevices(dto.userId);

  return NextResponse.json(result);
}
