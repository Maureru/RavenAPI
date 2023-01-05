module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {}, { timestamps: false });

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: 'UserId',
      onDelete: 'cascade',
    });
  };

  return Likes;
};
