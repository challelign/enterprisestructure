import { UnauthorizedError } from "@/core/errors/app-error";
import { AuthRepository } from "../repositories/auth.repository";
import { PasswordService } from "./password.service";
import { JwtService } from "./jwt.service";
import { hashToken } from "../utils/token-hash";
import { SessionRepository } from "../repositories/session.repository";
import { SessionContext } from "../types/session-context";
import { GeoLocationService } from "./geo-location.service";
import { parseUserAgent } from "../utils/device-parser";
import { AuthLogger } from "@/core/logging/auth-logger";
import { AuthorizationAuditService } from "@/modules/authorization/services/authorization-audit.service";
import { ErrorLogger } from "@/core/logging/error-logger";
import { AuditPayload } from "@/modules/authorization/types/audit-payload";
import { AuditActionType } from "@/generated/prisma/enums";
import { AuditService } from "@/modules/audit/services/audit.service";

export class AuthService {
  private repo = new AuthRepository();

  private passwordService = new PasswordService();

  private jwtService = new JwtService();

  private sessionRepo = new SessionRepository();
  private geoLocationService = new GeoLocationService();

  // private authorizationAuditService = new AuthorizationAuditService();
  private auditService = new AuditService();
  // =====================================
  // SAFE AUDIT HELPER
  // =====================================

  private async safeAudit(payload: AuditPayload) {
    try {
      await this.auditService.log(payload);
    } catch (error) {
      ErrorLogger.error("Audit logging failed", error);
    }
  }

  async login(
    tenantCode: string,
    email: string,
    password: string,
    context: SessionContext,
  ) {
    const tenant = await this.repo.findTenantByCode(tenantCode);
    const deviceInfo = parseUserAgent(context.userAgent);

    const location = await this.geoLocationService.lookup(context.ipAddress);

    if (!tenant) {
      throw new UnauthorizedError("Tenant not found");
    }

    const user = await this.repo.findUserByEmail(email);

    if (!user) {
      AuthLogger.loginFailed(email, "User not found");
      await this.safeAudit({
        tenantId: tenant.id,
        actionType: AuditActionType.LOGIN,
        granted: false,
        reason: "User not found",
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadata: {
          email,
        },
      });

      throw new UnauthorizedError("Invalid credentials");
    }

    const validPassword = await this.passwordService.verify(
      password,
      user.passwordHash,
    );
    if (!validPassword) {
      AuthLogger.loginFailed(email, "Wrong password");

      await this.safeAudit({
        tenantId: tenant.id,
        userId: user.id,
        actionType: AuditActionType.LOGIN,
        granted: false,
        reason: "Wrong password",
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadata: {
          email: user.email,
          browser: deviceInfo?.browser,
          operatingSystem: deviceInfo?.operatingSystem,
        },
      });
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

    // Session Creation
    await this.sessionRepo.create({
      userId: user.id,

      tenantId: tenant.id,

      sessionTokenHash: hashToken(accessToken),

      refreshTokenHash: hashToken(refreshToken),

      ipAddress: context.ipAddress,

      userAgent: context.userAgent,

      browser: deviceInfo.browser,

      operatingSystem: deviceInfo.operatingSystem,

      deviceName: deviceInfo.deviceName,

      deviceType: deviceInfo.deviceType,

      country: location.country,

      city: location.city,

      lastActivityAt: new Date(),

      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await this.safeAudit({
      tenantId: tenant.id,
      userId: user.id,
      actionType: AuditActionType.LOGIN,
      granted: true,
      reason: "Login successful",
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        browser: deviceInfo.browser,
        operatingSystem: deviceInfo.operatingSystem,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        country: location.country,
        city: location.city,
      },
    });

    AuthLogger.loginSuccess(user.id, user.email);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    const hashedToken = hashToken(refreshToken);

    const session = await this.sessionRepo.findByRefreshTokenHash(hashedToken);

    if (!session) {
      await this.safeAudit({
        tenantId: "unknown",

        actionType: AuditActionType.LOGIN,

        granted: false,

        reason: "Refresh token expired",
      });

      throw new UnauthorizedError("Session expired");
    }

    const newAccessToken = await this.jwtService.generateAccessToken({
      userId: payload.userId,
      tenantId: payload.tenantId,
    });

    const newRefreshToken = await this.jwtService.generateRefreshToken({
      userId: payload.userId,
      tenantId: payload.tenantId,
    });

    await this.sessionRepo.updateRefreshToken(
      session.id,
      hashToken(newRefreshToken),
    );

    await this.safeAudit({
      tenantId: session.tenantId,
      userId: session.userId,
      actionType: AuditActionType.LOGIN,
      granted: true,
      reason: "Token refreshed",
      ipAddress: session?.ipAddress,
      userAgent: session?.userAgent,
      metadata: {
        browser: session.browser,
        operatingSystem: session.operatingSystem,
        deviceName: session.deviceName,
        deviceType: session.deviceType,
        country: session.country,
        city: session.city,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
  async logout(sessionId: string) {
    const session = await this.sessionRepo.revoke(sessionId);

    if (!session) {
      throw new UnauthorizedError("Session not found");
    }

    await this.safeAudit({
      tenantId: session.tenantId,
      userId: session.userId,
      actionType: AuditActionType.LOGOUT,
      granted: true,
      reason: "User logout",
      ipAddress: session?.ipAddress,
      userAgent: session?.userAgent ,
      metadata: {
        browser: session.browser,
        operatingSystem: session.operatingSystem,
        deviceName: session.deviceName,
        deviceType: session.deviceType,
        country: session.country,
        city: session.city,
      },
    });

    return {
      success: true,
      message: "Logged out successfully",
    };
  }

  async logoutAllDevices(userId: string, tenantId: string) {
    await this.sessionRepo.revokeAllUserSessions(userId);

    await this.safeAudit({
      tenantId,
      userId,
      actionType: "LOGOUT",
      granted: true,
      reason: "Logout all devices",
    });

    return {
      success: true,
      message: "All devices logged out",
    };
  }
}
