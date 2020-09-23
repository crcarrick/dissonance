import DataLoader from 'dataloader';

import { TableNames } from './../constants';
import { mapTo, mapToMany } from './../util';

export const createMessageLoaders = (connection) => ({
  message: new DataLoader((ids) =>
    connection(TableNames.MESSAGES)
      .whereIn('id', ids)
      .select()
      .then(mapTo(ids, (message) => message.id))
  ),
  messagesByChannel: new DataLoader(async (ids) =>
    connection(TableNames.MESSAGES)
      .whereIn('channelId', ids)
      .select()
      .then(mapToMany(ids, (message) => message.channelId))
  ),
});
