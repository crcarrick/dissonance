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
        .orderBy('createdAt', 'asc')
        .select()
        .then(mapToMany(ids, (message) => message.channelId))
    );
  }

  async getByChannel(channelId) {
    try {
      const authorized = this.userBelongsToChannel(channelId);

      if (!authorized) {
        throw new ForbiddenError();
      }

      const channel = await this.byChannelLoader.load(channelId);

      return channel;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async getMessageFeed({ before, first, channelId }) {
    try {
      const authorized = this.userBelongsToChannel(channelId);

      if (!authorized) {
        throw new ForbiddenError();
      }

      let query = this.db(this.table).where('channelId', channelId);

      if (before) {
        query = query.whereRaw(
          '(created_at, id) < (?, ?)',
          this.decodeCursor(before)
        );
      }

      const messages = await query
        .orderBy('createdAt', 'desc')
        .limit(first)
        .select();

      const start = messages[0];
      const end = messages[messages.length - 1];

      return {
        edges: messages.map((message) => ({
          cursor: this.createCursor(message),
          node: message,
        })),
        pageInfo: {
          startCursor: this.createCursor(start),
          endCursor: this.createCursor(end),
          // TODO
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async create({ channelId, text }) {
    try {
      const { pubsub, user } = this.context;

      const authorized = this.userBelongsToChannel(channelId);

      if (!authorized) {
        throw new ForbiddenError();
      }

      const [message] = await this.db(this.table)
        .insert({ authorId: user.id, channelId, text })
        .returning(this.columns);

      pubsub.publish(MESSAGE_ADDED_EVENT, {
        messageAdded: {
          cursor: this.createCursor(message),
          node: message,
        },
      });

      return message;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async userBelongsToChannel(channelId) {
    const { user } = this.context;

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

    return Boolean(authorized);
  }

  createCursor(message) {
    if (message) {
      const cursor = `${message.createdAt.getTime()},${message.id}`;
      const buffer = Buffer.from(cursor);

      return buffer.toString('base64');
    }

    return '';
  }

  decodeCursor(cursor) {
    const buffer = Buffer.from(cursor, 'base64');
    const [createdAt, id] = buffer.toString('ascii').split(',');

    return [new Date(parseInt(createdAt, 10)), id];
  }
}
