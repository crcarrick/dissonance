import { DatabaseService } from './../database.service';

import { TableNames } from './../constants';

export class ChannelService extends DatabaseService {
  table = TableNames.CHANNELS;

  constructor(args) {
    super(args);
  }

  async create({ name, serverId }) {
    const [channel] = await this.connection(TableNames.CHANNELS)
      .insert({ name, serverId })
      .returning(['id', 'name', 'serverId']);

    return channel;
  }
}
