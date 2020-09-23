import { DatabaseService } from './../database.service';

export class ServerService extends DatabaseService {
  constructor({ connection }) {
    super();

    this.connection = connection;
    this.table = 'servers';
  }

  async create({ name, ownerId }) {
    const [server] = await this.getTable()
      .insert({ name, owner_id: ownerId })
      .returning(['id', 'name', 'owner_id']);

    await this.connection('channels').insert([
      { name: 'welcome', server_id: server.id },
      { name: 'general', server_id: server.id },
    ]);
    await this.connection('users_servers').insert({
      user_id: ownerId,
      server_id: server.id,
    });

    return server;
  }

  async delete({ id, ownerId }) {
    await this.getTable()
      .where({
        id,
        owner_id: ownerId,
      })
      .del();

    return id;
  }

  getChannels(id) {
    return this.connection('channels').where('server_id', id);
  }

  getOwner(ownerId) {
    return this.connection('users').where('id', ownerId).first();
  }

  getUsers(id) {
    return this.connection('users').whereIn(
      'id',
      this.connection('users_servers').select('user_id').where('server_id', id)
    );
  }
}
