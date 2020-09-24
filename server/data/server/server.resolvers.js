export const resolvers = {
  Query: {
    server: (_, { input: { id } }, { dataSources: { servers } }) =>
      servers.byIdLoader.load(id),
    servers: (_, __, { dataSources: { servers } }) => servers.get(),
  },
  Mutation: {
    createServerAvatarSignedUrl: (
      _,
      { input: { fileName, serverId } },
      { dataSources: { servers } }
    ) =>
      servers.createSignedUrl({
        fileName,
        serverId,
      }),
    createServer: (_, { input: { name } }, { dataSources: { servers } }) =>
      servers.create({ name }),
    deleteServer: (_, { input: { id } }, { dataSources: { servers } }) =>
      servers.delete(id),
  },
  Server: {
    channels: (server, _, { dataSources: { channels } }) =>
      channels.byServerLoader.load(server.id),
    owner: (server, _, { dataSources: { users } }) =>
      users.byIdLoader.load(server.ownerId),
    users: (server, _, { dataSources: { users } }) =>
      users.byServerLoader.load(server.id),
  },
};
