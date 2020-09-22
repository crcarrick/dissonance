import { DataTypes, Model } from 'sequelize';

import bcrypt from 'bcrypt';
import { addDays, getUnixTime } from 'date-fns';
import jwt from 'jsonwebtoken';

export const user = ({ sequelize }) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Server, {
        through: models.UserServer,
      });
    }

    generateJWT() {
      const today = new Date();
      const exp = addDays(today, 1);

      return jwt.sign(
        {
          id: this.id,
          username: this.username,
          exp: getUnixTime(exp),
        },
        process.env.JWT_SECRET
      );
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, 10);
  });

  return User;
};
