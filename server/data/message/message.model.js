import { DataTypes, Model } from 'sequelize';

export const message = ({ sequelize }) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Channel, { foreignKey: 'channelId' });
      Message.belongsTo(models.User, {
        as: 'author',
        foreignKey: 'authorId',
      });
    }
  }

  Message.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'messages' }
  );

  return Message;
};
