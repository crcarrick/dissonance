import { ApolloServer } from 'apollo-server';
import { createTestClient as createApolloTestClient } from 'apollo-server-testing';

import { createGQLConfig } from '@dissonance/graphql/create-gql-config';

export const createTestClient = ({ context, dbClient }) =>
  createApolloTestClient(
    new ApolloServer(createGQLConfig({ context, dbClient }))
  );
