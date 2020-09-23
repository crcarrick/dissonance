import knex from 'knex';

import camelCaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';

import { ChannelService } from './channel/channel.service';
import { MessageService } from './message/message.service';
import { ServerService } from './server/server.service';
import { UserService } from './user/user.service';

export const connectDatabase = () => {
  const connection = knex({
    client: 'postgres',
    connection: {
      host: 'localhost',
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    postProcessResponse: (result) => camelCaseKeys(result),
    wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),
  });

  return {
    services: {
      channelService: new ChannelService({ connection }),
      messageService: new MessageService({ connection }),
      serverService: new ServerService({ connection }),
      userService: new UserService({ connection }),
    },
  };
};
