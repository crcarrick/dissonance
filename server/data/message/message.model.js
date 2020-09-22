import { DataTypes, Model } from 'sequelize';

export const message = ({ sequelize }) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        as: 'Author',
        foreignKey: 'AuthorId',
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  return Message;
};
