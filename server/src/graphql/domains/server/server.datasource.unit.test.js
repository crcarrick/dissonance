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

  describe('Gets', () => {
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

  describe('Creates', () => {
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

  describe('Deletes', () => {
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

  describe('Signed urls', () => {
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
