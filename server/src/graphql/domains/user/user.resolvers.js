export const resolvers = {
  Mutation: {
    createUserAvatarSignedUrl: (
      _,
      { input: { fileName } },
      { dataSources: { users } }
    ) => users.createSignedUrl(fileName),
  },
};
