import knex from 'knex';
import knexfile from '../knexfile';

knex(knexfile[process.env.NODE_ENV])
  .seed.run()
  .then(() => {
    process.exit(0);
  });
