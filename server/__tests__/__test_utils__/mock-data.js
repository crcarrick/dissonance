import casual from 'casual';
import { flatten, times } from 'lodash';

export const userMock = ({ serverId } = {}) => {
  const id = casual.uuid;
  const username = casual.username;

  let user = {
    id,
    email: `${username}@test.com`,
    password: casual.password,
    username,
    avatarUrl: `https://test.s3.amazonaws.com/${id}.png`,
  };

  // Not a real column of user table, only there to test user.dataloader
  if (serverId) {
    user.serverId = serverId;
  }

  return user;
};

export const serverMock = ({ ownerId, userId } = {}) => {
  const id = casual.uuid;

  const server = {
    id,
    name: casual.title,
    ownerId: ownerId || casual.uuid,
    avatarUrl: `https://test.s3.amazonaws.com/${id}.png`,
  };

  // Not a real column of user table, only there to test server.dataloader
  if (userId) {
    server.userId = userId;
  }

  return server;
};

export const channelMock = ({ name, serverId } = {}) => ({
  id: casual.uuid,
  name: name || casual.title,
  serverId: serverId || casual.uuid,
});

export const messageMock = ({ authorId, channelId } = {}) => ({
  id: casual.uuid,
  text: casual.sentence,
  authorId: authorId || casual.uuid,
  channelId: channelId || casual.uuid,
});

export const userServerMock = ({ serverId, userId } = {}) => ({
  serverId: serverId || casual.uuid,
  userId: userId || casual.uuid,
});

export const generateMockData = () => {
  casual.seed(7788);

  const users = times(3, () => userMock());
  const servers = times(3, (index) => serverMock({ ownerId: users[index].id }));
  const channels = flatten(
    times(3, (index) => [
      channelMock({ name: 'welcome', serverId: servers[index].id }),
      channelMock({ name: 'general', serverId: servers[index].id }),
    ])
  );
  const messages = flatten(
    times(3, (index) => [
      messageMock({
        authorId: users[index].id,
        channelId: channels[index * 2].id,
      }),
      messageMock({
        authorId: users[index].id,
        channelId: channels[index * 2 + 1].id,
      }),
    ])
  );
  const usersServers = times(3, (index) =>
    userServerMock({ serverId: servers[index].id, userId: users[index].id })
  );

  return {
    users,
    servers,
    channels,
    messages,
    usersServers,
  };
};
