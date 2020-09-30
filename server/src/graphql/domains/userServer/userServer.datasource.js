import { ForbiddenError } from 'apollo-server';

import { SQLDataSource } from '@dissonance/domains/sql.datasource';

export class UserServerDataSource extends SQLDataSource {
  columns = ['serverId', 'userId', 'createdAt', 'updatedAt'];

  async joinServer(serverId) {
    try {
      const { user } = this.context;

      if (user) {
        const [userServer] = await this.db(this.table)
          .insert({ serverId, userId: user.id })
          .returning(['serverId', 'userId']);

        return userServer;
      } else {
        throw new ForbiddenError();
      }
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
