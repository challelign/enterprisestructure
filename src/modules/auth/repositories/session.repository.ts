import { prisma } from "@/core/database/prisma";
/*
Login
 ↓
Create UserSession
 ↓
Issue Access Token
 ↓
Issue Refresh Token
 ↓
Refresh Access Token
 ↓
Rotate Refresh Token
 ↓
Update Session
 ↓
Logout
 ↓
Revoke Session
*/
export class SessionRepository {
  async create(data: any) {
    return prisma.userSession.create({
      data,
    });
  }

  async findByRefreshTokenHash(refreshTokenHash: string) {
    return prisma.userSession.findFirst({
      where: {
        refreshTokenHash,
        isActive: true,
      },
    });
  }

  async revoke(sessionId: string) {
    return prisma.userSession.update({
      where: {
        id: sessionId,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: "USER_LOGOUT",
      },
    });
  }

  async revokeAllUserSessions(userId: string) {
    return prisma.userSession.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: "LOGOUT_ALL_DEVICES",
      },
    });
  }

  async updateRefreshToken(sessionId: string, refreshTokenHash: string) {
    return prisma.userSession.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshTokenHash,
        lastActivityAt: new Date(),
      },
    });
  }
}
