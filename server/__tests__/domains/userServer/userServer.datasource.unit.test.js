import { ForbiddenError } from 'apollo-server';
import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';
import { UserServerDataSource } from '@dissonance/domains/userServer';
import { userMock, userServerMock } from '@dissonance/test-utils';

describe('UserServer', () => {
  let dbClient;
  let usersServers;
  beforeAll(() => {
    dbClient = knex({});
    usersServers = new UserServerDataSource(dbClient, TABLE_NAMES.CHANNELS);

    usersServers.initialize({
      cache: {},
      context: {
        user: userMock(),
      },
    });
  });

  test('joins a server', async () => {
    const userServer = userServerMock({ userId: usersServers.context.user.id });

    dbClient().returning.mockReturnValueOnce([userServer]);

    const response = await usersServers.joinServer(userServer.serverId);

    expect(dbClient().insert).toHaveBeenCalledWith(userServer);
    expect(response).toEqual(userServer);
  });

  test('throws when no user is present on the context', async () => {
    usersServers.context.user = null;

    await expect(usersServers.joinServer('1')).rejects.toThrow(ForbiddenError);
  });
});
