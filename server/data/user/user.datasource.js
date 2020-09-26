import DataLoader from 'dataloader';

import { TABLE_NAMES } from './../constants';
import { SQLDataSource } from './../sql.datasource';
import { createSignedUrl, mapTo, mapToMany } from './../util';

export class UserDataSource extends SQLDataSource {
  createS3SignedUrl = createSignedUrl;

  constructor(dbClient, table) {
    super(dbClient, table);

    this.byEmailLoader = new DataLoader((emails) =>
      this.db(this.table)
        .whereIn('email', emails)
        .select()
        .then(mapTo(emails, (user) => user.email))
    );
    this.byServerLoader = new DataLoader((ids) =>
      this.db(TABLE_NAMES.USERS_SERVERS)
        .join('users', 'usersServers.userId', 'users.id')
        .whereIn('serverId', ids)
        .select()
        .then(mapToMany(ids, (user) => user.serverId))
    );
  }

  async getByEmail(email) {
    try {
      const user = await this.byEmailLoader.load(email);

      return user;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async getByServer(serverId) {
    try {
      const user = await this.byServerLoader.load(serverId);

      return user;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async createSignedUrl(fileName) {
    try {
      const { user } = this.context;

      const signedUrl = await this.createS3SignedUrl(fileName);

      await this.db(this.table)
        .where('id', user.id)
        .update('avatarUrl', signedUrl.url);

      return signedUrl;
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
