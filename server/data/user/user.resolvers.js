import { AuthenticationError } from 'apollo-server';
import { idResolver } from './../util';

export const resolvers = {
  Query: {
    me: (_, __, { user }) => user,
  },
  Mutation: {
    loginUser: async (_, { input: { email, password } }, { userService }) => {
      const user = await userService.findByEmail(email);

      if (!user) {
        throw new AuthenticationError('Bad email or password');
      }

      const match = user.validatePassword(password);

      if (!match) {
        throw new AuthenticationError('Bad email or password');
      }

      return { token: user.generateJWT(), user };
    },
    signupUser: async (
      _,
      { input: { email, password, username } },
      { userService }
    ) => {
      const user = await userService.create({ email, password, username });

      return { token: user.generateJWT(), user };
    },
  },
  User: {
    ...idResolver,
  },
};
