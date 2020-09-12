export const userResolvers = {
  Query: {
    user: (_, { id }, { userService }) => userService.findById(id),
    users: (_, __, { userService }) => userService.findAll(),
  },
  Mutation: {
    createUser: (_, { username }, { userService }) =>
      userService.create({ username }),
  },
  User: {
    id: (user) => user._id,
  },
};
