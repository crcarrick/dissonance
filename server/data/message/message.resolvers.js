import { idResolver } from './../util';

export const resolvers = {
  Query: {
    messages: (_, { channelId }, { messageService }) =>
      messageService.findByChannel(channelId),
  },
  Mutation: {
    createMessage: (
      _,
      { input: { channelId, text } },
      { messageService, user }
    ) => messageService.create({ channelId, text, userId: user.id }),
  },
  Message: {
    ...idResolver,
    author: (message, _, { userService }) =>
      userService.findById(message.author),
    channel: (message, _, { channelService }) =>
      channelService.findById(message.channel),
  },
};
