import { gql } from 'apollo-server';

import { createDbClient } from '@dissonance/database';

import {
  createTestClient,
  generateMockData,
  seedDatabase,
} from '@dissonance/test-utils';

const knex = jest.requireActual('knex');

describe('User Integration', () => {
  const { users, servers } = generateMockData();

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
      },
      dbClient,
    });
  });

  test('joins a server', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation JoinServer($input: JoinServerInput!) {
          joinServer(input: $input) {
            serverId
            userId
          }
        }
      `,
      variables: {
        input: {
          serverId: servers[0].id,
        },
      },
    });

    expect(response.data.joinServer).toMatchSnapshot();
  });
});
