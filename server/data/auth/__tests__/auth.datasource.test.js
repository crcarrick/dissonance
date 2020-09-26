import knex from 'knex';
import mockKnex from 'mock-knex';

import { TABLE_NAMES } from './../../constants';
import { AuthDataSource } from './../auth.datasource';

describe('AuthDataSource', () => {
  const tracker = mockKnex.getTracker();
  const user = {
    id: '1',
    email: 'foo',
    username: 'bar',
    password: 'baz',
  };

  let auth;
  beforeAll(() => {
    process.env.JWT_SECRET = 'supersecret';

    const dbClient = knex({
      client: 'postgres',
      connection: '',
      useNullAsDefault: false,
    });

    mockKnex.mock(dbClient);

    auth = new AuthDataSource(dbClient, TABLE_NAMES.USERS);

    auth.initialize({
      cache: {
        get: jest.fn(),
        set: jest.fn(),
      },
      context: {
        dataSources: {
          users: {
            byEmailLoader: {
              load: jest.fn(),
            },
          },
        },
      },
    });
  });

  describe('login', () => {
    beforeEach(() => {});

    afterEach(() => {});

    test('authenticates with correct credentials', async () => {
      auth.context.dataSources.users.byEmailLoader.load.mockReturnValueOnce(
        user
      );

      const spy1 = jest.spyOn(auth, 'validatePassword');
      const spy2 = jest.spyOn(auth, 'generateJWT');

      const expected = await auth.login({
        email: user.email,
        password: user.password,
      });

      expect(spy1).toHaveBeenCalledWith({
        candidate: 'baz',
        password: user.password,
      });
      expect(spy2).toHaveBeenCalledWith(user);
      expect(expected.token).toBeDefined();
      expect(expected.user).toEqual(user);
    });

    test('throws the correct errors with incorrect credentials', async () => {
      auth.context.dataSources.users.byEmailLoader.load.mockReturnValueOnce(
        null
      );
      await expect(auth.login({ email: '', password: '' })).rejects.toThrow(
        'Email does not exist'
      );

      auth.context.dataSources.users.byEmailLoader.load.mockReturnValueOnce({
        email: user.email,
        password: 'qux',
      });
      await expect(
        auth.login({ email: user.email, password: user.password })
      ).rejects.toThrow('Password does not match');
    });
  });

  describe('signup', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('inserts a user', async () => {
      tracker.on('query', (query) => {
        query.response([user]);

        expect(query.method).toBe('insert');
        expect(query.bindings).toContain(user.email);
        expect(query.bindings).toContain(user.password);
        expect(query.bindings).toContain(user.username);
      });

      const { user: expected } = await auth.signup(user);

      expect(expected).toEqual(user);
    });

    test('authenticates the new user', async () => {
      tracker.on('query', (query) => {
        query.response([user]);
      });

      const expected = await auth.signup(user);

      expect(expected.token).toBeDefined();
      expect(expected.user).toEqual(user);
    });

    test('throws the correct errors when signup fails', async () => {
      tracker.on('query', (query, step) => {
        const steps = [
          () => query.reject({ constraint: 'users_email_unique' }),
          () => query.reject({ constraint: 'users_username_unique' }),
        ];

        steps[step - 1]();
      });

      await expect(auth.signup(user)).rejects.toThrow(
        'Email is already in use'
      );
      await expect(auth.signup(user)).rejects.toThrow(
        'Username is already in use'
      );
    });
  });
});
