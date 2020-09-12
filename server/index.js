import 'dotenv/config';

import { GraphQLServer, PubSub } from 'graphql-yoga';
import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';
import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

import {
  channelResolvers,
  ChannelService,
  channelTypeDefs,
  messageResolvers,
  MessageService,
  messageTypeDefs,
  serverResolvers,
  ServerService,
  serverTypeDefs,
  userResolvers,
  UserService,
  userTypeDefs,
} from './data';

const baseResolvers = {};
const baseTypeDefs = gql`
  type Query
  type Mutation
  type Subscription
`;

const schema = makeExecutableSchema({
  resolvers: [
    baseResolvers,
    channelResolvers,
    messageResolvers,
    serverResolvers,
    userResolvers,
  ],
  typeDefs: [
    baseTypeDefs,
    channelTypeDefs,
    messageTypeDefs,
    serverTypeDefs,
    userTypeDefs,
  ],
});

const pubsub = new PubSub();
const server = new GraphQLServer({
  schema,
  context: {
    pubsub,

    channelService: new ChannelService(),
    messageService: new MessageService(),
    serverService: new ServerService(),
    userService: new UserService(),
  },
});

server.start(
  {
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
    port: process.env.PORT,
  },
  () => console.log(`Listening at port ${process.env.PORT}`)
);
