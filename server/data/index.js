import { gql, PubSub } from 'apollo-server';
import {
  typeDefs as graphqlScalarTypeDefs,
  resolvers as graphqlScalarResolvers,
} from 'graphql-scalars';

import * as channel from './channel';
import * as message from './message';
import * as server from './server';
import * as user from './user';

import { AuthenticationDirective } from './directives';

import { createConfig, decodeToken } from './util';

const baseTypeDefs = gql`
  directive @authenticated on FIELD_DEFINITION

  type Query
  type Mutation
`;

export * from './database';

export const gqlConfig = createConfig({
  typeDefs: [
    ...graphqlScalarTypeDefs,

    baseTypeDefs,

    channel.typeDefs,
    message.typeDefs,
    server.typeDefs,
    user.typeDefs,
  ],
  resolvers: [
    { ...graphqlScalarResolvers },

    channel.resolvers,
    message.resolvers,
    server.resolvers,
    user.resolvers,
  ],
  context: async (request) => {
    const pubsub = new PubSub();

    const channelService = new channel.ChannelService(channel.Channel);
    const messageService = new message.MessageService(message.Message);
    const serverService = new server.ServerService(server.Server);
    const userService = new user.UserService(user.User);

    const decodedToken = decodeToken(request.req.headers.authorization);

    const authUser = decodedToken?.id
      ? await userService.findById(decodedToken.id)
      : null;

    return {
      pubsub,

      user: authUser,

      channelService,
      messageService,
      serverService,
      userService,
    };
  },
  schemaDirectives: {
    authenticated: AuthenticationDirective,
  },
});
