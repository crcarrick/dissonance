import { ForbiddenError } from 'apollo-server';
import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';
import { ServerDataSource } from '@dissonance/domains/server';
import { serverMock, userMock } from '@dissonance/test-utils';

describe('ServerDataSource', () => {
  const user = userMock();
  const server1 = serverMock({ ownerId: user.id });
  const server2 = serverMock();
  const server3 = serverMock();
  const server4 = serverMock({ userId: server3.userId });

  let dbClient;
  let servers;
  beforeAll(() => {
    dbClient = knex({});

    servers = new ServerDataSource(dbClient, TABLE_NAMES.SERVERS);

    servers.initialize({
      cache: {},
      context: {
        user,
      },
    });
  });

  describe('Gets', () => {
    test('servers by user using a dataloader', async () => {
      dbClient().select.mockResolvedValueOnce([
        server4,
        server3,
        server2,
        server1,
      ]);

      const expected = await Promise.all([
        servers.getByUser(server1.userId),
        servers.getByUser(server2.userId),
        servers.getByUser(server3.userId),
      ]);

      expect(dbClient().select).toHaveBeenCalledTimes(1);

      expect(expected).toEqual(
        expect.arrayContaining([
          [server1],
          [server2],
          expect.arrayContaining([server3, server4]),
        ])
      );
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

      expect(dbClient().insert).toHaveBeenNthCalledWith(1, server1);
      expect(dbClient().into).toHaveBeenNthCalledWith(1, TABLE_NAMES.SERVERS);
      expect(expected).toEqual(server1);
    });

    test('new welcome and general channels for newly created servers', async () => {
      await servers.create(server1);

      expect(dbClient().insert).toHaveBeenNthCalledWith(2, [
        {
          name: 'welcome',
          serverId: server1.id,
        },
        {
          name: 'general',
          serverId: server1.id,
        },
      ]);
      expect(dbClient().into).toHaveBeenNthCalledWith(2, TABLE_NAMES.CHANNELS);
    });

    test('joins the creator to the server', async () => {
      await servers.create(server1);

      expect(dbClient().insert).toHaveBeenNthCalledWith(3, {
        userId: servers.context.user.id,
        serverId: server1.id,
      });
      expect(dbClient().into).toHaveBeenNthCalledWith(
        3,
        TABLE_NAMES.USERS_SERVERS
      );
    });
  });

  describe('Deletes', () => {
    test('servers if authorized', async () => {
      servers.byIdLoader.load = jest.fn(() => server1);

      const expected = await servers.delete(server1.id);

      expect(dbClient().del).toHaveBeenCalledTimes(1);
      expect(dbClient().where).toHaveBeenCalledWith({
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

      expect(dbClient().where).toHaveBeenCalledWith(
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

      expect(dbClient().where).toHaveBeenNthCalledWith(2, 'id', server1.id);
      expect(dbClient().update).toHaveBeenCalledWith('avatarUrl', expected.url);
    });
  });
});
