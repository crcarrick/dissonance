import { ForbiddenError } from 'apollo-server';
import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';
import { UserServerDataSource } from '@dissonance/domains/userServer';

describe('UserServer', () => {
  let dbClient;
  let usersServers;
  beforeAll(() => {
    dbClient = knex({});
    usersServers = new UserServerDataSource(dbClient, TABLE_NAMES.CHANNELS);

    usersServers.initialize({
      cache: {},
      context: {
        user: {
          id: '1',
        },
      },
    });
  });

  test('joins a server', async () => {
    dbClient().returning.mockReturnValueOnce([{ serverId: '1', userId: '1' }]);

    const response = await usersServers.joinServer('1');

    expect(dbClient().insert).toHaveBeenCalledWith({
      serverId: '1',
      userId: '1',
    });
    expect(response).toEqual({
      serverId: '1',
      userId: '1',
    });
  });

  test('throws when no user is present on the context', async () => {
    usersServers.context.user = null;

    await expect(usersServers.joinServer('1')).rejects.toThrow(ForbiddenError);
  });
});
