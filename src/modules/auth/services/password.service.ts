import bcrypt from "bcryptjs";

export class PasswordService {
  async hash(password: string) {
    return bcrypt.hash(password, 12);
  }

  async verify(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
