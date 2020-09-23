import DataLoader from 'dataloader';

import { TableNames } from './../constants';
import { mapTo, mapToMany } from './../util';

export const createServerLoaders = (connection) => ({
  server: new DataLoader((ids) =>
    connection(TableNames.SERVERS)
      .whereIn('id', ids)
      .select()
      .then(mapTo(ids, (server) => server.id))
  ),
  serversByUser: new DataLoader((ids) =>
    connection(TableNames.USERS_SERVERS)
      .join('servers', 'usersServers.serverId', 'servers.id')
      .whereIn('userId', ids)
      .select()
      .then(mapToMany(ids, (server) => server.userId))
  ),
});
