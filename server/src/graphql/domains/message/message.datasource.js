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

  async getMessages({ after, before, first, channelId }) {
    try {
      const authorized = this.userBelongsToChannel(channelId);

      if (!authorized) {
        throw new ForbiddenError();
      }

      let query = this.db(this.table).where('channelId', channelId);

      // TODO: Figure out how to use UUID in the cursor to avoid createdAt collisions
      if (before) {
        query = query.where('createdAt', '<', this.decodeCursor(before));
      } else if (after) {
        query = query.where('createdAt', '>', this.decodeCursor(after));
      }

      const messages = await query
        .orderBy('createdAt', after ? 'asc' : 'desc')
        .limit(first)
        .select();

      return messages.map((message) => ({
        ...message,
        cursor: this.createCursor(message),
      }));
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

      const [msg] = await this.db(this.table)
        .insert({ authorId: user.id, channelId, text })
        .returning(this.columns);

      const message = {
        ...msg,
        cursor: this.createCursor(msg),
      };

      pubsub.publish(MESSAGE_ADDED_EVENT, {
        messageAdded: message,
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
      const cursor = `${message.createdAt.getTime()}`;
      const buffer = Buffer.from(cursor);

      return buffer.toString('base64');
    }

    return '';
  }

  decodeCursor(cursor) {
    const buffer = Buffer.from(cursor, 'base64');
    const createdAt = buffer.toString('ascii');

    return new Date(parseInt(createdAt, 10));
  }

  // createCursor(message) {
  //   if (message) {
  //     const cursor = `${message.createdAt.getTime()},${message.id}`;
  //     const buffer = Buffer.from(cursor);

  //     return buffer.toString('base64');
  //   }

  //   return '';
  // }

  // decodeCursor(cursor) {
  //   const buffer = Buffer.from(cursor, 'base64');
  //   const [createdAt, id] = buffer.toString('ascii').split(',');

  //   return [new Date(parseInt(createdAt, 10)), id];
  // }
}
