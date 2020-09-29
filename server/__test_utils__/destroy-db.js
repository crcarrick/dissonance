export const destroyDb = (knex) =>
  knex.schema
    .dropTable('users')
    .dropTable('servers')
    .dropTable('channels')
    .dropTable('messages')
    .dropTable('users_servers');
