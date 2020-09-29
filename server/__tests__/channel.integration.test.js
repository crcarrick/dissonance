import { gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import knex from 'knex';

import {
  createDbClient,
  createDatabase,
  destroyDatabase,
  createServer,
} from './../__test_utils__';

import { ChannelDataSource } from '@dissonance/domains/channel';
import { MessageDataSource } from '@dissonance/domains/message';
import { TABLE_NAMES } from '@dissonance/constants';

xdescribe('Channel Integration', () => {
  const dbClient = createDbClient(knex);

  let query;
  beforeEach(async (done) => {
    const server = createServer({
      context: {
        user: {
          id: '1',
          email: 'foo@bar.com',
          username: 'foo',
        },
      },
      dataSources: () => ({
        channels: new ChannelDataSource(dbClient, TABLE_NAMES.CHANNELS),
        messages: new MessageDataSource(dbClient, TABLE_NAMES.MESSAGES),
      }),
    });

    await createDatabase(dbClient);
    await dbClient(TABLE_NAMES.SERVERS).insert({
      id: '1',
      name: 'Test Server',
    });
    await dbClient(TABLE_NAMES.CHANNELS).insert([
      { id: '1', name: 'Test Channel 1', serverId: '1' },
      { id: '2', name: 'Test Channel 2', serverId: '1' },
      { id: '3', name: 'Test Channel 3', serverId: '1' },
    ]);
    await dbClient(TABLE_NAMES.MESSAGES).insert([
      { id: '1', text: 'Test Message', channelId: '1' },
    ]);

    const testClient = createTestClient(server);

    query = testClient.query;

    done();
  });

  afterEach(async (done) => {
    await destroyDatabase(dbClient);

    done();
  });

  test('gets a channel', async () => {
    const response = await query({
      query: gql`
        query GetChannel($input: GetChannelInput!) {
          channel(input: $input) {
            id
            name
            serverId
            messages {
              id
            }
          }
        }
      `,
      variables: {
        input: { id: '1' },
      },
    });

    expect(response).toMatchSnapshot();
  });

  test('gets list of channels', async () => {
    const response = await query({
      query: gql`
        query GetChannels {
          channels {
            id
            name
            serverId
            messages {
              id
            }
          }
        }
      `,
    });

    expect(response).toMatchSnapshot();
  });

  test('creates a channel', async () => {
    const response = await query({
      query: gql`
        mutation CreateChannel($input: CreateChannelInput!) {
          createChannel(input: $input) {
            name
            serverId
          }
        }
      `,
      variables: {
        input: {
          name: 'Test Channel 4',
          serverId: '1',
        },
      },
    });

    expect(response).toMatchSnapshot();
  });
});
