import knex from 'knex';

import camelCaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';

import { AuthDataSource } from './auth';
import { ChannelDataSource } from './channel';
import { MessageDataSource } from './message';
import { ServerDataSource } from './server';
import { UserDataSource } from './user';
import { UserServerDataSource } from './userServer';

import { TABLE_NAMES } from './constants';

export const connectDatabase = () => {
  const dbClient = knex({
    client: 'postgres',
    connection: {
      host: 'localhost',
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    postProcessResponse: (result) => camelCaseKeys(result),
    wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),
  });

  return {
    dbClient,
    dataSources: () => ({
      auth: new AuthDataSource(dbClient, TABLE_NAMES.USERS),
      channels: new ChannelDataSource(dbClient, TABLE_NAMES.CHANNELS),
      messages: new MessageDataSource(dbClient, TABLE_NAMES.MESSAGES),
      servers: new ServerDataSource(dbClient, TABLE_NAMES.SERVERS),
      users: new UserDataSource(dbClient, TABLE_NAMES.USERS),
      usersServers: new UserServerDataSource(
        dbClient,
        TABLE_NAMES.USERS_SERVERS
      ),
    }),
  };
};
