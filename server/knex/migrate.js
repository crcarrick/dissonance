import knex from 'knex';
import knexfile from '../knexfile';

knex(knexfile[process.env.NODE_ENV])
  .migrate.latest()
  .then(() => {
    process.exit(0);
  });
