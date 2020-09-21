import { Sequelize } from 'sequelize';

import { channel } from './channel';
import { message } from './message';
import { server } from './server';
import { user } from './user';

export const connectDatabase = () => {
  const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
    }
  );

  const db = {
    sequelize,
    Sequelize,
  };

  const Channel = channel(db);
  const Message = message(db);
  const Server = server(db);
  const User = user(db);

  return seq;
};
