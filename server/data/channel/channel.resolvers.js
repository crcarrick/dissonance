import { idResolver } from './../util';

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
    ...idResolver,
    messages: (channel, _, { messageService }) =>
      messageService.findByChannel(channel._id),
  },
};
