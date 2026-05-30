export class CrudRepository<TModel = any> {
  constructor(protected model: any) {}

  findById(id: string) {
    return this.model.findUnique({
      where: { id },
    });
  }

  findMany(where: any = {}) {
    return this.model.findMany({ where });
  }

  create(data: any) {
    return this.model.create({ data });
  }

  update(id: string, data: any) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.model.delete({
      where: { id },
    });
  }
}
