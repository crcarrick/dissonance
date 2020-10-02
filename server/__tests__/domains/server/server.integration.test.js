import { gql } from 'apollo-server';
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { createDbClient } from '@dissonance/database';

import {
  createTestClient,
  generateMockData,
  seedDatabase,
} from '@dissonance/test-utils';

const knex = jest.requireActual('knex');

describe('Server Integration', () => {
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

  test('gets a server', async () => {
    const response = await gqlClient.query({
      query: gql`
        query GetServer($input: GetServerInput!) {
          server(input: $input) {
            id
            name
          }
        }
      `,
      variables: {
        input: {
          id: servers[0].id,
        },
      },
    });

    expect(response.data.server).toMatchSnapshot();
  });

  test('gets all servers', async () => {
    const response = await gqlClient.query({
      query: gql`
        query GetServers {
          servers {
            id
            name
          }
        }
      `,
    });

    expect(response.data.servers).toMatchSnapshot();
  });

  test('creates a signed url for avatar upload when provided an image', async () => {
    aws.S3Mock.getSignedUrlPromise.mockReturnValueOnce('https://www.test.com');
    uuidv4.mockReturnValueOnce('1234');

    const response = await gqlClient.mutate({
      mutation: gql`
        mutation CreateServerAvatarSignedUrl(
          $input: CreateServerSignedUrlInput!
        ) {
          createServerAvatarSignedUrl(input: $input) {
            signedUrl
            url
          }
        }
      `,
      variables: {
        input: {
          fileName: 'test.png',
          serverId: servers[0].id,
        },
      },
    });

    expect(response.data.createServerAvatarSignedUrl).toMatchSnapshot();
  });

  test('does not create a signed url for avatar upload when provided a non-image', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation CreateServerAvatarSignedUrl(
          $input: CreateServerSignedUrlInput!
        ) {
          createServerAvatarSignedUrl(input: $input) {
            signedUrl
            url
          }
        }
      `,
      variables: {
        input: {
          fileName: 'test.pdf',
          serverId: servers[0].id,
        },
      },
    });

    expect(response.errors).toMatchSnapshot();
  });

  test('creates a server', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation CreateServer($input: CreateServerInput!) {
          createServer(input: $input) {
            id
            name
          }
        }
      `,
      variables: {
        input: {
          name: 'Testing 123',
        },
      },
    });

    expect(response.data.createServer).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  test('deletes a server if authorized', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation DeleteServer($input: DeleteServerInput!) {
          deleteServer(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          id: servers[0].id,
        },
      },
    });

    expect(response.data.deleteServer).toMatchSnapshot();
  });

  test('does not delete a server if unauthorized', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation DeleteServer($input: DeleteServerInput!) {
          deleteServer(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          id: servers[1].id,
        },
      },
    });

    expect(response.errors).toMatchSnapshot();
  });
});
