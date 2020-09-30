import casual from 'casual';
import _ from 'lodash';

export const generateData = () => {
  casual.seed(7788);

  const users = _.times(3, () => {
    const id = casual.uuid;
    const username = casual.username;

    return {
      id,
      email: `${username}@test.com`,
      password: casual.password,
      username,
      avatarUrl: `https://test.s3.amazonaws.com/${id}.png`,
    };
  });

  const servers = _.times(3, (index) => {
    const id = casual.uuid;

    return {
      id,
      name: casual.title,
      ownerId: users[index].id,
      avatarUrl: `https://test.s3.amazonaws.com/${id}.png`,
    };
  });

  const channels = _.flatten(
    _.times(3, (index) => [
      {
        id: casual.uuid,
        name: 'welcome',
        serverId: servers[index].id,
      },
      {
        id: casual.uuid,
        name: 'general',
        serverId: servers[index].id,
      },
    ])
  );

  const messages = _.flatten(
    _.times(3, (index) => [
      {
        id: casual.uuid,
        text: casual.sentence,
        authorId: users[index].id,
        channelId: channels[index * 2].id,
      },
      {
        id: casual.uuid,
        text: casual.sentence,
        authorId: users[index].id,
        channelId: channels[index * 2 + 1].id,
      },
    ])
  );

  const usersServers = _.times(3, (index) => ({
    serverId: servers[index].id,
    userId: users[index].id,
  }));

  return {
    users,
    servers,
    channels,
    messages,
    usersServers,
  };
};
