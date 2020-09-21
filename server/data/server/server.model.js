export const server = ({ sequelize, Sequelize }) => {
  const Server = sequelize.define('server', {
    name: Sequelize.STRING,
  });

  Server.associate = (models) => {
    Server.hasMany(models.Channel);
    Server.belongsTo(models.User, { as: 'owner' });
  };

  return Server;
};
