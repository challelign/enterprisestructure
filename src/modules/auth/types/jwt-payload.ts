import { JWTPayload } from "jose";

export interface JwtPayloadData extends JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
}
