import { DatabaseService } from './../database.service';

import { TableNames } from './../constants';

export class ServerService extends DatabaseService {
  table = TableNames.SERVERS;

  constructor(args) {
    super(args);
  }

  async create({ name, ownerId }) {
    const [server] = await this.connection(TableNames.SERVERS)
      .insert({ name, ownerId })
      .returning(['id', 'name', 'ownerId']);

    await this.connection(TableNames.CHANNELS).insert([
      { name: 'welcome', serverId: server.id },
      { name: 'general', serverId: server.id },
    ]);
    await this.connection(TableNames.USERS_SERVERS).insert({
      userId: ownerId,
      serverId: server.id,
    });

    return server;
  }

  async delete({ id, ownerId }) {
    await this.connection(TableNames.SERVERS)
      .where({
        id,
        ownerId,
      })
      .del();

    return id;
  }

  getChannels(id) {
    return this.connection(TableNames.CHANNELS).where('serverId', id);
  }

  getOwner(ownerId) {
    return this.connection(TableNames.USERS).where('id', ownerId).first();
  }

  getUsers(id) {
    return this.connection(TableNames.USERS).whereIn(
      'id',
      this.connection(TableNames.USERS_SERVERS)
        .select('userId')
        .where('serverId', id)
    );
  }
}
