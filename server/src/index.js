import { ApolloServer } from 'apollo-server';
import knex from 'knex';

import { createGQLConfig } from '@dissonance/graphql/create-gql-config';
import { createDbClient } from '@dissonance/database';

const server = new ApolloServer(
  createGQLConfig({ dbClient: createDbClient(knex) })
);

server.listen(process.env.PORT || 4000).then(({ subscriptionsUrl, url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
