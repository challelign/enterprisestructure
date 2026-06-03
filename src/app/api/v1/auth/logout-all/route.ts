import { NextRequest } from "next/server";

import { AuthService } from "@/modules/auth/services/auth.service";
import { apiHandler } from "@/shared/utils/api-handler";
import { LogoutAllSchema } from "@/modules/auth/dto/logout-all.dto";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    // const currentUser = await auth(request);

    // return authService.logoutAllDevices(
    //   currentUser.userId,
    //   currentUser.tenantId
    // );

    const body = await request.json();

    const dto = LogoutAllSchema.parse(body);

    return authService.logoutAllDevices(dto.userId, dto.tenantId);
  });
}
