export const resolvers = {
  Query: {
    channel: (_, { input: { id } }, { dataSources: { channels } }) =>
      channels.byIdLoader.load(id),
    channels: (_, __, { dataSources: { channels } }) => channels.get(),
  },
  Mutation: {
    createChannel: (
      _,
      { input: { name, serverId } },
      { dataSources: { channels } }
    ) => channels.create({ name, serverId }),
  },
  Channel: {
    messages: (channel, _, { dataSources: { messages } }) =>
      messages.byChannelLoader.load(channel.id),
  },
};
