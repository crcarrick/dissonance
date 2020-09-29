import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';

import { AuthDataSource } from './auth.datasource';

describe('AuthDataSource', () => {
  const user = {
    id: '1',
    email: 'user1@test.com',
    username: 'user1',
    password: 'user1',
  };

  let dbClient;
  let auth;
  beforeAll(() => {
    process.env.JWT_SECRET = 'supersecret';

    dbClient = knex({});

    auth = new AuthDataSource(dbClient, TABLE_NAMES.USERS);

    auth.initialize({
      cache: {},
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
    test('authenticates with correct credentials', async () => {
      auth.context.dataSources.users.byEmailLoader.load.mockReturnValueOnce(
        user
      );

      const validatePasswordSpy = jest.spyOn(auth, 'validatePassword');
      const generateJWTSpy = jest.spyOn(auth, 'generateJWT');

      const expected = await auth.login({
        email: user.email,
        password: user.password,
      });

      expect(validatePasswordSpy).toHaveBeenCalledWith({
        candidate: user.password,
        password: user.password,
      });
      expect(generateJWTSpy).toHaveBeenCalledWith(user);
      expect(expected.token).toBeDefined();
      expect(expected.user).toEqual(user);
    });

    test('throws the correct error with incorrect email', async () => {
      auth.context.dataSources.users.byEmailLoader.load.mockReturnValueOnce(
        null
      );

      await expect(auth.login({})).rejects.toThrow('Email does not exist');
    });

    test('throws the correct error with incorrect password', async () => {
      auth.context.dataSources.users.byEmailLoader.load.mockReturnValueOnce({
        email: user.email,
        password: 'user2',
      });

      await expect(
        auth.login({ email: user.email, password: user.password })
      ).rejects.toThrow('Password does not match');
    });
  });

  describe('signup', () => {
    test('creates a new user', async () => {
      dbClient().returning.mockReturnValueOnce([user]);

      const expected = await auth.signup(user);

      expect(dbClient().insert.mock.calls[0][0]).toEqual({
        email: user.email,
        password: user.password,
        username: user.username,
      });
      expect(expected.user).toEqual(user);
    });

    test('authenticates the new user', async () => {
      dbClient().returning.mockReturnValueOnce([user]);

      const expected = await auth.signup(user);

      expect(dbClient().insert.mock.calls[0][0]).toEqual({
        email: user.email,
        password: user.password,
        username: user.username,
      });

      expect(expected.token).toBeDefined();
    });

    test('throws the correct errors with existing email', async () => {
      dbClient().returning.mockImplementationOnce(() => {
        const error = new Error();

        error.constraint = 'users_email_unique';

        throw error;
      });

      await expect(auth.signup(user)).rejects.toThrow(
        'Email is already in use'
      );
    });

    test('throws the correct errors with existing username', async () => {
      dbClient().returning.mockImplementationOnce(() => {
        const error = new Error();

        error.constraint = 'users_username_unique';

        throw error;
      });

      await expect(auth.signup(user)).rejects.toThrow(
        'Username is already in use'
      );
    });
  });
});
