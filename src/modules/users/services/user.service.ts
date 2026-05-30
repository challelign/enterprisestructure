import { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private repo = new UserRepository()) {}

  async getUserByEmail(tenantId: string, email: string) {
    return this.repo.findByEmail(tenantId, email);
  }
}
