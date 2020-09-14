import { idResolver } from './../util';

export const resolvers = {
  Query: {
    server: (_, { id }, { serverService }) => serverService.findById(id),
    servers: (_, __, { serverService }) => serverService.findAll(),
  },
  Mutation: {
    createServer: (_, { input: { name } }, { serverService }) =>
      serverService.create({ name }),
  },
  Server: {
    ...idResolver,
    channels: (server, _, { channelService }) =>
      channelService.findByServer(server._id),
  },
};
