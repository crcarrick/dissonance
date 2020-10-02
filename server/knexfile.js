const camelCaseKeys = require('camelcase-keys');
const { snakeCase } = require('snake-case');

const processors = {
  postProcessResponse: (result) => camelCaseKeys(result),
  wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),
};

export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'knex/migrations',
    },
    seeds: {
      directory: 'knex/seeds',
    },
    ...processors,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'knex/migrations',
    },
    ...processors,
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'knex/migrations',
    },
    seeds: {
      directory: 'knex/seeds',
    },
    ...processors,
  },
};
