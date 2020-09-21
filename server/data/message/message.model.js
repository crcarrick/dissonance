export const message = ({ sequelize, Sequelize }) => {
  const Message = sequelize.define('message', {
    text: Sequelize.STRING,
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Channel);
    Message.belongsTo(models.User, { as: 'author' });
  };

  return Message;
};
