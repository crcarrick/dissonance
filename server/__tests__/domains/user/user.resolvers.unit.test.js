import { resolvers } from '@dissonance/domains/user';

describe('User Resolvers', () => {
  describe('Mutation', () => {
    test('createUserAvatarSignedUrl', () => {
      const input = { fileName: 'test.png' };
      const dataSources = {
        users: {
          createSignedUrl: jest.fn(),
        },
      };

      resolvers.Mutation.createUserAvatarSignedUrl(
        null,
        { input },
        { dataSources }
      );

      expect(dataSources.users.createSignedUrl).toHaveBeenCalledWith(
        input.fileName
      );
    });
  });
});
