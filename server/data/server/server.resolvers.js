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
    server: (_, { input: { id } }, { serverService }) =>
      serverService.findById(id),
    servers: (_, __, { serverService }) => serverService.findAll(),
  },
  Mutation: {
    createServer,
    deleteServer,
  },
  Server: {
    channels: (server, _, { serverService }) =>
      serverService.getChannels(server.id),
    owner: (server, _, { serverService }) =>
      serverService.getOwner(server.owner_id),
    users: (server, _, { serverService }) => serverService.getUsers(server.id),
  },
};
