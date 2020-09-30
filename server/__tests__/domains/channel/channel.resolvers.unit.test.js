import { resolvers } from '@dissonance/domains/channel';

describe('Channel Resolvers', () => {
  describe('Query', () => {
    test('channel', () => {
      const input = { id: '1' };
      const dataSources = {
        channels: {
          getById: jest.fn(),
        },
      };

      resolvers.Query.channel(null, { input }, { dataSources });

      expect(dataSources.channels.getById.mock.calls[0][0]).toBe(input.id);
    });

    test('channels', () => {
      const dataSources = {
        channels: {
          get: jest.fn(),
        },
      };

      resolvers.Query.channels(null, null, { dataSources });

      expect(dataSources.channels.get.mock.calls.length).toBe(1);
    });
  });

  describe('Mutation', () => {
    test('createChannel', () => {
      const input = { name: 'Test Channel', serverId: '1' };
      const dataSources = {
        channels: {
          create: jest.fn(),
        },
      };

      resolvers.Mutation.createChannel(null, { input }, { dataSources });

      expect(dataSources.channels.create.mock.calls[0][0]).toEqual(input);
    });
  });

  describe('Channel', () => {
    test('messages', () => {
      const channel = { id: '1' };
      const dataSources = {
        messages: {
          getByChannel: jest.fn(),
        },
      };

      resolvers.Channel.messages(channel, null, { dataSources });

      expect(dataSources.messages.getByChannel.mock.calls[0][0]).toBe(
        channel.id
      );
    });
  });
});
