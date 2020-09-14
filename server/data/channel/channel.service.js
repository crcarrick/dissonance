export class ChannelService {
  constructor(channel) {
    this.channel = channel;
  }

  create({ name, serverId }) {
    return this.channel.create({ name, server: serverId });
  }

  findById(id) {
    return this.channel.findById(id);
  }

  findAll() {
    return this.channel.find();
  }

  findByServer(serverId) {
    return this.channel.find({ server: serverId });
  }
}
