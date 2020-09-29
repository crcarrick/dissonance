import { resolvers } from './userServer.resolvers';

describe('UserServer Resolvers', () => {
  describe('Mutation', () => {
    test('joinServer', () => {
      const input = { serverId: '1' };
      const dataSources = {
        usersServers: {
          joinServer: jest.fn(),
        },
      };

      resolvers.Mutation.joinServer(null, { input }, { dataSources });

      expect(dataSources.usersServers.joinServer.mock.calls[0][0]).toBe(
        input.serverId
      );
    });
  });
});
