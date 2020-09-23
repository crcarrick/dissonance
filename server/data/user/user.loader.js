import DataLoader from 'dataloader';

import { TableNames } from './../constants';
import { mapTo, mapToMany } from './../util';

export const createUserLoaders = (connection) => ({
  user: new DataLoader((ids) =>
    connection(TableNames.USERS)
      .whereIn('id', ids)
      .select()
      .then(mapTo(ids, (user) => user.id))
  ),
  userByEmail: new DataLoader((emails) =>
    connection(TableNames.USERS)
      .whereIn('email', emails)
      .select()
      .then(mapTo(emails, (user) => user.email))
  ),
  usersByServer: new DataLoader((ids) =>
    connection(TableNames.USERS_SERVERS)
      .join('users', 'usersServers.userId', 'users.id')
      .whereIn('serverId', ids)
      .select()
      .then(mapToMany(ids, (user) => user.serverId))
  ),
});
