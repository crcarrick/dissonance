import 'dotenv/config';

import { ApolloServer } from 'apollo-server';

import { connectDatabase } from './data/database';
import { gqlConfig } from './data';

const { sequelize, models } = connectDatabase();

sequelize.sync({ force: process.env.NODE_ENV === 'development' }).then(() => {
  const server = new ApolloServer(gqlConfig({ models }));

  server.listen(process.env.PORT).then(({ subscriptionsUrl, url }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });
});
