import crypto from 'crypto';
import knex from 'knex';

import { SQLDataSource } from './sql.datasource';

describe('SQLDataSource', () => {
  const [record1, record2, record3] = new Array(3).fill(null).map((_, i) => ({
    id: `${i + 1}`,
  }));

  let dbClient;
  let sql;
  let resetCache;
  beforeAll(() => {
    dbClient = knex({});

    sql = new SQLDataSource(dbClient, 'foos');

    resetCache = () =>
      sql.initialize({
        cache: {
          get: jest.fn(),
          set: jest.fn(),
        },
      });

    resetCache();
  });

  describe('gets', () => {
    test('all', async () => {
      resetCache();

      dbClient().select.mockReturnValueOnce([record1, record2, record3]);

      const expected = await sql.get();

      expect(expected).toEqual([record1, record2, record3]);
    });

    test('by id using a dataloader', async () => {
      dbClient().select.mockReturnValueOnce(
        Promise.resolve([record3, record2, record1])
      );

      const [expected1, expected2, expected3] = await Promise.all([
        sql.getById(record1.id),
        sql.getById(record2.id),
        sql.getById(record3.id),
      ]);

      expect(dbClient().select.mock.calls.length).toBe(1);

      expect(expected1).toEqual(record1);
      expect(expected2).toEqual(record2);
      expect(expected3).toEqual(record3);
    });
  });

  describe('creates', () => {
    test('a new record', async () => {
      dbClient().returning.mockReturnValueOnce([record1]);

      const expected = await sql.create(record1);

      expect(dbClient().insert.mock.calls[0][0]).toEqual(record1);
      expect(expected).toContain(record1);
    });
  });

  describe('updates', () => {
    test('a record by id', async () => {
      dbClient().returning.mockReturnValueOnce([record1]);

      const expected = await sql.update({ id: record1.id, fields: record1 });

      expect(dbClient().update.mock.calls[0][0]).toEqual(record1);
      expect(dbClient().where.mock.calls[0][1]).toBe(record1.id);
      expect(expected).toEqual(record1);
    });
  });

  describe('deletes', () => {
    test('a record by id', async () => {
      dbClient().returning.mockReturnValueOnce([{ id: record1.id }]);

      const expected = await sql.delete(record1.id);

      expect(dbClient().del.mock.calls.length).toBe(1);
      expect(dbClient().where.mock.calls[0][1]).toBe(record1.id);
      expect(expected).toEqual({ id: record1.id });
    });
  });

  describe('caches', () => {
    let createHashMock;
    let hashMock;
    beforeEach(() => {
      resetCache();

      hashMock = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValueOnce('key'),
      };
      createHashMock = jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => hashMock);
    });

    afterEach(() => {
      createHashMock.mockRestore();
    });

    test('creates a unique cash key', async () => {
      const query = {
        toString: () => 'test',
      };

      const expected = await sql.createKeyFromQuery(query);

      expect(createHashMock.mock.calls[0][0]).toBe('sha1');
      expect(hashMock.update.mock.calls[0][0]).toBe('test');
      expect(hashMock.digest.mock.calls[0][0]).toBe('base64');
      expect(expected).toBe('key');
    });

    // TODO: This test is kind of gross
    test('a query result for {ttl}', async () => {
      const rows = [record1, record2, record3];
      const ttl = 10;
      const query = Promise.resolve(rows);
      query.toString = () => 'test';

      const expected1 = await sql.cacheQuery({
        ttl,
        query,
      });

      expect(sql.cache.get.mock.calls[0][0]).toBe('key');
      expect(sql.cache.get.mock.calls.length).toBe(1);
      expect(sql.cache.set.mock.calls[0][0]).toBe('key');
      expect(sql.cache.set.mock.calls.length).toBe(1);
      expect(sql.cache.set.mock.calls[0][1]).toBe(JSON.stringify(rows));
      expect(sql.cache.set.mock.calls[0][2]).toEqual({ ttl });
      expect(expected1).toEqual(rows);

      sql.cache.get.mockReturnValueOnce(JSON.stringify(rows));

      const expected2 = await sql.cacheQuery({
        ttl,
        query,
      });

      expect(sql.cache.get.mock.calls.length).toBe(2);
      expect(sql.cache.set.mock.calls.length).toBe(1);
      expect(expected2).toEqual(rows);
    });
  });
});
