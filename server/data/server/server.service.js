import { Channel } from './../channel';
import { Server } from './server.model';

export class ServerService {
  create({ name }) {
    return Server.createWithChannel({ name });
  }

  findById(id) {
    return Server.findById(id);
  }

  findAll() {
    return Server.find();
  }
}
