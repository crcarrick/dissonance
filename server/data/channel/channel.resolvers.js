export const resolvers = {
  Query: {
    channel: (_, { input: { id } }, { loaders }) => loaders.channel.load(id),
    channels: (_, __, { channelService }) => channelService.findAll(),
  },
  Mutation: {
    createChannel: (_, { input: { name, serverId } }, { channelService }) =>
      channelService.create({ name, serverId }),
  },
  Channel: {
    messages: (channel, _, { loaders }) =>
      loaders.messagesByChannel.load(channel.id),
  },
};
