import { UnauthorizedError } from "@/core/errors/app-error";
import { AuthRepository } from "../repositories/auth.repository";
import { PasswordService } from "./password.service";
import { JwtService } from "./jwt.service";

export class AuthService {
  private repo = new AuthRepository();

  private passwordService = new PasswordService();

  private jwtService = new JwtService();

  async login(tenantCode: string, email: string, password: string) {
    const tenant = await this.repo.findTenantByCode(tenantCode);

    if (!tenant) {
      throw new UnauthorizedError("Tenant not found");
    }

    const user = await this.repo.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const validPassword = await this.passwordService.verify(
      password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = await this.jwtService.generateAccessToken({
      userId: user.id,
      tenantId: tenant.id,
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: user.id,
      tenantId: tenant.id,
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
