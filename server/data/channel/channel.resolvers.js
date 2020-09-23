export const resolvers = {
  Query: {
    channel: (_, { input: { id } }, { channelService }) =>
      channelService.findById(id),
    channels: (_, __, { channelService }) => channelService.findAll(),
  },
  Mutation: {
    createChannel: (_, { input: { name, serverId } }, { channelService }) =>
      channelService.create({ name, serverId }),
  },
  Channel: {
    messages: (channel, _, { channelService }) =>
      channelService.getMessages(channel.id),
  },
};
