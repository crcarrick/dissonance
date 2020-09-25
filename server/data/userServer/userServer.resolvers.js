export const resolvers = {
  Mutation: {
    joinServer: (
      _,
      { input: { serverId } },
      { dataSources: { usersServers } }
    ) => usersServers.joinServer(serverId),
  },
};
