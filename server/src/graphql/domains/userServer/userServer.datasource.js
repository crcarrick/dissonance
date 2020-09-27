import { SQLDataSource } from '@dissonance/domains/sql.datasource';

export class UserServerDataSource extends SQLDataSource {
  async joinServer(serverId) {
    try {
      const { user } = this.context;

      const [userServer] = await this.db(this.table)
        .insert({ serverId, userId: user.id })
        .returning(['serverId', 'userId']);

      return userServer;
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
