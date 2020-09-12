export const messageResolvers = {
  Query: {
    message: (_, { id }, { messageService }) => messageService.findById(id),
  },
  Mutation: {
    createMessage: (_, { channelId, text, userId }, { messageService }) =>
      messageService.create({ channelId, text, userId }),
  },
  Message: {
    id: (message) => message._id,
  },
};
