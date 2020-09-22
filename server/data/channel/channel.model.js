import { DataTypes, Model } from 'sequelize';

export const channel = ({ sequelize }) => {
  class Channel extends Model {
    static associate(models) {
      Channel.hasMany(models.Message, { foreignKey: 'channelId' });

      Channel.belongsTo(models.Server, { foreignKey: 'serverId' });
    }
  }

  Channel.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'channels' }
  );

  return Channel;
};
