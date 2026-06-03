import { AuditRepository } from "../repositories/audit.repository";

export class AuditService {
  private repository = new AuditRepository();

  async log(data: any) {
    return this.repository.create(data);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async getAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    return this.repository.findMany(skip, pageSize);
  }
}
