import 'dotenv/config';

import faker from 'faker';

import { connectDatabase } from './data/database';

import { Channel } from './data/channel';
import { Message } from './data/message';
import { Server } from './data/server';
import { User } from './data/user';

const NUM_SERVERS = 5;
const NUM_USERS = 3;

connectDatabase().then(async ({ connection }) => {
  const collections = await connection.db.listCollections().toArray();

  for (let collection of collections) {
    await connection.db.dropCollection(collection.name);
  }

  // Create the users
  const [owner, ...users] = await User.create([
    {
      email: 'testowner@test.com',
      username: 'testowner',
      password: 'testowner',
    },
    ...new Array(NUM_USERS - 1).fill(null).map((_, i) => ({
      email: `testuser${i}@test.com`,
      username: `testuser${i}`,
      password: `testuser${i}`,
    })),
  ]);

  // // Create the servers
  // const servers = await Server.create(
  //   new Array(NUM_SERVERS).fill(null).map((_, i) => ({
  //     owner,
  //     name: `Test Server ${i}`,
  //   }))
  // );

  // // Add the servers to the users
  // for (let user of users) {
  //   user.servers = servers;

  //   await user.save();
  // }

  // const messages = await Message.create(
  //   new Array(50).fill(null).map(() => {
  //     const userIdx = faker.random.number({ min: 0, max: NUM_USERS - 1 });
  //     const serverIdx = faker.random.number({ min: 0, max: NUM_SERVERS - 1 });

  //     return {
  //       author: users[userIdx],
  //       server: servers[serverIdx],
  //       text: faker.random.words(faker.random.number({ min: 1, max: 15 })),
  //     };
  //   })
  // );

  process.exit(0);
});
