import { DataTypes, Model } from 'sequelize';

export const channel = ({ sequelize }) => {
  class Channel extends Model {
    static associate(models) {
      Channel.hasMany(models.Message, { onDelete: 'cascade' });
    }
  }

  Channel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  return Channel;
};
