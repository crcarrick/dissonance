import knex from 'knex';

import camelCaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';

export const connectDatabase = () => {
  return knex({
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
};
