export class ServerService {
  constructor(server) {
    this.server = server;
  }

  create({ name }) {
    return this.server.createWithChannel({ name });
  }

  findById(id) {
    return this.server.findById(id);
  }

  findAll() {
    return this.server.find();
  }
}
