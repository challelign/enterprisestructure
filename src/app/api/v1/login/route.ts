import { NextResponse } from "next/server";
import { AuthService } from "@/modules/auth/services/auth.service";
import { LoginSchema } from "@/modules/auth/dto/login.dto";

const authService = new AuthService();

export async function POST(req: Request) {
  const body = await req.json();

  const dto = LoginSchema.parse(body);

  const result = await authService.login(
    dto.tenantCode,
    dto.email,
    dto.password,
  );

  return NextResponse.json(result);
}
