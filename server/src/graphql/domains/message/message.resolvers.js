import { withFilter } from 'apollo-server';

import { MESSAGE_ADDED_EVENT } from './message.events';

export const resolvers = {
  Mutation: {
    createMessage: (
      _,
      { input: { channelId, text } },
      { dataSources: { messages } }
    ) => messages.create({ channelId, text }),
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(MESSAGE_ADDED_EVENT),
        ({ messageAdded }, { input: { channelId } }) =>
          messageAdded.channelId === channelId
      ),
    },
  },
  Message: {
    author: (message, _, { dataSources: { users } }) =>
      users.getById(message.authorId),
    channel: (message, _, { dataSources: { channels } }) =>
      channels.getById(message.channelId),
  },
};
