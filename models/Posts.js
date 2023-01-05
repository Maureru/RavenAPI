module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
    postImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: 'cascade',
    });
    Posts.belongsTo(models.Users, {
      foreignKey: 'UserId',
      onDelete: 'cascade',
    });
    Posts.hasMany(models.Likes, {
      onDelete: 'cascade',
    });
  };

  return Posts;
};
