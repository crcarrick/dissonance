import 'dotenv/config';

import { ApolloServer } from 'apollo-server';

import { connectDatabase, gqlConfig } from './data';

connectDatabase().then(() => {
  const server = new ApolloServer(gqlConfig);

  server.listen(process.env.PORT).then(({ subscriptionsUrl, url }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });
});
