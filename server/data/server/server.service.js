import { DatabaseService } from './../database.service';

import { TableNames } from './../constants';
import { createSignedUrl } from './../util';

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

  createAvatarSignedUrl = async ({ fileName, serverId, userId }) => {
    const server = await this.connection(TableNames.SERVERS)
      .where('id', serverId)
      .first();

    const authorized = server.id === userId;

    if (!authorized) {
      throw new ApolloError(
        'Not authorized to edit this server',
        'USER_NOT_AUTHORIZED'
      );
    }

    const signedUrl = await createSignedUrl(fileName);

    await this.connection(TableNames.SERVERS)
      .where('id', serverId)
      .update('avatarUrl', signedUrl.url);

    return signedUrl;
  };

  async delete({ id, ownerId }) {
    await this.connection(TableNames.SERVERS)
      .where({
        id,
        ownerId,
      })
      .del();

    return id;
  }

  updateAvatarUrl({ url, serverId }) {
    return this.connection(TableNames.SERVERS)
      .where('id', serverId)
      .update('avatarUrl', url);
  }
}
