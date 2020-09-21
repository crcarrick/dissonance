const createServer = async (_, { input: { name } }, { user, Server }) =>
  Server.create({ name, owner: user.id });

const deleteServer = async (_, { input: { id } }, { user, Server }) =>
  Server.findOneAndDelete({ _id: id, owner: user.id });

export const resolvers = {
  Query: {
    server: (_, { input: { id } }, { Server }) => Server.findById(id),
    servers: (_, __, { Server }) => Server.find({}),
  },
  Mutation: {
    createServer,
    deleteServer,
  },
  Server: {
    channels: (server, _, { Channel }) => Channel.find({ server: server.id }),
  },
};
