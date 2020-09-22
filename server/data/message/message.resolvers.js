import { AuthenticationError, withFilter } from 'apollo-server';

const MESSAGE_ADDED = 'MESSAGE_ADDED';

const createMessage = async (
  _,
  { input: { channelId, serverId, text } },
  { pubsub, user, Message }
) => {
  if (user.servers.includes(serverId)) {
    throw new AuthenticationError('Not authorized');
  }

  const message = await Message.create({
    authorId: user.id,
    channelId,
    text,
  });

  pubsub.publish(MESSAGE_ADDED, {
    messageAdded: {
      id: message.id,
      text,
      author: user,
      channel: message.channel,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    },
  });

  return message;
};

const messageAdded = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(MESSAGE_ADDED),
    ({ messageAdded: { channel } }, { input: { channelId } }) =>
      channel === channelId
  ),
};

export const resolvers = {
  Query: {
    messages: (_, { input: { channelId } }, { Message }) =>
      Message.findAll({ where: { channelId } }),
  },
  Mutation: {
    createMessage,
  },
  Subscription: {
    messageAdded,
  },
  Message: {
    author: (message) => message.getAuthor(),
    channel: (message) => message.getChannel(),
  },
};
