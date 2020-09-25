export const resolvers = {
  Query: {
    server: (_, { input: { id } }, { dataSources: { servers } }) =>
      servers.getById(id),
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
    updateServer: (
      _,
      { input: { id, fields } },
      { dataSources: { servers } }
    ) => servers.update({ id, fields }),
  },
  Server: {
    channels: (server, _, { dataSources: { channels } }) =>
      channels.getByServer(server.id),
    owner: (server, _, { dataSources: { users } }) =>
      users.getById(server.ownerId),
    users: (server, _, { dataSources: { users } }) =>
      users.getByServer(server.id),
  },
};
