import { ApolloError } from 'apollo-server';
import crypto from 'crypto';
import knex from 'knex';

import { SQLDataSource } from '@dissonance/domains/sql.datasource';

describe('SQLDataSource', () => {
  const [record1, record2, record3] = new Array(3).fill(null).map((_, i) => ({
    id: `${i + 1}`,
  }));

  let dbClient;
  let sql;
  beforeAll(() => {
    dbClient = knex({});

    sql = new SQLDataSource(dbClient, 'foos');

    sql.initialize({
      cache: {
        get: jest.fn(),
        set: jest.fn(),
      },
    });
  });

  describe('Gets', () => {
    test('all', async () => {
      dbClient().select.mockReturnValueOnce([record1, record2, record3]);

      const expected = await sql.get();

      expect(expected).toEqual([record1, record2, record3]);
    });

    test('by id using a dataloader', async () => {
      dbClient().select.mockResolvedValueOnce([record3, record2, record1]);

      const expected = await Promise.all([
        sql.getById(record1.id),
        sql.getById(record2.id),
        sql.getById(record3.id),
      ]);

      expect(dbClient().select).toHaveBeenCalledTimes(1);

      expect(expected).toEqual([record1, record2, record3]);
    });
  });

  describe('Creates', () => {
    test('new records', async () => {
      dbClient().returning.mockReturnValueOnce([record1]);

      const expected = await sql.create(record1);

      expect(dbClient().insert).toHaveBeenCalledWith(record1);
      expect(expected).toEqual(record1);
    });
  });

  describe('Updates', () => {
    test('records by id', async () => {
      dbClient().returning.mockReturnValueOnce([record1]);

      const expected = await sql.update({ id: record1.id, fields: record1 });

      expect(dbClient().update).toHaveBeenCalledWith(record1);
      expect(dbClient().where).toHaveBeenCalledWith('id', record1.id);
      expect(expected).toEqual(record1);
    });
  });

  describe('Deletes', () => {
    test('records by id', async () => {
      dbClient().returning.mockReturnValueOnce([{ id: record1.id }]);

      const expected = await sql.delete(record1.id);

      expect(dbClient().del).toHaveBeenCalledTimes(1);
      expect(dbClient().where).toHaveBeenCalledWith('id', record1.id);
      expect(expected).toEqual({ id: record1.id });
    });
  });

  describe('Caches', () => {
    let createHashMock;
    let hashMock;
    beforeEach(() => {
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

    test('by a unique cash key', async () => {
      const query = {
        toString: () => 'test',
      };

      const expected = await sql.createKeyFromQuery(query);

      expect(createHashMock).toHaveBeenCalledWith('sha1');
      expect(hashMock.update).toHaveBeenCalledWith('test');
      expect(hashMock.digest).toHaveBeenCalledWith('base64');
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

      expect(sql.cache.get).toHaveBeenCalledTimes(1);
      expect(sql.cache.get).toHaveBeenNthCalledWith(1, 'key');
      expect(sql.cache.set).toHaveBeenCalledTimes(1);
      expect(sql.cache.set).toHaveBeenNthCalledWith(
        1,
        'key',
        JSON.stringify(rows),
        {
          ttl,
        }
      );
      expect(expected1).toEqual(rows);

      sql.cache.get.mockReturnValueOnce(JSON.stringify(rows));

      const expected2 = await sql.cacheQuery({
        ttl,
        query,
      });

      expect(sql.cache.get).toHaveBeenCalledTimes(2);
      expect(sql.cache.set).toHaveBeenCalledTimes(1);
      expect(expected2).toEqual(rows);
    });
  });

  describe('Errors', () => {
    test('rethrows error if it is an instance of ApolloError', () => {
      const error = new ApolloError('Test', 'TEST_ERROR');

      expect(() => sql.didEncounterError(error)).toThrow(error);
    });

    test('throw generic INTERNAL_SERVER_ERROR if it is not an instance of ApolloError', () => {
      const error = new Error('Test');

      const expected = () => sql.didEncounterError(error, false);
      expect(expected).toThrow(ApolloError);
      expect(expected).toThrow('Something went wrong');
    });
  });
});
