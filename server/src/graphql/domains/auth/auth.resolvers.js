export const resolvers = {
  Query: {
    me: (_, __, { user }) => user,
  },
  Mutation: {
    login: (_, { input: { email, password } }, { dataSources: { auth } }) =>
      auth.login({ email, password }),
    signup: (
      _,
      { input: { email, password, username } },
      { dataSources: { auth } }
    ) => auth.signup({ email, password, username }),
  },
  AuthUser: {
    servers: async (user, _, { dataSources: { servers } }) =>
      servers.getByUser(user.id),
  },
};
