import { NextRequest } from "next/server"; 

import { JwtService } from "@/modules/auth/services/jwt.service";

import { AuthorizationContextService } from "@/modules/authorization/services/authorization-context.service";
import { UnauthorizedError } from "@/core/errors/app-error";

const jwtService = new JwtService();

const authorizationContextService = new AuthorizationContextService();

export async function authenticate(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new UnauthorizedError("Authorization header missing");
  }

  const token = authorization.replace("Bearer ", "");

  const payload = await jwtService.verifyAccessToken(token);

  const user = await authorizationContextService.build(payload.userId);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
}
