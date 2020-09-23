export class DatabaseService {
  constructor({ connection }) {
    this.connection = connection;
  }

  findAll() {
    return this.connection(this.table).select();
  }

  findById(id) {
    return this.connection(this.table).where('id', id).first();
  }
}
