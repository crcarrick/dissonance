import { idResolver } from './../util';

const createServer = async (
  _,
  { input: { name } },
  { user, Channel, Server, User }
) => {
  const server = await Server.create({ name, owner: user.id });
  const channel = await Channel.create({ name: 'general', server: server.id });

  await User.findByIdAndUpdate(user.id, { $push: { servers: server.id } });

  server.channels = [channel];

  return server.save();
};

const deleteServer = async (
  _,
  { input: { id } },
  { user, Channel, Message, Server, User }
) => {
  const server = await Server.findById(id);

  if (server.owner.equals(user.id)) {
    await Promise.all([
      server.delete(),
      Channel.deleteMany({ server: server.id }),
      Message.deleteMany({ channel: { $in: server.channels } }),
      User.findByIdAndUpdate(user.id, { $pull: { servers: server.id } }),
    ]);

    return server;
  }
};

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
    ...idResolver,

    channels: (server, _, { Channel }) => Channel.find({ server: server.id }),
  },
};
