import { NextResponse } from "next/server";
import { UserService } from "@/modules/users/services/user.service";

const service = new UserService();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email")!;
  const tenantId = searchParams.get("tenantId")!;

  const user = await service.getUserByEmail(tenantId, email);

  return NextResponse.json(user);
}
