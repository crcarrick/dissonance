import { ApolloServer } from 'apollo-server';

import { createGQLConfig } from '@dissonance/graphql/create-gql-config';
import { connectDatabase } from '@dissonance/database';

const server = new ApolloServer(
  createGQLConfig({ dbClient: connectDatabase() })
);

server.listen(process.env.PORT).then(({ subscriptionsUrl, url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
