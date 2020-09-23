import bcrypt from 'bcrypt';
import { addDays, getUnixTime } from 'date-fns';
import jwt from 'jsonwebtoken';

import { DatabaseService } from './../database.service';

export class UserService extends DatabaseService {
  constructor({ connection }) {
    super();

    this.connection = connection;
    this.table = 'users';
  }

  findByEmail(email) {
    return this.getTable().where('email', email).first();
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

  getServers(id) {
    return this.connection('servers').whereIn(
      'id',
      this.connection('users_servers').select('server_id').where('user_id', id)
    );
  }

  async isMemberOfChannel({ channelId, userId }) {
    const channel = await this.connection('channels')
      .whereIn(
        'server_id',
        this.connection('users_servers')
          .select('server_id')
          .where('user_id', userId)
      )
      .andWhere('id', channelId)
      .first();

    return Boolean(channel);
  }

  joinServer({ userId, serverId }) {
    return this.connection('users_servers').insert({
      user_id: userId,
      server_id: serverId,
    });
  }

  async signup({ email, password, username }) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const [user] = await this.getTable()
      .insert({ email, password: hashedPassword, username })
      .returning(['id', 'email', 'username']);

    return user;
  }

  validatePassword({ candidate, password }) {
    return bcrypt.compareSync(candidate, password);
  }
}
