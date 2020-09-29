import camelCaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';

export const createDbClient = (knex) =>
  knex({
    client: 'sqlite3',
    connection: ':memory:',
    postProcessResponse: (result) => camelCaseKeys(result),
    wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),
    useNullAsDefault: false,
  });
