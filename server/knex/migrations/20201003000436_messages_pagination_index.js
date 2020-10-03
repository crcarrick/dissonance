exports.up = (knex) =>
  knex.schema.table('messages', (messages) =>
    messages.index(['created_at', 'id'], 'idx_messages_pagination')
  );

exports.down = (knex) =>
  knex.schema.table('messages', (messages) =>
    messages.dropIndex('idx_messages_pagination')
  );
