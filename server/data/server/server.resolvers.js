const createServer = async (_, { input: { name } }, { user, serverService }) =>
  serverService.create({
    name,
    ownerId: user.id,
  });

const deleteServer = async (_, { input: { id } }, { user, serverService }) => {
  await serverService.delete({ id, ownerId: user.id });

  return { id };
};

export const resolvers = {
  Query: {
    server: (_, { input: { id } }, { loaders }) => loaders.server.load(id),
    servers: (_, __, { serverService }) => serverService.findAll(),
  },
  Mutation: {
    createServerAvatarSignedUrl: (
      _,
      { input: { fileName, serverId } },
      { user, serverService }
    ) => serverService.createAvatarSignedUrl({ fileName, serverId, userId }),
    createServer,
    deleteServer,
  },
  Server: {
    channels: (server, _, { loaders }) =>
      loaders.channelsByServer.load(server.id),
    owner: (server, _, { loaders }) => loaders.user.load(server.ownerId),
    users: (server, _, { loaders }) => loaders.usersByServer.load(server.id),
  },
};
