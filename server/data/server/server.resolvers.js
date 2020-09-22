const createServer = async (
  _,
  { input: { name } },
  { user, Channel, Server, UserServer }
) => {
  const server = await Server.create(
    {
      name,
      OwnerId: user.id,
      Channels: [{ name: 'welcome' }, { name: 'general' }],
    },
    { include: { model: Channel } }
  );

  UserServer.create({ UserId: user.id, ServerId: server.id });

  return server;
};

const deleteServer = async (_, { input: { id } }, { user, Server }) => {
  await Server.destroy({ where: { id, OwnerId: user.id } });

  return { id };
};

export const resolvers = {
  Query: {
    server: (_, { input: { id } }, { Server }) => Server.findByPk(id),
    servers: (_, __, { Server }) => Server.findAll(),
  },
  Mutation: {
    createServer,
    deleteServer,
  },
  Server: {
    channels: (server) => server.getChannels(),
    owner: (server) => server.getOwner(),
    users: (server) => server.getUsers(),
  },
};
