import bcrypt from 'bcrypt';
import { addDays, getUnixTime } from 'date-fns';
import jwt from 'jsonwebtoken';

import { DatabaseService } from './../database.service';

import { TableNames } from './../constants';

export class UserService extends DatabaseService {
  table = TableNames.USERS;

  constructor(args) {
    super(args);
  }

  findByEmail(email) {
    return this.connection(TableNames.USERS).where('email', email).first();
  }

  generateJWT({ id, username }) {
    const today = new Date();
    const exp = addDays(today, 1);

    return jwt.sign(
      {
        id,
        username,
        exp: getUnixTime(exp),
      },
      process.env.JWT_SECRET
    );
  }

  async isMemberOfChannel({ channelId, userId }) {
    const channel = await this.connection(TableNames.CHANNELS)
      .whereIn(
        'serverId',
        this.connection(TableNames.USERS_SERVERS)
          .select('serverId')
          .where('userId', userId)
      )
      .andWhere('id', channelId)
      .first();

    return Boolean(channel);
  }

  joinServer({ userId, serverId }) {
    return this.connection(TableNames.USERS_SERVERS).insert({
      userId,
      serverId,
    });
  }

  async signup({ email, password, username }) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const [user] = await this.connection(TableNames.USERS)
      .insert({ email, password: hashedPassword, username })
      .returning(['id', 'email', 'username']);

    return user;
  }

  validatePassword({ candidate, password }) {
    return bcrypt.compareSync(candidate, password);
  }
}
