export const serverResolvers = {
  Query: {
    server: (_, { id }, { serverService }) => serverService.findById(id),
    servers: (_, __, { serverService }) => serverService.findAll(),
  },
  Mutation: {
    createServer: (_, { name }, { serverService }) =>
      serverService.create({ name }),
  },
  Server: {
    id: (server) => server._id,
    channels: (server, __, { channelService }) =>
      channelService.findByServer(server._id),
  },
};
