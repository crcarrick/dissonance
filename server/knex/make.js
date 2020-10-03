import knex from 'knex';
import knexfile from '../knexfile';

knex(knexfile[process.env.NODE_ENV]).migrate.make(process.argv.slice(2)[0]);
