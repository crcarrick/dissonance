import 'dotenv/config';

import { ApolloServer } from 'apollo-server';

import { createGQLConfig } from './data';
import { connectDatabase } from './data/database';

const { services } = connectDatabase();

const server = new ApolloServer(createGQLConfig({ services }));

server.listen(process.env.PORT).then(({ subscriptionsUrl, url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
