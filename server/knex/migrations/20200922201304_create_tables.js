export const up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');

  const uuidGenerationRaw = 'uuid_generate_v4()';

  await knex.schema
    /**
     * Users Table
     */
    .createTable('users', (users) => {
      users
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw(uuidGenerationRaw));
      users.string('email').unique().notNullable();
      users.string('password').notNullable();
      users.string('username').unique().notNullable();
      users.string('avatar_url');
      users.timestamps(false, true);
    })
    /**
     * Servers Table
     */
    .createTable('servers', (servers) => {
      servers
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw(uuidGenerationRaw));
      servers.string('name').notNullable();
      servers.string('avatar_url');
      servers.uuid('owner_id');
      servers
        .foreign('owner_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      servers.timestamps(false, true);
    })
    /**
     * Channels Table
     */
    .createTable('channels', (channels) => {
      channels
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw(uuidGenerationRaw));
      channels.string('name').notNullable();
      channels.uuid('server_id');
      channels
        .foreign('server_id')
        .references('id')
        .inTable('servers')
        .onDelete('CASCADE');
      channels.timestamps(false, true);
    })
    /**
     * Messages Table
     */
    .createTable('messages', (messages) => {
      messages
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw(uuidGenerationRaw));
      messages.string('text').notNullable();
      messages.uuid('author_id');
      messages
        .foreign('author_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      messages.uuid('channel_id');
      messages
        .foreign('channel_id')
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE');
      messages.timestamps(false, true);
    })
    /**
     * UsersServers Table
     */
    .createTable('users_servers', (users_servers) => {
      users_servers.uuid('user_id');
      users_servers
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      users_servers.uuid('server_id');
      users_servers
        .foreign('server_id')
        .references('id')
        .inTable('servers')
        .onDelete('CASCADE');
      users_servers.timestamps(false, true);
    });

  for (const table of [
    'users',
    'servers',
    'channels',
    'messages',
    'users_servers',
  ]) {
    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE
        ON ${table}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
      `);
  }
};

export const down = (knex) =>
  knex.schema
    .dropTable('users_servers')
    .dropTable('messages')
    .dropTable('channels')
    .dropTable('servers')
    .dropTable('users');
