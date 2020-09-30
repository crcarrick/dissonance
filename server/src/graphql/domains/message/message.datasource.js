import { ForbiddenError } from 'apollo-server';
import DataLoader from 'dataloader';

import { TABLE_NAMES } from '@dissonance/constants';
import { SQLDataSource } from '@dissonance/domains/sql.datasource';
import { mapToMany } from '@dissonance/utils';

import { MESSAGE_ADDED_EVENT } from './message.events';

export class MessageDataSource extends SQLDataSource {
  columns = ['id', 'text', 'authorId', 'channelId', 'createdAt', 'updatedAt'];

  constructor(dbClient, table) {
    super(dbClient, table);

    this.byChannelLoader = new DataLoader((ids) =>
      this.db(this.table)
        .whereIn('channelId', ids)
        .select()
        .then(mapToMany(ids, (message) => message.channelId))
    );
  }

  async getByChannel(channelId) {
    try {
      const channel = await this.byChannelLoader.load(channelId);

      return channel;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async create({ channelId, text }) {
    try {
      const { pubsub, user } = this.context;

      const authorized = await this.db(TABLE_NAMES.CHANNELS)
        .whereIn(
          'serverId',
          this.db(TABLE_NAMES.USERS_SERVERS)
            .select('serverId')
            .where('userId', user.id)
        )
        .andWhere('id', channelId)
        .select()
        .first();

      if (!Boolean(authorized)) {
        throw new ForbiddenError();
      }

      const [message] = await this.db(this.table)
        .insert({ authorId: user.id, channelId, text })
        .returning(this.columns);

      pubsub.publish(MESSAGE_ADDED_EVENT, {
        messageAdded: message,
      });

      return message;
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
