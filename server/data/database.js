import { Model, Sequelize } from 'sequelize';

import { channel } from './channel/channel.model';
import { message } from './message/message.model';
import { server } from './server/server.model';
import { user } from './user/user.model';

export const connectDatabase = () => {
  const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
      logging: false,
    }
  );

  const Channel = channel({ sequelize });
  const Message = message({ sequelize });
  const Server = server({ sequelize });
  const User = user({ sequelize });

  class UserServer extends Model {}

  UserServer.init({}, { sequelize, tableName: 'users_servers' });

  const models = { Channel, Message, Server, User, UserServer };

  Object.keys(models).forEach((key) => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });

  return { models, sequelize };
};
