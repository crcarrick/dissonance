import DataLoader from 'dataloader';

import { TableNames } from './../constants';
import { mapTo, mapToMany } from './../util';

export const createChannelLoaders = (connection) => ({
  channel: new DataLoader((ids) =>
    connection(TableNames.CHANNELS)
      .whereIn('id', ids)
      .select()
      .then(mapTo(ids, (channel) => channel.id))
  ),
  channelsByServer: new DataLoader((ids) =>
    connection(TableNames.CHANNELS)
      .whereIn('serverId', ids)
      .select()
      .then(mapToMany(ids, (channel) => channel.serverId))
  ),
});
