import { DataTypes, Model } from 'sequelize';

export const server = ({ sequelize }) => {
  class Server extends Model {
    static associate(models) {
      Server.hasMany(models.Channel, { foreignKey: 'serverId' });

      Server.belongsTo(models.User, {
        as: 'owner',
        foreignKey: 'ownerId',
      });
      Server.belongsToMany(models.User, {
        through: models.UserServer,
        foreignKey: 'serverId',
      });
    }
  }

  Server.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: 'false',
      },
    },
    { sequelize, tableName: 'servers' }
  );

  return Server;
};
