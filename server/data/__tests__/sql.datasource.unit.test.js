import knex from 'knex';
import mockKnex from 'mock-knex';

import { SQLDataSource } from '../sql.datasource';

describe('SQLDataSource', () => {
  const tracker = mockKnex.getTracker();
  const foos = ['foo', 'bar', 'baz'];

  let sql;
  beforeAll(() => {
    const dbClient = knex({
      client: 'postgres',
      connection: '',
      useNullAsDefault: false,
    });

    mockKnex.mock(dbClient);

    sql = new SQLDataSource(dbClient, 'foos');

    sql.initialize({
      cache: {
        get: jest.fn(),
        set: jest.fn(),
      },
    });
  });

  describe('gets', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('all', async () => {
      tracker.on('query', (query) => {
        query.response(foos);
      });

      const expected = await sql.get();

      expect(expected).toEqual(foos);
    });

    test('caches all', async () => {
      let queries = 0;
      tracker.on('query', (query) => {
        queries += 1;

        query.response(foos);
      });

      await sql.get();

      expect(queries).toBe(1);
      expect(sql.cache.get).toHaveBeenCalledTimes(1);
      expect(sql.cache.set).toHaveBeenCalledTimes(1);

      sql.cache.get.mockReturnValueOnce(true);

      await sql.get();

      expect(queries).toBe(1);
      expect(sql.cache.get).toHaveBeenCalledTimes(2);
      expect(sql.cache.set).toHaveBeenCalledTimes(1);
    });

    xtest('by id', async () => {});
  });

  xdescribe('updates', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('by id', async () => {});
  });

  xdescribe('deletes', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('by id', async () => {});
  });
});
