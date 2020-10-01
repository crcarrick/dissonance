import { merge } from 'lodash';

import knexfile from '../knexfile';

export const createDbClient = (knex, database) =>
  database
    ? knex(merge(knexfile[process.env.NODE_ENV], { connection: { database } }))
    : knex(knexfile[process.env.NODE_ENV]);
