export const resolvers = {
  Mutation: {
    joinServer: (
      _,
      { input: { serverId } },
      { dataSources: { userServers } }
    ) => userServers.joinServer(serverId),
  },
};
