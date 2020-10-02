import { gql } from 'apollo-server';

import { createDbClient } from '@dissonance/database';

import {
  createTestClient,
  generateMockData,
  seedDatabase,
} from '@dissonance/test-utils';

const knex = jest.requireActual('knex');

describe('Channel Integration', () => {
  const { users, channels, servers } = generateMockData();

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

  test('gets a channel', async () => {
    const response = await gqlClient.query({
      query: gql`
        query GetChannel($input: GetChannelInput!) {
          channel(input: $input) {
            id
            name
            serverId
          }
        }
      `,
      variables: {
        input: { id: channels[0].id },
      },
    });

    expect(response.data.channel).toMatchSnapshot();
  });

  test('gets a channels messages', async () => {
    const response = await gqlClient.query({
      query: gql`
        query GetChannelWithMessages($input: GetChannelInput!) {
          channel(input: $input) {
            messages {
              id
              text
            }
          }
        }
      `,
      variables: {
        input: { id: channels[0].id },
      },
    });

    expect(response.data.channel).toMatchSnapshot();
  });

  test('gets list of channels', async () => {
    const response = await gqlClient.query({
      query: gql`
        query GetChannels {
          channels {
            id
            name
            serverId
          }
        }
      `,
    });

    expect(response.data.channels).toMatchSnapshot();
  });

  test('gets list of channels with messages', async () => {
    const response = await gqlClient.query({
      query: gql`
        query GetChannelsWithMessages {
          channels {
            messages {
              id
              text
            }
          }
        }
      `,
    });

    expect(response.data.channels).toMatchSnapshot();
  });

  test('creates a channel', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation CreateChannel($input: CreateChannelInput!) {
          createChannel(input: $input) {
            id
            name
            serverId
          }
        }
      `,
      variables: {
        input: {
          name: 'Testing 123',
          serverId: servers[0].id,
        },
      },
    });

    expect(response.data.createChannel).toMatchSnapshot({
      id: expect.any(String),
    });
  });
});
