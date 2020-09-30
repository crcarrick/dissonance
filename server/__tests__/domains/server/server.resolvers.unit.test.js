import { resolvers } from '@dissonance/domains/server';

describe('Server Resolvers', () => {
  describe('Query', () => {
    test('server', () => {
      const input = { id: '1' };
      const dataSources = {
        servers: {
          getById: jest.fn(),
        },
      };

      resolvers.Query.server(null, { input }, { dataSources });

      expect(dataSources.servers.getById.mock.calls[0][0]).toBe(input.id);
    });

    test('servers', () => {
      const dataSources = {
        servers: {
          get: jest.fn(),
        },
      };

      resolvers.Query.servers(null, null, { dataSources });

      expect(dataSources.servers.get.mock.calls.length).toBe(1);
    });
  });

  describe('Mutation', () => {
    test('createServerAvatarSignedUrl', () => {
      const input = { fileName: 'test.png', serverId: '1' };
      const dataSources = {
        servers: {
          createSignedUrl: jest.fn(),
        },
      };

      resolvers.Mutation.createServerAvatarSignedUrl(
        null,
        { input },
        { dataSources }
      );

      expect(dataSources.servers.createSignedUrl.mock.calls[0][0]).toEqual(
        input
      );
    });

    test('createServer', () => {
      const input = { name: 'Test Server' };
      const dataSources = {
        servers: {
          create: jest.fn(),
        },
      };

      resolvers.Mutation.createServer(null, { input }, { dataSources });

      expect(dataSources.servers.create.mock.calls[0][0]).toEqual(input);
    });

    test('deleteServer', () => {
      const input = { id: '1' };
      const dataSources = {
        servers: {
          delete: jest.fn(),
        },
      };

      resolvers.Mutation.deleteServer(null, { input }, { dataSources });

      expect(dataSources.servers.delete.mock.calls[0][0]).toEqual(input.id);
    });

    test('updateServer', () => {
      const input = { id: '1', fields: { name: 'Test Server 2' } };
      const dataSources = {
        servers: {
          update: jest.fn(),
        },
      };

      resolvers.Mutation.updateServer(null, { input }, { dataSources });

      expect(dataSources.servers.update.mock.calls[0][0]).toEqual(input);
    });
  });

  describe('Server', () => {
    test('channels', () => {
      const server = { id: '1' };
      const dataSources = {
        channels: {
          getByServer: jest.fn(),
        },
      };

      resolvers.Server.channels(server, null, { dataSources });

      expect(dataSources.channels.getByServer.mock.calls[0][0]).toBe(server.id);
    });

    test('owner', () => {
      const server = { ownerId: '1' };
      const dataSources = {
        users: {
          getById: jest.fn(),
        },
      };

      resolvers.Server.owner(server, null, { dataSources });

      expect(dataSources.users.getById.mock.calls[0][0]).toBe(server.ownerId);
    });

    test('users', () => {
      const server = { id: '1' };
      const dataSources = {
        users: {
          getByServer: jest.fn(),
        },
      };

      resolvers.Server.users(server, null, { dataSources });

      expect(dataSources.users.getByServer.mock.calls[0][0]).toBe(server.id);
    });
  });
});
