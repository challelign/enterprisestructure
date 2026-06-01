import { SignJWT } from "jose";

const encoder = new TextEncoder();

export class JwtService {
  async generateAccessToken(payload: Record<string, any>) {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(encoder.encode(process.env.JWT_ACCESS_SECRET!));
  }

  async generateRefreshToken(payload: Record<string, any>) {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(encoder.encode(process.env.JWT_REFRESH_SECRET!));
  }
}
