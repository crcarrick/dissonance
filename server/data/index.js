import { AuthenticationError, gql, PubSub } from 'apollo-server';
import {
  typeDefs as graphqlScalarTypeDefs,
  resolvers as graphqlScalarResolvers,
} from 'graphql-scalars';

import * as channel from './channel';
import * as message from './message';
import * as server from './server';
import * as user from './user';

import { AuthenticationDirective, schemaDirectives } from './directives';

import { createConfig, findAuthUser } from './util';

const pubsub = new PubSub();

const baseTypeDefs = gql`
  ${schemaDirectives}

  type Query
  type Mutation
  type Subscription
`;

export const createGQLConfig = ({ connection: databaseConnection, services }) =>
  createConfig({
    typeDefs: [
      ...graphqlScalarTypeDefs,

      baseTypeDefs,

      channel.typeDefs,
      message.typeDefs,
      server.typeDefs,
      user.typeDefs,
    ],
    resolvers: [
      graphqlScalarResolvers,

      channel.resolvers,
      message.resolvers,
      server.resolvers,
      user.resolvers,
    ],
    subscriptions: {
      onConnect: async (connectionParams) => {
        const { user: userLoader } = user.createUserLoaders(databaseConnection);

        if (connectionParams.Authorization) {
          const authUser = await findAuthUser({
            authorization: connectionParams.Authorization,
            userLoader,
          });

          return { user: authUser };
        }

        throw new AuthenticationError('Not authenticated');
      },
    },
    context: async ({ req, connection }) => {
      const loaders = {
        ...channel.createChannelLoaders(databaseConnection),
        ...message.createMessageLoaders(databaseConnection),
        ...server.createServerLoaders(databaseConnection),
        ...user.createUserLoaders(databaseConnection),
      };

      let authUser;
      if (connection) {
        authUser = connection.context.user;
      } else {
        authUser = await findAuthUser({
          authorization: req.headers.authorization,
          userLoader: loaders.user,
        });
      }

      return {
        pubsub,
        loaders,
        user: authUser,
        ...services,
      };
    },
    schemaDirectives: {
      authenticated: AuthenticationDirective,
    },
  });
