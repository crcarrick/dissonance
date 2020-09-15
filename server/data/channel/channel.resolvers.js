import { idResolver } from './../util';

export const resolvers = {
  Query: {
    channel: (_, { input: { id } }, { Channel }) => Channel.findById(id),
    channels: (_, __, { Channel }) => Channel.find({}),
  },
  Mutation: {
    createChannel: (_, { input: { name, serverId } }, { Channel }) =>
      Channel.create({ name, server: serverId }),
  },
  Channel: {
    ...idResolver,
    messages: (channel, _, { Message }) =>
      Message.find({ channel: channel.id }),
  },
};
