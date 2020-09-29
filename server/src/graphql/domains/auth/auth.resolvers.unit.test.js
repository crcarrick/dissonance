import { resolvers } from './auth.resolvers';

describe('Auth Resolvers', () => {
  describe('Query', () => {
    test('me', () => {
      const user = { id: '1' };

      const expected = resolvers.Query.me(null, null, { user });

      expect(expected).toEqual(user);
    });
  });

  describe('Mutation', () => {
    test('login', () => {
      const input = { email: 'user1@test.com', password: 'user1' };
      const dataSources = {
        auth: {
          login: jest.fn(),
        },
      };

      resolvers.Mutation.login(null, { input }, { dataSources });

      expect(dataSources.auth.login.mock.calls[0][0]).toEqual(input);
    });

    test('signup', () => {
      const input = {
        email: 'user1@test.com',
        password: 'user1',
        username: 'user1',
      };
      const dataSources = {
        auth: {
          signup: jest.fn(),
        },
      };

      resolvers.Mutation.signup(null, { input }, { dataSources });

      expect(dataSources.auth.signup.mock.calls[0][0]).toEqual(input);
    });
  });

  describe('Auth User', () => {
    test('servers', () => {
      const user = { id: '1' };
      const dataSources = {
        servers: {
          getByUser: jest.fn(),
        },
      };

      resolvers.AuthUser.servers(user, null, { dataSources });

      expect(dataSources.servers.getByUser.mock.calls[0][0]).toBe(user.id);
    });
  });
});
