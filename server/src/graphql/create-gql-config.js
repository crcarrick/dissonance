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

const createDataSources = (dbClient) => ({
  auth: new auth.AuthDataSource(dbClient, TABLE_NAMES.USERS),
  channels: new channel.ChannelDataSource(dbClient, TABLE_NAMES.CHANNELS),
  messages: new message.MessageDataSource(dbClient, TABLE_NAMES.MESSAGES),
  servers: new server.ServerDataSource(dbClient, TABLE_NAMES.SERVERS),
  users: new user.UserDataSource(dbClient, TABLE_NAMES.USERS),
  usersServers: new userServer.UserServerDataSource(
    dbClient,
    TABLE_NAMES.USERS_SERVERS
  ),
});

export const createGQLConfig = ({ context, dbClient }) => ({
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
      if (connectionParams.authorization) {
        const authUser = await findAuthUser({
          authorization: connectionParams.authorization,
          dbClient,
        });

        return { authUser, dataSources: createDataSources(dbClient), pubsub };
      }

      throw new AuthenticationError('Not authenticated');
    },
  },
  context: context
    ? context
    : async ({ req, connection }) => {
        if (connection) {
          const subscriptionContext = connection.context;
          const { dataSources } = subscriptionContext;

          for (const instance in dataSources) {
            dataSources[instance].initialize({
              context: connection.context,
              cache: null,
            });
          }

          return {
            ...subscriptionContext,
          };
        }

        const authUser = await findAuthUser({
          authorization: req.headers.authorization,
          dbClient,
        });

        return {
          pubsub,
          user: authUser,
        };
      },
  dataSources: () => createDataSources(dbClient),
  schemaDirectives: {
    authenticated: AuthenticationDirective,
  },
});
