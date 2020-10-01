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

describe('User Integration', () => {
  const { users } = generateMockData();

  let dbClient;
  beforeAll(() => {
    dbClient = createDbClient(
      knex,
      `dissonance_test_${process.env.JEST_WORKER_ID}`
    );
  });

  afterAll((done) => {
    dbClient.destroy().then(() => done());
  });

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

  test('creates a signed url for avatar upload when provided an image', async () => {
    aws.s3Mock.getSignedUrlPromise.mockReturnValueOnce('https://www.test.com');
    uuidv4.mockReturnValueOnce('1234');

    const response = await gqlClient.mutate({
      mutation: gql`
        mutation CreateUserAvatarSignedUrl($input: CreateUserSignedUrlInput!) {
          createUserAvatarSignedUrl(input: $input) {
            signedUrl
            url
          }
        }
      `,
      variables: {
        input: {
          fileName: 'test.png',
        },
      },
    });

    expect(response.data.createUserAvatarSignedUrl).toMatchSnapshot();
  });

  test('does not create a signed url for avatar upload when provided a non-image', async () => {
    const response = await gqlClient.mutate({
      mutation: gql`
        mutation CreateUserAvatarSignedUrl($input: CreateUserSignedUrlInput!) {
          createUserAvatarSignedUrl(input: $input) {
            signedUrl
            url
          }
        }
      `,
      variables: {
        input: {
          fileName: 'test.pdf',
        },
      },
    });

    expect(response.errors).toMatchSnapshot();
  });
});
