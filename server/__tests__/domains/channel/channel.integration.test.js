import { gql } from 'apollo-server';

import { createDbClient } from '@dissonance/database';

import {
  createTestClient,
  generateData,
  migrate,
  rollback,
  seedDatabase,
} from '@dissonance/test-utils';

const knex = jest.requireActual('knex');

describe('Channel Integration', () => {
  const mockData = generateData();
  const { users, channels, servers } = mockData;

  // All Hooks
  let dbClient;
  beforeAll((done) => {
    dbClient = createDbClient(knex);

    migrate(dbClient).then(() => done());
  });

  afterAll((done) => {
    rollback()
      .then(() => dbClient.destroy())
      .then(() => done());
  });

  // Each Hooks
  let gqlClient;
  beforeEach(async (done) => {
    await seedDatabase(dbClient);

    gqlClient = createTestClient({
      context: {
        user: users[0],
      },
      dbClient,
    });

    done();
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
