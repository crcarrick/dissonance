import { Server } from '../server/server.model';
import { Channel } from './channel.model';

export class ChannelService {
  create({ name, serverId }) {
    return Channel.create({ name, server: serverId });
  }

  findById(id) {
    return Channel.findById(id);
  }

  findAll() {
    return Channel.find();
  }

  findByServer(serverId) {
    return Channel.find({ server: serverId });
  }
}
