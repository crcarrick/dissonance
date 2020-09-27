import { AuthenticationError, gql, PubSub } from 'apollo-server';
import {
  typeDefs as graphqlScalarTypeDefs,
  resolvers as graphqlScalarResolvers,
} from 'graphql-scalars';

import * as auth from './auth';
import * as channel from './channel';
import * as message from './message';
import * as server from './server';
import * as user from './user';
import * as userServer from './userServer';

import { AuthenticationDirective, schemaDirectives } from './directives';

import { createConfig, findAuthUser } from './util';

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

export const createGQLConfig = ({ dbClient, dataSources }) =>
  createConfig({
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
    dataSources,
    schemaDirectives: {
      authenticated: AuthenticationDirective,
    },
  });
