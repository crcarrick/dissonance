import { TABLE_NAMES } from '@dissonance/constants';

export const createDb = (knex) =>
  knex.schema
    .createTable(TABLE_NAMES.USERS, (t) => {
      t.string('id').primary();
      t.string('email').unique();
      t.string('password');
      t.string('username').unique();
      t.string('avatar_url');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.SERVERS, (t) => {
      t.string('id').primary();
      t.string('name');
      t.string('avatar_url');
      t.string('owner_id');
      t.foreign('owner_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.CHANNELS, (t) => {
      t.string('id').primary();
      t.string('name');
      t.uuid('server_id');
      t.foreign('server_id')
        .references('id')
        .inTable('servers')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.MESSAGES, (t) => {
      t.string('id').primary();
      t.string('text');
      t.string('author_id');
      t.foreign('author_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      t.string('channel_id');
      t.foreign('channel_id')
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    })
    .createTable(TABLE_NAMES.USERS_SERVERS, (t) => {
      t.string('user_id');
      t.foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      t.string('server_id');
      t.foreign('server_id')
        .references('id')
        .inTable('servers')
        .onDelete('CASCADE');
      t.timestamps(false, true);
    });
