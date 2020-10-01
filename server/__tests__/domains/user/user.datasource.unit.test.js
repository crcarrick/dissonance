import casual from 'casual';
import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';
import { UserDataSource } from '@dissonance/domains/user';
import { userMock } from '@dissonance/test-utils';

describe('UserDataSource', () => {
  const user1 = userMock();
  const user2 = userMock();
  const user3 = userMock();
  const user4 = userMock();

  user1.serverId = casual.uuid;
  user2.serverId = casual.uuid;
  user3.serverId = casual.uuid;
  user4.serverId = user3.serverId;

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
      dbClient().select.mockResolvedValueOnce([user1]);

      const expected = await users.getByEmail(user1.email);

      expect(dbClient().select).toHaveBeenCalledTimes(1);
      expect(expected).toEqual(user1);
    });

    test('users by server using a dataloader', async () => {
      dbClient().select.mockResolvedValueOnce([user4, user3, user2, user1]);

      const expected = await Promise.all([
        users.getByServer(user1.serverId),
        users.getByServer(user2.serverId),
        users.getByServer(user3.serverId),
      ]);

      expect(dbClient().select).toHaveBeenCalledTimes(1);

      expect(expected).toEqual(
        expect.arrayContaining([
          [user1],
          [user2],
          expect.arrayContaining([user3, user4]),
        ])
      );
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

      expect(dbClient().where).toHaveBeenCalledWith(
        'id',
        users.context.user.id
      );
      expect(dbClient().update).toHaveBeenCalledWith('avatarUrl', expected.url);
    });
  });
});
