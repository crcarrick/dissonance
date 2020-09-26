import knex from 'knex';
import mockKnex from 'mock-knex';

import { TABLE_NAMES } from './../../constants';
import { UserDataSource } from './../user.datasource';

describe('UserDataSource', () => {
  const tracker = mockKnex.getTracker();
  const user1 = { id: '1', email: 'foo', username: 'foo', serverId: '1' };
  const user2 = { id: '2', email: 'bar', username: 'bar', serverId: '2' };
  const user3 = { id: '3', email: 'baz', username: 'baz', serverId: '3' };

  let users;
  beforeAll(() => {
    const dbClient = knex({
      client: 'postgres',
      connection: '',
      useNullAsDefault: false,
    });

    mockKnex.mock(dbClient);

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

  describe('gets', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('user by email', async () => {
      tracker.on('query', (query) => {
        query.response([user1]);
      });

      const expected = await users.getByEmail(user1.email);

      expect(expected.email).toBe(user1.email);
    });

    test('users by server', async () => {
      tracker.on('query', (query) => {
        query.response([user3, user2, user1]);
      });

      const [expected1] = await users.getByServer(user1.serverId);
      const [expected2] = await users.getByServer(user2.serverId);
      const [expected3] = await users.getByServer(user3.serverId);

      expect(expected1).toEqual(user1);
      expect(expected2).toEqual(user2);
      expect(expected3).toEqual(user3);
    });
  });

  describe('signed urls', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('create', async () => {
      users.createS3SignedUrl = jest.fn(() => ({
        url: 'foo',
        signedUrl: 'bar',
      }));

      tracker.on('query', (query) => {
        query.response();
      });

      const expected = await users.createSignedUrl({
        fileName: 'foo',
      });

      expect(expected).toEqual({ url: 'foo', signedUrl: 'bar' });
    });

    test('update the user with the new url', async (done) => {
      users.createS3SignedUrl = jest.fn(() => ({
        url: 'foo',
        signedUrl: 'bar',
      }));

      tracker.on('query', (query) => {
        expect(query.method).toBe('update');
        expect(query.bindings).toContain('foo');

        query.response();
      });

      await users.createSignedUrl({ fileName: 'foo' });

      done();
    });
  });
});
