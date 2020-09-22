import { DataTypes, Model } from 'sequelize';

export const server = ({ sequelize }) => {
  class Server extends Model {
    static associate(models) {
      Server.hasMany(models.Channel, {
        onDelete: 'cascade',
      });

      Server.belongsTo(models.User, {
        as: 'Owner',
        foreignKey: 'OwnerId',
      });
      Server.belongsToMany(models.User, {
        through: models.UserServer,
      });
    }
  }

  Server.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: 'false',
      },
    },
    { sequelize }
  );

  return Server;
};
