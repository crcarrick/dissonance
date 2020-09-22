export const resolvers = {
  Query: {
    channel: (_, { input: { id } }, { Channel }) => Channel.findByPk(id),
    channels: (_, __, { Channel }) => Channel.findAll(),
  },
  Mutation: {
    createChannel: (_, { input: { name, serverId } }, { Channel }) =>
      Channel.create({ name, ServerId: serverId }),
  },
  Channel: {
    messages: (channel) => channel.getMessages(),
  },
};
