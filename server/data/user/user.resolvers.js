import { ApolloError, AuthenticationError } from 'apollo-server';

const loginUser = async (_, { input: { email, password } }, { User }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError('Email does not exist');
  }

  const match = user.validatePassword(password);

  if (!match) {
    throw new AuthenticationError('Password does not match');
  }

  return { token: user.generateJWT(), user };
};

const signupUser = async (
  _,
  { input: { email, password, username } },
  { User }
) => {
  try {
    const user = await User.create({ email, password, username });

    return { token: user.generateJWT(), user };
  } catch ({ errors: { email, username } }) {
    if (email) {
      throw new ApolloError(`Email is already in use`, 'SIGNUP_EMAIL_IN_USE');
    } else if (username) {
      throw new ApolloError(
        `Username is already in use`,
        'SIGNUP_USERNAME_IN_USE'
      );
    } else {
      throw new ApolloError('Something went wrong', 'INTERNAL_SERVER_ERROR');
    }
  }
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
  AuthUser: {
    servers: (user, _, { Server }) =>
      Server.find({ _id: { $in: user.servers } }),
  },
};
