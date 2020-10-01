import { MESSAGE_ADDED_EVENT, resolvers } from '@dissonance/domains/message';

describe('Message Resolvers', () => {
  describe('Mutation', () => {
    test('createMessage', () => {
      const input = { channelId: '1', text: 'Test Message' };
      const dataSources = {
        messages: {
          create: jest.fn(),
        },
      };

      resolvers.Mutation.createMessage(null, { input }, { dataSources });

      expect(dataSources.messages.create).toHaveBeenCalledWith(input);
    });
  });

  describe('Subscription', () => {
    test('messageAdded', () => {
      const pubsub = {
        asyncIterator: jest.fn(),
      };

      resolvers.Subscription.messageAdded.subscribe(null, null, { pubsub });

      expect(pubsub.asyncIterator).toHaveBeenCalledWith(MESSAGE_ADDED_EVENT);
    });
  });

  describe('Message', () => {
    test('author', () => {
      const message = { authorId: '1' };
      const dataSources = {
        users: {
          getById: jest.fn(),
        },
      };

      resolvers.Message.author(message, null, { dataSources });

      expect(dataSources.users.getById).toHaveBeenCalledWith(message.authorId);
    });

    test('channel', () => {
      const message = { channelId: '1' };
      const dataSources = {
        channels: {
          getById: jest.fn(),
        },
      };

      resolvers.Message.channel(message, null, { dataSources });

      expect(dataSources.channels.getById).toHaveBeenCalledWith(
        message.channelId
      );
    });
  });
});
