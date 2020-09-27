import { ForbiddenError } from 'apollo-server';
import knex from 'knex';
import { find } from 'lodash';
import mockKnex from 'mock-knex';

import { TABLE_NAMES } from '@dissonance/constants';

import { ServerDataSource } from './server.datasource';

describe('ServerDataSource', () => {
  const tracker = mockKnex.getTracker();
  const server1 = { id: '1', name: 'foo', userId: '1', ownerId: '1' };
  const server2 = { id: '2', name: 'bar', userId: '2', ownerId: '2' };
  const server3 = { id: '3', name: 'baz', userId: '3', ownerId: '3' };

  let servers;
  beforeAll(() => {
    const dbClient = knex({
      client: 'postgres',
      connection: '',
      useNullAsDefault: false,
    });

    mockKnex.mock(dbClient);

    servers = new ServerDataSource(dbClient, TABLE_NAMES.SERVERS);

    servers.initialize({
      cache: {},
      context: {
        user: { id: '1' },
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

    test('servers by user', async () => {
      tracker.on('query', (query) => {
        query.response([server3, server2, server1]);
      });

      const [expected1] = await servers.getByUser('1');
      const [expected2] = await servers.getByUser('2');
      const [expected3] = await servers.getByUser('3');

      expect(expected1).toEqual(server1);
      expect(expected2).toEqual(server2);
      expect(expected3).toEqual(server3);
    });
  });

  describe('creates', () => {
    // FIXME: This kind of sucks and seems brittle
    const findResponse = (query) => {
      const responses = {
        BEGIN: () => query.response(),
        [`insert into "${TABLE_NAMES.SERVERS}"`]: () =>
          query.response([server1]),
        [`insert into "${TABLE_NAMES.CHANNELS}"`]: () => query.response(),
        [`insert into "${TABLE_NAMES.USERS_SERVERS}"`]: () => query.response(),
        COMMIT: () => query.response(),
      };

      return find(responses, (_, sql) => query.sql.includes(sql));
    };

    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('uses a transaction', async () => {
      tracker.on('query', (query) => {
        expect(query.transacting).toBe(true);
      });
    });

    test('new servers', async () => {
      tracker.on('query', (query) => {
        findResponse(query)();
      });

      const expected = await servers.create({ name: 'foo' });

      expect(expected).toEqual(server1);
    });

    test('new welcome and general channels', async (done) => {
      tracker.on('query', (query) => {
        if (query.sql.includes(`insert into "${TABLE_NAMES.CHANNELS}"`)) {
          expect(query.method).toBe('insert');
          expect(query.bindings).toContain('welcome');
          expect(query.bindings).toContain('general');
        }

        findResponse(query)();
      });

      await servers.create({ name: 'foo' });

      done();
    });

    test('joins the creator to the server', async (done) => {
      tracker.on('query', (query) => {
        if (query.sql.includes(`insert into "${TABLE_NAMES.USERS_SERVERS}"`)) {
          expect(query.method).toBe('insert');
          expect(query.bindings).toContain(server1.id);
          expect(query.bindings).toContain(servers.context.user.id);
        }

        findResponse(query)();
      });

      await servers.create({ name: 'foo' });

      done();
    });
  });

  describe('deletes', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('servers if authorized', async () => {
      tracker.on('query', (query, step) => {
        const steps = [
          () => query.response([server1]),
          () => query.response([server1.id]),
        ];

        steps[step - 1]();
      });

      const expected = await servers.delete(server1.id);

      expect(expected.id).toBe(server1.id);
    });

    test('throws the correct errors if not authorized', async () => {
      tracker.on('query', (query, step) => {
        const steps = [
          () => query.response([server2]),
          () => query.response([server2.id]),
        ];

        steps[step - 1]();
      });

      await expect(servers.delete(server2.id)).rejects.toThrow(ForbiddenError);
    });
  });

  describe('signed urls', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('create if authorized', async () => {
      servers.createS3SignedUrl = jest.fn(() => ({
        url: 'foo',
        signedUrl: 'bar',
      }));

      tracker.on('query', (query, step) => {
        const steps = [() => query.response([true]), () => query.response()];

        steps[step - 1]();
      });

      const expected = await servers.createSignedUrl({
        fileName: 'foo',
        serverId: server1.id,
      });

      expect(expected).toEqual({ url: 'foo', signedUrl: 'bar' });
    });

    test('throws the correct error if not authorized', async () => {
      servers.createS3SignedUrl = jest.fn(() => ({
        url: 'foo',
        signedUrl: 'bar',
      }));

      tracker.on('query', (query, step) => {
        const steps = [() => query.response([false]), () => query.response()];

        steps[step - 1]();
      });

      await expect(
        servers.createSignedUrl({ fileName: 'foo', serverId: server2.id })
      ).rejects.toThrow(ForbiddenError);
    });

    test('update the server with the new url', async (done) => {
      servers.createS3SignedUrl = jest.fn(() => ({
        url: 'foo',
        signedUrl: 'bar',
      }));

      tracker.on('query', (query, step) => {
        const steps = [() => query.response([true]), () => query.response()];

        if (step === 2) {
          expect(query.method).toBe('update');
          expect(query.bindings).toContain('foo');
        }

        steps[step - 1]();
      });

      await servers.createSignedUrl({ fileName: 'foo', serverId: server1.id });

      done();
    });
  });
});
