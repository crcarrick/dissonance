import { gql, PubSub } from 'apollo-server';

import { createDbClient } from '@dissonance/database';

import {
  createTestClient,
  generateMockData,
  seedDatabase,
} from '@dissonance/test-utils';

const knex = jest.requireActual('knex');

describe('Message Integration', () => {
  const { users, channels } = generateMockData();

  let dbClient;
  beforeAll(() => {
    dbClient = createDbClient(
      knex,
      `dissonance_test_${process.env.JEST_WORKER_ID}`
    );
  });

  afterAll(async () => {
    await dbClient.destroy();
  });

  let gqlClient;
  beforeEach(async () => {
    await seedDatabase(dbClient);

    gqlClient = createTestClient({
      context: {
        user: users[0],
        pubsub: new PubSub(),
      },
      dbClient,
    });
  });

  test('creates a message', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation CreateMessage($input: CreateMessageInput!) {
          createMessage(input: $input) {
            id
            text
          }
        }
      `,
      variables: {
        input: {
          channelId: channels[0].id,
          text: 'Testing 123',
        },
      },
    });

    expect(response.data.createMessage).toMatchSnapshot({
      id: expect.any(String),
    });
  });
});
