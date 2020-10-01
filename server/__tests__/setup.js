import knex from 'knex';

import { createDbClient } from '@dissonance/database';

export default async () => {
  if (!process.argv.includes('integration')) {
    return;
  }

  const connection = createDbClient(knex);

  const databaseName = 'dissonance_test_template';
  const workers = parseInt(process.env.JEST_WORKERS || '1');

  await connection.raw(`DROP DATABASE IF EXISTS ${databaseName}`);
  await connection.raw(`CREATE DATABASE ${databaseName}`);

  const templateConnection = createDbClient(knex, databaseName);

  await templateConnection.migrate.latest();
  await templateConnection.destroy();

  for (let i = 1; i <= workers; i++) {
    const workerDatabaseName = `dissonance_test_${i}`;

    await connection.raw(`DROP DATABASE IF EXISTS ${workerDatabaseName}`);
    await connection.raw(
      `CREATE DATABASE ${workerDatabaseName} TEMPLATE ${databaseName}`
    );
  }

  await connection.destroy();
};
