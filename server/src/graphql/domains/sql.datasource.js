import { ApolloError } from 'apollo-server';
import { DataSource } from 'apollo-datasource';
import { InMemoryLRUCache } from 'apollo-server-caching';
import crypto from 'crypto';
import DataLoader from 'dataloader';

import { mapTo } from '@dissonance/utils';

export class SQLDataSource extends DataSource {
  columns = [];

  constructor(dbClient, table) {
    super();

    this.db = dbClient;
    this.table = table;

    this.byIdLoader = new DataLoader((ids) =>
      this.db(this.table)
        .whereIn('id', ids)
        .select()
        .then(mapTo(ids, (record) => record.id))
    );
  }

  initialize({ cache, context }) {
    this.cache = cache || new InMemoryLRUCache();
    this.context = context;
  }

  didEncounterError(error) {
    if (error instanceof ApolloError) {
      throw error;
    } else {
      console.log(error);

      throw new ApolloError('Something went wrong', 'INTERNAL_SERVER_ERROR');
    }
  }

  async create(fields) {
    try {
      const records = this.db(this.table)
        .insert(fields)
        .returning(this.columns);

      return records;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async get() {
    try {
      const records = await this.cacheQuery({
        query: this.db(this.table).select(),
      });

      return records;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async getById(id) {
    try {
      const record = this.byIdLoader.load(id);

      return record;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async update({ id, fields }) {
    try {
      const [record] = await this.db(this.table)
        .update(fields)
        .where('id', id)
        .returning(this.columns);

      return record;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async delete(id) {
    try {
      const record = await this.db(this.table)
        .del()
        .where('id', id)
        .returning(['id']);

      return record;
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async cacheQuery({ ttl = 5, query }) {
    const key = crypto
      .createHash('sha1')
      .update(query.toString())
      .digest('base64');

    const cacheEntry = await this.cache.get(key);

    if (cacheEntry) {
      return JSON.parse(cacheEntry);
    }

    const rows = await query;

    if (rows) {
      this.cache.set(key, JSON.stringify(rows), { ttl });
    }

    return rows;
  }
}
