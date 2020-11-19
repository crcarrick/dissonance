import { ForbiddenError, UserInputError } from 'apollo-server';
import DataLoader from 'dataloader';

import { TABLE_NAMES } from '@dissonance/constants';
import { SQLDataSource } from '@dissonance/domains/sql.datasource';
import { mapToMany } from '@dissonance/utils';

import { MESSAGE_ADDED_EVENT } from './message.events';
import { reverse } from 'lodash';

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

  async getMessageFeed({ after, before, first, last, channelId }) {
    try {
      const authorized = this.userBelongsToChannel(channelId);

      if (!authorized) {
        throw new ForbiddenError();
      }

      if (
        (!first && !last) ||
        (first && last) ||
        (first && before) ||
        (last && after)
      ) {
        throw new UserInputError();
      }

      const messages = await this.getMessageFeedQuery({
        after,
        before,
        first,
        last,
        channelId,
      });

      const edges = this.getEdges({ first, last, messages });

      const pageInfo = this.getPageInfo({
        after,
        before,
        first,
        last,
        edges,
        messages,
      });

      return {
        edges,
        pageInfo,
        totalCount: messages[0].totalCount,
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

  getEdges({ first, last, messages }) {
    const length =
      messages.length === (first || last) + 1
        ? messages.length - 1
        : messages.length;

    const edges = messages.slice(0, length).map((message) => ({
      node: message,
      cursor: this.createCursor(message),
    }));

    return last ? edges.reverse() : edges;
  }

  getMessageFeedQuery({ after, before, first, last, channelId }) {
    let query = this.db(this.table).where('channelId', channelId);
    let selectArgs = [
      ...this.columns,
      this.db(this.table).count('id').as('totalCount'),
    ];

    if (after || before) {
      const comparator = after ? '>' : '<';
      const reverseComparator = after ? '<' : '>';
      const cursor = this.decodeCursor(after || before);

      query = query.where('createdAt', comparator, cursor);
      selectArgs = [
        ...selectArgs,
        this.db(this.table)
          .count('id')
          .where('createdAt', reverseComparator, cursor)
          .as('lookAhead'),
      ];
    }

    return query
      .orderBy('createdAt', first ? 'asc' : 'desc')
      .limit((first || last) + 1)
      .select(...selectArgs);
  }

  getPageInfo({ after, before, first, last, edges, messages }) {
    const hasMoreRecords = Number(messages[0].lookAhead) > 0;

    let hasPreviousPage;
    let hasNextPage;

    if (first) {
      hasPreviousPage = hasPreviousPage || false;
      hasNextPage = messages.length === first + 1;
    } else if (last) {
      hasPreviousPage = messages.length === last + 1;
      hasNextPage = hasNextPage || false;
    }

    if (after) {
      hasPreviousPage = hasMoreRecords;
    } else if (before) {
      hasNextPage = hasMoreRecords;
    }

    return {
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0].cursor,
      endCursor: edges[edges.length - 1].cursor,
    };
  }
}
