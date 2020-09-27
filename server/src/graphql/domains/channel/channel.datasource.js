import DataLoader from 'dataloader';

import { SQLDataSource } from '@dissonance/domains/sql.datasource';
import { mapToMany } from '@dissonance/utils';

export class ChannelDataSource extends SQLDataSource {
  constructor(dbClient, table) {
    super(dbClient, table);

    this.byServerLoader = new DataLoader((ids) =>
      this.db(this.table)
        .whereIn('serverId', ids)
        .select()
        .then(mapToMany(ids, (channel) => channel.serverId))
    );
  }

  async getByServer(serverId) {
    try {
      const channel = await this.byServerLoader.load(serverId);

      return channel;
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
