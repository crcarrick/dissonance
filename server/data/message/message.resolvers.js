import { withFilter } from 'apollo-server';

import { MESSAGE_ADDED_EVENT } from './../constants';

const messageAdded = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(MESSAGE_ADDED_EVENT),
    ({ messageAdded: { channel } }, { input: { channelId } }) =>
      channel === channelId
  ),
};

export const resolvers = {
  Mutation: {
    createMessage: (
      _,
      { input: { channelId, text } },
      { dataSources: { messages } }
    ) => messages.create({ channelId, text }),
  },
  Subscription: {
    messageAdded,
  },
  Message: {
    author: (message, _, { dataSources: { users } }) =>
      users.byIdLoader.load(message.authorId),
    channel: (message, _, { dataSources: { channels } }) =>
      channels.byIdLoader.load(message.channelId),
  },
};
