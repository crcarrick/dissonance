const createServer = async (
  _,
  { input: { name } },
  { user, Channel, Server }
) => {
  const server = await Server.create(
    {
      name,
      ownerId: user.id,
      channels: [{ name: 'welcome' }, { name: 'general' }],
    },
    { include: { model: [Channel] } }
  );

  return server;
};

const deleteServer = async (_, { input: { id } }, { user, Server }) =>
  Server.destroy({ where: { id, ownerId: user.id } });

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
  },
};
