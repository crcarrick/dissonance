export const user = ({ sequelize, Sequelize }) => {
  const User = sequelize.define('user', {
    email: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
  });

  User.associate = (models) => {
    // User.belongsToMany(models.Server);
    User.hasMany(models.Message);
    User.hasMany(models.Server);
    User.belongsToMany(models.Server);
  };

  return User;
};
