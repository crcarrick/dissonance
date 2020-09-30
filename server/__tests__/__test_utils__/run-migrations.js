import knexMigrate from 'knex-migrate';

export const migrate = () => knexMigrate('up');
