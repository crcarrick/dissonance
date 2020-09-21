export const channel = ({ sequelize, Sequelize }) => {
  const Channel = sequelize.define('channel', {
    name: Sequelize.STRING,
  });

  Channel.associate = (models) => {
    Channel.belongsTo(models.Server);
    Channel.hasMany(models.Message);
  };

  return Channel;
};
