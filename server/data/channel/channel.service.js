import { DatabaseService } from './../database.service';

export class ChannelService extends DatabaseService {
  constructor({ connection }) {
    super();

    this.connection = connection;
    this.table = 'channels';
  }

  async create({ name, serverId }) {
    const [channel] = await this.getTable()
      .insert({ name, server_id: serverId })
      .returning(['id', 'name', 'server_id']);

    return channel;
  }

  getMessages(id) {
    return this.connection('messages').where('channel_id', id);
  }
}
