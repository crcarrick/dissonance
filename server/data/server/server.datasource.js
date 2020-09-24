import { ForbiddenError } from 'apollo-server';
import DataLoader from 'dataloader';

import { TABLE_NAMES } from './../constants';
import { SQLDataSource } from './../sql.datasource';
import { mapToMany } from './../util';

export class ServerDataSource extends SQLDataSource {
  constructor(dbClient, table) {
    super(dbClient, table);

    this.byUserLoader = new DataLoader((ids) =>
      this.db(TABLE_NAMES.USERS_SERVERS)
        .join('servers', 'usersServers.serverId', 'servers.id')
        .whereIn('userId', ids)
        .select()
        .then(mapToMany(ids, (server) => server.userId))
    );
  }

  async create(fields) {
    try {
      const { user } = this.context;

      const server = await this.db.transaction(async (trx) => {
        const [serv] = await trx
          .insert({ ...fields, ownerId: user.id })
          .into(this.table)
          .returning(['id', 'name', 'ownerId']);

        await trx
          .insert([
            { name: 'welcome', serverId: serv.id },
            { name: 'general', serverId: serv.id },
          ])
          .into(TABLE_NAMES.CHANNELS);

        await trx
          .insert({
            userId: user.id,
            serverId: serv.id,
          })
          .into(TABLE_NAMES.USERS_SERVERS);

        return serv;
      });

      return server;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async delete(id) {
    try {
      const { user } = this.context;

      await this.db(this.table).del().where({
        id,
        ownerId: user.id,
      });

      return { id };
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async createSignedUrl({ fileName, serverId }) {
    try {
      const { user } = this.context;

      const authorized = await this.db(this.table)
        .where({
          id: serverId,
          ownerId: user.id,
        })
        .select()
        .first();

      if (!Boolean(authorized)) {
        throw new ForbiddenError();
      }

      const signedUrl = await createSignedUrl(fileName);

      await this.db(this.table)
        .where('id', serverId)
        .update('avatarUrl', signedUrl.url);

      return signedUrl;
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
