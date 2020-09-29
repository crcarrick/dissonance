import { ForbiddenError } from 'apollo-server';
import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';

import { ServerDataSource } from './server.datasource';

describe('ServerDataSource', () => {
  const [server1, server2, server3, server4] = new Array(4)
    .fill(null)
    .map((_, i) => ({
      id: `${i + 1}`,
      name: `Server ${i + 1}`,
      // use same userId for server3 & server4 to test byUserLoader
      userId: i === 3 ? `${i}` : `${i + 1}`,
      ownerId: `${i + 1}`,
    }));

  let dbClient;
  let servers;
  beforeAll(() => {
    dbClient = knex({});

    servers = new ServerDataSource(dbClient, TABLE_NAMES.SERVERS);

    servers.initialize({
      cache: {},
      context: {
        user: { id: '1' },
      },
    });
  });

  describe('gets', () => {
    test('servers by user using a dataloader', async () => {
      dbClient().select.mockReturnValueOnce(
        Promise.resolve([server4, server3, server2, server1])
      );

      const [expected1, expected2, expected3] = await Promise.all([
        servers.getByUser(server1.userId),
        servers.getByUser(server2.userId),
        servers.getByUser(server3.userId),
      ]);

      expect(dbClient().select.mock.calls.length).toBe(1);

      expect(expected1).toContain(server1);
      expect(expected2).toContain(server2);
      expect(expected3).toContain(server3);
      expect(expected3).toContain(server4);
    });
  });

  describe('creates', () => {
    beforeEach(() => {
      dbClient().returning.mockReturnValueOnce([server1]);
    });

    test('using a transaction', async () => {
      await servers.create(server1);

      expect(dbClient.transaction).toHaveBeenCalled();
    });

    test('new servers', async () => {
      const expected = await servers.create(server1);

      expect(dbClient().insert.mock.calls[0][0]).toEqual(
        expect.objectContaining(server1)
      );
      expect(dbClient().into.mock.calls[0][0]).toEqual(TABLE_NAMES.SERVERS);
      expect(expected).toEqual(server1);
    });

    test('new welcome and general channels for newly created servers', async () => {
      await servers.create(server1);

      expect(dbClient().insert.mock.calls[1][0]).toContainEqual({
        name: 'welcome',
        serverId: server1.id,
      });
      expect(dbClient().insert.mock.calls[1][0]).toContainEqual({
        name: 'general',
        serverId: server1.id,
      });
      expect(dbClient().into.mock.calls[1][0]).toEqual(TABLE_NAMES.CHANNELS);
    });

    test('joins the creator to the server', async () => {
      await servers.create(server1);

      expect(dbClient().insert.mock.calls[2][0]).toEqual({
        userId: servers.context.user.id,
        serverId: server1.id,
      });
      expect(dbClient().into.mock.calls[2][0]).toEqual(
        TABLE_NAMES.USERS_SERVERS
      );
    });
  });

  describe('deletes', () => {
    test('servers if authorized', async () => {
      servers.byIdLoader.load = jest.fn(() => server1);

      const expected = await servers.delete(server1.id);

      expect(dbClient().del.mock.calls.length).toBe(1);
      expect(dbClient().where.mock.calls[0][0]).toEqual({
        id: server1.id,
        ownerId: servers.context.user.id,
      });
      expect(expected.id).toBe(server1.id);
    });

    test('throws the correct errors if not authorized', async () => {
      servers.byIdLoader.load = jest.fn(() => server2);

      await expect(servers.delete(server2.id)).rejects.toThrow(ForbiddenError);
    });
  });

  describe('signed urls', () => {
    beforeEach(() => {
      servers.createS3SignedUrl = jest.fn((fileName) => ({
        url: `www.test.com/${fileName}`,
        signedUrl: 'www.test.com',
      }));
    });

    test('create if authorized', async () => {
      dbClient().first.mockReturnValueOnce(true);

      const expected = await servers.createSignedUrl({
        fileName: 'test.png',
      });

      expect(expected.url).toBe('www.test.com/test.png');
      expect(expected.signedUrl).toBe('www.test.com');
    });

    test('create for the correct server', async () => {
      dbClient().first.mockReturnValueOnce(true);

      await servers.createSignedUrl({
        serverId: server1.id,
      });

      expect(dbClient().where.mock.calls[0][0]).toEqual(
        expect.objectContaining({ id: server1.id })
      );
    });

    test('throws the correct error if not authorized', async () => {
      dbClient().first.mockReturnValueOnce(false);

      await expect(servers.createSignedUrl({})).rejects.toThrow(ForbiddenError);
    });

    test('update the correct server with the new url', async () => {
      const expected = await servers.createSignedUrl({
        fileName: 'test.png',
        serverId: server1.id,
      });

      expect(dbClient().where.mock.calls[1][1]).toBe(server1.id);
      expect(dbClient().update.mock.calls[0][1]).toBe(expected.url);
    });
  });
});

// xdescribe('ServerDataSource', () => {
//   const tracker = mockKnex.getTracker();
//   const server1 = { id: '1', name: 'foo', userId: '1', ownerId: '1' };
//   const server2 = { id: '2', name: 'bar', userId: '2', ownerId: '2' };
//   const server3 = { id: '3', name: 'baz', userId: '3', ownerId: '3' };

//   let servers;
//   beforeAll(() => {
//     const dbClient = knex({
//       client: 'postgres',
//       connection: '',
//       useNullAsDefault: false,
//     });

//     mockKnex.mock(dbClient);

