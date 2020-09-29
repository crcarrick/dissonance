import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';

import { UserDataSource } from './user.datasource';

describe('UserDataSource', () => {
  const [user1, user2, user3, user4] = new Array(4).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    email: `user${i + 1}@test.com`,
    username: `user${i + 1}`,
    // use same serverId for user3 & user4 to test byServerLoader
    serverId: i === 3 ? `${i}` : `${i + 1}`,
  }));

  let dbClient;
  let users;
  beforeAll(() => {
    dbClient = knex({});

    users = new UserDataSource(dbClient, TABLE_NAMES.CHANNELS);

    users.initialize({
      cache: {},
      context: {
        user: {
          id: '1',
        },
      },
    });
  });

  describe('Gets', () => {
    test('user by email using a dataloader', async () => {
      dbClient().select.mockReturnValueOnce(Promise.resolve([user1]));

      const expected = await users.getByEmail(user1.email);

      expect(dbClient().select.mock.calls.length).toBe(1);
      expect(expected).toEqual(user1);
    });

    test('users by server using a dataloader', async () => {
      dbClient().select.mockReturnValueOnce(
        Promise.resolve([user4, user3, user2, user1])
      );

      const [expected1, expected2, expected3] = await Promise.all([
        users.getByServer(user1.serverId),
        users.getByServer(user2.serverId),
        users.getByServer(user3.serverId),
      ]);

      expect(dbClient().select.mock.calls.length).toBe(1);

      expect(expected1).toContain(user1);
      expect(expected2).toContain(user2);
      expect(expected3).toContain(user3);
      expect(expected3).toContain(user4);
    });
  });

  describe('Signed urls', () => {
    beforeEach(() => {
      users.createS3SignedUrl = jest.fn((fileName) => ({
        url: `www.test.com/${fileName}`,
        signedUrl: 'www.test.com',
      }));
    });

    test('create', async () => {
      const expected = await users.createSignedUrl('test.png');

      expect(expected.url).toBe('www.test.com/test.png');
      expect(expected.signedUrl).toBe('www.test.com');
    });

    test('update the correct user with the new url', async () => {
      const expected = await users.createSignedUrl('test.png');

      expect(dbClient().where.mock.calls[0][1]).toBe(users.context.user.id);
      expect(dbClient().update.mock.calls[0][1]).toBe(expected.url);
    });
  });
});
