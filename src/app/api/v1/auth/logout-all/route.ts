import { NextRequest, NextResponse } from "next/server";

import { LogoutAllSchema } from "@/modules/auth/dto/logout-all.dto";

import { AuthService } from "@/modules/auth/services/auth.service";
import { apiHandler } from "@/shared/utils/api-handler";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    const body = await request.json();

    const dto = LogoutAllSchema.parse(body);

    return await authService.logoutAllDevices(dto.userId);
  });
}
