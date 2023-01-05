module.exports = (sequelize, DataTypes) => {
  const Followers = sequelize.define('Followers', {
    FollowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Followers.associate = (models) => {
    Followers.belongsTo(models.Users, {
      foreignKey: 'UserId',
      onDelete: 'cascade',
    });
  };

  return Followers;
};
