import { ApolloServer, gql } from 'apollo-server';
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

import {
  AuthenticationDirective,
  schemaDirectives,
} from '@dissonance/directives';

export const createServer = ({ context, dataSources }) => {
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

  const serv = new ApolloServer({
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
    context,
    dataSources,
    schemaDirectives: {
      authenticated: AuthenticationDirective,
    },
  });

  return serv;
};
