import { AuthenticationError, gql, PubSub } from 'apollo-server';
import {
  typeDefs as graphqlScalarTypeDefs,
  resolvers as graphqlScalarResolvers,
} from 'graphql-scalars';

import * as auth from '@dissonance/domains/auth';
import * as channel from '@dissonance/domains/channel';
import * as message from '@dissonance/domains/message';
import * as server from '@dissonance/domains/server';
import * as user from '@dissonance/domains/user';
import * as userServer from '@dissonance/domains/userServer';

import { TABLE_NAMES } from '@dissonance/constants';
import {
  AuthenticationDirective,
  schemaDirectives,
} from '@dissonance/directives';
import { findAuthUser } from '@dissonance/utils';

const pubsub = new PubSub();

const baseTypeDefs = gql`
  ${schemaDirectives}

  type Query
  type Mutation
  type Subscription

  type SignedUrlPayload {
    signedUrl: URL!
    url: URL!
  }
`;

export const createGQLConfig = ({ dbClient }) => ({
  typeDefs: [
    ...graphqlScalarTypeDefs,

    baseTypeDefs,

    auth.typeDefs,
    channel.typeDefs,
    message.typeDefs,
    server.typeDefs,
    user.typeDefs,
    userServer.typeDefs,
  ],
  resolvers: [
    graphqlScalarResolvers,

    auth.resolvers,
    channel.resolvers,
    message.resolvers,
    server.resolvers,
    user.resolvers,
    userServer.resolvers,
  ],
  subscriptions: {
    onConnect: async (connectionParams) => {
      if (connectionParams.Authorization) {
        const authUser = await findAuthUser({
          authorization: connectionParams.Authorization,
          dbClient,
        });

        return { user: authUser };
      }

      throw new AuthenticationError('Not authenticated');
    },
  },
  context: async ({ req, connection }) => {
    let authUser;
    if (connection) {
      authUser = connection.context.user;
    } else {
      authUser = await findAuthUser({
        authorization: req.headers.authorization,
        dbClient,
      });
    }

    return {
      pubsub,
      user: authUser,
    };
  },
  dataSources: () => ({
    auth: new auth.AuthDataSource(dbClient, TABLE_NAMES.USERS),
    channels: new channel.ChannelDataSource(dbClient, TABLE_NAMES.CHANNELS),
    messages: new message.MessageDataSource(dbClient, TABLE_NAMES.MESSAGES),
    servers: new server.ServerDataSource(dbClient, TABLE_NAMES.SERVERS),
    users: new user.UserDataSource(dbClient, TABLE_NAMES.USERS),
    usersServers: new userServer.UserServerDataSource(
      dbClient,
      TABLE_NAMES.USERS_SERVERS
    ),
  }),
  schemaDirectives: {
    authenticated: AuthenticationDirective,
  },
});
