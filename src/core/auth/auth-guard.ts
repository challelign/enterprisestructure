import { NextRequest } from "next/server";

import { JwtService } from "@/modules/auth/services/jwt.service";

import { AuthorizationContextService } from "@/modules/authorization/services/authorization-context.service";

import { AuthLogger } from "../logging/auth-logger";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";

const jwtService = new JwtService();

const authorizationContextService = new AuthorizationContextService();

export async function authenticate(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    AuthLogger.loginFailed("authorization", "Authorization header missing");
    throw new UnauthorizedError("Authorization header missing");
  }

  const token = authorization.replace("Bearer ", "");

  const payload = await jwtService.verifyAccessToken(token);

  const user = await authorizationContextService.build(payload.userId);

  if (!user) {
    AuthLogger.loginFailed("authorization", "User not found");
    throw new UnauthorizedError("User not found");
  }

  return user;
}
