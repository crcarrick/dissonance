export const resolvers = {
  Query: {
    channel: (_, { input: { id } }, { dataSources: { channels } }) =>
      channels.getById(id),
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
      messages.getByChannel(channel.id),
  },
};
