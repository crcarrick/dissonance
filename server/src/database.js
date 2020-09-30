export const createDbClient = (knex) =>
  knex(require('./../knexfile')[process.env.NODE_ENV]);
