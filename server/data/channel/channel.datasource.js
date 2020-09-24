import DataLoader from 'dataloader';

import { SQLDataSource } from './../sql.datasource';
import { mapToMany } from './../util';

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
}
