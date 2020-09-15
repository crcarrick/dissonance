import { AuthenticationError } from 'apollo-server';
import { idResolver } from './../util';

const loginUser = async (_, { input: { email, password } }, { User }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError('Bad email or password');
  }

  const match = user.validatePassword(password);

  if (!match) {
    throw new AuthenticationError('Bad email or password');
  }

  return { token: user.generateJWT(), user };
};

const signupUser = async (
  _,
  { input: { email, password, username } },
  { User }
) => {
  const user = await User.create({ email, password, username });

  return { token: user.generateJWT(), user };
};

export const resolvers = {
  Query: {
    me: (_, __, { user }) => user,
  },
  Mutation: {
    loginUser,
    signupUser,
    joinServer: (_, { input: { serverId } }, { user, User }) =>
      User.findByIdAndUpdate(user.id, { $push: { servers: serverId } }),
  },
  User: {
    ...idResolver,

    servers: (user, _, { Server }) => {
      return Server.find({ id: { $in: user.servers } });
    },
  },
};
