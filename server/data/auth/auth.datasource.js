import { ApolloError, AuthenticationError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { addDays, getUnixTime } from 'date-fns';
import jwt from 'jsonwebtoken';

import { SQLDataSource } from '../sql.datasource';

export class AuthDataSource extends SQLDataSource {
  async login({ email, password }) {
    try {
      const {
        dataSources: { users },
      } = this.context;

      const user = await users.byEmailLoader.load(email);

      if (!user) {
        throw new AuthenticationError('Email does not exist');
      }

      const match = this.validatePassword({
        candidate: password,
        password: user.password,
      });

      if (!match) {
        throw new AuthenticationError('Password does not match');
      }

      return { token: this.generateJWT(user), user };
    } catch (error) {
      this.didEncounterError(error);
    }
  }

  async signup({ email, password, username }) {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);

      const [user] = await this.db(this.table)
        .insert({ email, password: hashedPassword, username })
        .returning([
          'id',
          'email',
          'username',
          'avatarUrl',
          'createdAt',
          'updatedAt',
        ]);

      return { token: this.generateJWT(user), user };
    } catch (error) {
      let err = error;

      if (error.constraint === 'users_email_unique') {
        err = new ApolloError('Email is already in use', 'SIGNUP_EMAIL_IN_USE');
      } else if (error.constraint === 'users_username_unique') {
        err = new ApolloError(
          'Username is already in use',
          'SIGNUP_USERNAME_IN_USE'
        );
      }

      this.didEncounterError(err);
    }
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

  validatePassword({ candidate, password }) {
    return bcrypt.compareSync(candidate, password);
  }
}
