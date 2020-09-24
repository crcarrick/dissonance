import { ApolloError, AuthenticationError } from 'apollo-server';

const loginUser = async (
  _,
  { input: { email, password } },
  { loaders, userService }
) => {
  const user = await loaders.userByEmail.load(email);

  if (!user) {
    throw new AuthenticationError('Email does not exist');
  }

  const match = userService.validatePassword({
    candidate: password,
    password: user.password,
  });

  if (!match) {
    throw new AuthenticationError('Password does not match');
  }

  return { token: userService.generateJWT(user), user };
};

const signupUser = async (
  _,
  { input: { email, password, username } },
  { userService }
) => {
  try {
    const user = await userService.signup({ email, password, username });

    return { token: userService.generateJWT(user), user };
  } catch (error) {
    if (error.constraint === 'users_email_unique') {
      throw new ApolloError('Email is already in use', 'SIGNUP_EMAIL_IN_USE');
    } else if (error.constraint === 'users_username_unique') {
      throw new ApolloError(
        'Username is already in use',
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
    createUserAvatarSignedUrl: (
      _,
      { input: { fileName } },
      { user, userService }
    ) => userService.createAvatarSignedUrl({ fileName, userId: user.id }),
    joinServer: (_, { input: { serverId } }, { user, userService }) =>
      userService.joinServer({ userId: user.id, serverId }),
    loginUser,
    signupUser,
  },
  AuthUser: {
    servers: async (user, __, { loaders }) =>
      loaders.serversByUser.load(user.id),
  },
};
