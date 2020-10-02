import knex from 'knex';

import { createDbClient } from '@dissonance/database';

export default async () => {
  if (!process.argv.includes('integration')) {
    return;
  }

  const connection = createDbClient(knex);

  const workers = parseInt(process.env.JEST_WORKERS || '1');

  for (let i = 1; i <= workers; i++) {
    const workerDatabaseName = `dissonance_test_${i}`;

    await connection.raw(`DROP DATABASE IF EXISTS ${workerDatabaseName}`);
  }

  await connection.destroy();
};
