import { resolvers } from '@dissonance/domains/userServer';

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

      expect(dataSources.usersServers.joinServer).toHaveBeenCalledWith(
        input.serverId
      );
    });
  });
});
