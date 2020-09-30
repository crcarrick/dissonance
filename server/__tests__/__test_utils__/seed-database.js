import { TABLE_NAMES } from '@dissonance/constants';
import { generateData } from '@dissonance/test-utils';

export const seedDatabase = async (dbClient) => {
  const seedData = generateData();

  await dbClient(TABLE_NAMES.USERS_SERVERS).del();
  await dbClient(TABLE_NAMES.MESSAGES).del();
  await dbClient(TABLE_NAMES.CHANNELS).del();
  await dbClient(TABLE_NAMES.SERVERS).del();
  await dbClient(TABLE_NAMES.USERS).del();

  await dbClient(TABLE_NAMES.USERS).insert(seedData.users);
  await dbClient(TABLE_NAMES.SERVERS).insert(seedData.servers);
  await dbClient(TABLE_NAMES.CHANNELS).insert(seedData.channels);
  await dbClient(TABLE_NAMES.MESSAGES).insert(seedData.messages);
  await dbClient(TABLE_NAMES.USERS_SERVERS).insert(seedData.usersServers);
};
