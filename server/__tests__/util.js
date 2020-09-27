import { ApolloServer, gql } from 'apollo-server';
import camelCaseKeys from 'camelcase-keys';
import {
  typeDefs as graphqlScalarTypeDefs,
  resolvers as graphqlScalarResolvers,
} from 'graphql-scalars';
import { snakeCase } from 'snake-case';

import * as auth from '@dissonance/domains/auth';
import * as channel from '@dissonance/domains/channel';
import * as message from '@dissonance/domains/message';
import * as server from '@dissonance/domains/server';
import * as user from '@dissonance/domains/user';
import * as userServer from '@dissonance/domains/userServer';

import { TABLE_NAMES } from '@dissonance/constants';
import {
  AuthenticationDirective,
  schemaDirectives,
} from '@dissonance/directives';

export const createDbClient = (knex) =>
  knex({
    client: 'sqlite3',
    connection: ':memory:',
    postProcessResponse: (result) => camelCaseKeys(result),
    wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),
    useNullAsDefault: false,
  });

export const createDatabase = (knex) =>
  knex.schema
    .createTable(TABLE_NAMES.USERS, (t) => {
      t.string('id').primary();
      t.string('email').unique();
      t.string('password');
      t.string('username').unique();
      t.string('avatar_url');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.SERVERS, (t) => {
      t.string('id').primary();
      t.string('name');
      t.string('avatar_url');
      t.string('owner_id');
      t.foreign('owner_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.CHANNELS, (t) => {
      t.string('id').primary();
      t.string('name');
      t.uuid('server_id');
      t.foreign('server_id')
        .references('id')
        .inTable('servers')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.MESSAGES, (t) => {
      t.string('id').primary();
      t.string('text');
      t.string('author_id');
      t.foreign('author_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      t.string('channel_id');
      t.foreign('channel_id')
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.USERS_SERVERS, (t) => {
      t.string('user_id');
      t.foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      t.string('server_id');
      t.foreign('server_id')
        .references('id')
        .inTable('servers')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    });

export const destroyDatabase = (knex) =>
  knex.schema
    .dropTable('users')
    .dropTable('servers')
    .dropTable('channels')
    .dropTable('messages')
    .dropTable('users_servers');

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