//     servers = new ServerDataSource(dbClient, TABLE_NAMES.SERVERS);

//     servers.initialize({
//       cache: {},
//       context: {
//         user: { id: '1' },
//       },
//     });
//   });

//   describe('gets', () => {
//     beforeEach(() => {
//       tracker.install();
//     });

//     afterEach(() => {
//       tracker.uninstall();
//     });

//     test('servers by user', async () => {
//       tracker.on('query', (query) => {
//         query.response([server3, server2, server1]);
//       });

//       const [expected1] = await servers.getByUser('1');
//       const [expected2] = await servers.getByUser('2');
//       const [expected3] = await servers.getByUser('3');

//       expect(expected1).toEqual(server1);
//       expect(expected2).toEqual(server2);
//       expect(expected3).toEqual(server3);
//     });
//   });

//   describe('creates', () => {
//     // FIXME: This kind of sucks and seems brittle
//     const findResponse = (query) => {
//       const responses = {
//         BEGIN: () => query.response(),
//         [`insert into "${TABLE_NAMES.SERVERS}"`]: () =>
//           query.response([server1]),
//         [`insert into "${TABLE_NAMES.CHANNELS}"`]: () => query.response(),
//         [`insert into "${TABLE_NAMES.USERS_SERVERS}"`]: () => query.response(),
//         COMMIT: () => query.response(),
//       };

//       return find(responses, (_, sql) => query.sql.includes(sql));
//     };

//     beforeEach(() => {
//       tracker.install();
//     });

//     afterEach(() => {
//       tracker.uninstall();
//     });

//     test('uses a transaction', async () => {
//       tracker.on('query', (query) => {
//         expect(query.transacting).toBe(true);
//       });
//     });

//     test('new servers', async () => {
//       tracker.on('query', (query) => {
//         findResponse(query)();
//       });

//       const expected = await servers.create({ name: 'foo' });

//       expect(expected).toEqual(server1);
//     });

//     test('new welcome and general channels', async (done) => {
//       tracker.on('query', (query) => {
//         if (query.sql.includes(`insert into "${TABLE_NAMES.CHANNELS}"`)) {
//           expect(query.method).toBe('insert');
//           expect(query.bindings).toContain('welcome');
//           expect(query.bindings).toContain('general');
//         }

//         findResponse(query)();
//       });

//       await servers.create({ name: 'foo' });

//       done();
//     });

//     test('joins the creator to the server', async (done) => {
//       tracker.on('query', (query) => {
//         if (query.sql.includes(`insert into "${TABLE_NAMES.USERS_SERVERS}"`)) {
//           expect(query.method).toBe('insert');
//           expect(query.bindings).toContain(server1.id);
//           expect(query.bindings).toContain(servers.context.user.id);
//         }

//         findResponse(query)();
//       });

//       await servers.create({ name: 'foo' });

//       done();
//     });
//   });

//   describe('deletes', () => {
//     beforeEach(() => {
//       tracker.install();
//     });

//     afterEach(() => {
//       tracker.uninstall();
//     });

//     test('servers if authorized', async () => {
//       tracker.on('query', (query, step) => {
//         const steps = [
//           () => query.response([server1]),
//           () => query.response([server1.id]),
//         ];

//         steps[step - 1]();
//       });

//       const expected = await servers.delete(server1.id);

//       expect(expected.id).toBe(server1.id);
//     });

//     test('throws the correct errors if not authorized', async () => {
//       tracker.on('query', (query, step) => {
//         const steps = [
//           () => query.response([server2]),
//           () => query.response([server2.id]),
//         ];

//         steps[step - 1]();
//       });

//       await expect(servers.delete(server2.id)).rejects.toThrow(ForbiddenError);
//     });
//   });

//   describe('signed urls', () => {
//     beforeEach(() => {
//       tracker.install();
//     });

//     afterEach(() => {
//       tracker.uninstall();
//     });

//     test('create if authorized', async () => {
//       servers.createS3SignedUrl = jest.fn(() => ({
//         url: 'foo',
//         signedUrl: 'bar',
//       }));

//       tracker.on('query', (query, step) => {
//         const steps = [() => query.response([true]), () => query.response()];

//         steps[step - 1]();
//       });

//       const expected = await servers.createSignedUrl({
//         fileName: 'foo',
//         serverId: server1.id,
//       });

//       expect(expected).toEqual({ url: 'foo', signedUrl: 'bar' });
//     });

//     test('throws the correct error if not authorized', async () => {
//       servers.createS3SignedUrl = jest.fn(() => ({
//         url: 'foo',
//         signedUrl: 'bar',
//       }));

//       tracker.on('query', (query, step) => {
//         const steps = [() => query.response([false]), () => query.response()];

//         steps[step - 1]();
//       });

//       await expect(
//         servers.createSignedUrl({ fileName: 'foo', serverId: server2.id })
//       ).rejects.toThrow(ForbiddenError);
//     });

//     test('update the server with the new url', async (done) => {
//       servers.createS3SignedUrl = jest.fn(() => ({
//         url: 'foo',
//         signedUrl: 'bar',
//       }));

//       tracker.on('query', (query, step) => {
//         const steps = [() => query.response([true]), () => query.response()];

//         if (step === 2) {
//           expect(query.method).toBe('update');
//           expect(query.bindings).toContain('foo');
//         }

//         steps[step - 1]();
//       });

//       await servers.createSignedUrl({ fileName: 'foo', serverId: server1.id });

//       done();
//     });
//   });
// });
