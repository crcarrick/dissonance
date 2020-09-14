import 'dotenv/config';

import { ApolloServer } from 'apollo-server';

import { connectDatabase, gqlConfig } from './data';

connectDatabase().then(() => {
  const server = new ApolloServer(gqlConfig);

  server
    .listen({
      endpoint: '/graphql',
      subscriptions: '/subscriptions',
      playground: '/playground',
      port: process.env.PORT,
    })
    .then(({ url }) => console.log(`🚀  Server ready at ${url}`));
});
