export const channelResolvers = {
  Query: {
    channel: (_, { id }, { channelService }) => channelService.findById(id),
    channels: (_, __, { channelService }) => channelService.findAll(),
  },
  Mutation: {
    createChannel: (_, { name, serverId }, { channelService }) =>
      channelService.create({ name, serverId }),
  },
  Channel: {
    id: (channel) => channel._id,
    messages: (channel, __, { messageService }) =>
      messageService.findByChannel(channel._id),
  },
};
