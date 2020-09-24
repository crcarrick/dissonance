import { ForbiddenError } from 'apollo-server';
import DataLoader from 'dataloader';

import { MESSAGE_ADDED_EVENT, TABLE_NAMES } from './../constants';
import { SQLDataSource } from './../sql.datasource';
import { mapToMany } from './../util';

export class MessageDataSource extends SQLDataSource {
  constructor(dbClient, table) {
    super(dbClient, table);

    this.byChannelLoader = new DataLoader((ids) =>
      this.db(this.table)
        .whereIn('channelId', ids)
        .select()
        .then(mapToMany(ids, (message) => message.channelId))
    );
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
        .returning([
          'id',
          'text',
          'authorId',
          'channelId',
          'createdAt',
          'updatedAt',
        ]);

      pubsub.publish(MESSAGE_ADDED_EVENT, {
        messageAdded: message,
      });

      return message;
    } catch (error) {
      this.didEncounterError(error);
    }
  }
}
