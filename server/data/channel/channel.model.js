import { DataTypes, Model } from 'sequelize';

export const channel = ({ sequelize }) => {
  class Channel extends Model {
    static associate(models) {
      Channel.hasMany(models.Message, { onDelete: 'cascade' });
    }
  }

  Channel.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  return Channel;
};
