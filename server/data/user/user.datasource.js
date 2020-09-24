import DataLoader from 'dataloader';

import { SQLDataSource } from './../sql.datasource';
import { createSignedUrl, mapTo, mapToMany } from './../util';

export class UserDataSource extends SQLDataSource {
  constructor(dbClient, table) {
    super(dbClient, table);

    this.byEmailLoader = new DataLoader((emails) =>
      this.db(this.table)
        .whereIn('email', emails)
        .select()
        .then(mapTo(emails, (user) => user.email))
    );
    this.byServerLoader = new DataLoader((ids) =>
      this.db(this.table)
        .join('users', 'usersServers.userId', 'users.id')
        .whereIn('serverId', ids)
        .select()
        .then(mapToMany(ids, (user) => user.serverId))
    );
  }

  async createSignedUrl(fileName) {
    try {
      const { user } = this.context;

      const signedUrl = await createSignedUrl(fileName);

      await this.db(this.table)
        .where('id', user.id)
        .update('avatarUrl', signedUrl.url);

      return signedUrl;
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
