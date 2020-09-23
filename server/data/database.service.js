export class DatabaseService {
  getTable() {
    return this.connection(this.table);
  }

  findAll() {
    return this.getTable();
  }

  findById(id) {
    return this.getTable().where('id', id).first();
  }
}
