import { ApolloError, withFilter } from 'apollo-server';

const MESSAGE_ADDED = 'MESSAGE_ADDED';

const createMessage = async (
  _,
  { input: { text, channelId } },
  { pubsub, user, messageService, userService }
) => {
  const authorized = await userService.isMemberOfChannel({
    channelId,
    userId: user.id,
  });

  if (!authorized) {
    throw new ApolloError('Not authorized to send message to this channel');
  }

  const message = await messageService.create({
    text,
    authorId: user.id,
    channelId,
  });

  pubsub.publish(MESSAGE_ADDED, {
    messageAdded: {
      id: message.id,
      text,
      author: user,
      channel: message.channel,
      created_at: message.created_at,
      updated_at: message.updated_at,
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
  Mutation: {
    createMessage,
  },
  Subscription: {
    messageAdded,
  },
  Message: {
    author: (message, _, { messageService }) =>
      messageService.getAuthor(message.author_id),
    channel: (message, _, { ChannelService }) =>
      ChannelService.getChannel(message.channel_id),
  },
};
