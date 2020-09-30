import knexMigrate from 'knex-migrate';

export const rollback = () => knexMigrate('down', { to: 0 });
