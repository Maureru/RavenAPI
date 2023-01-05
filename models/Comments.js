module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.hasMany(models.CommentLikes, {
      onDelete: 'cascade',
    });
    Comments.belongsTo(models.Users, {
      foreignKey: 'UserId',
      onDelete: 'cascade',
    });
    Comments.belongsTo(models.Posts, {
      foreignKey: 'PostId',
      onDelete: 'cascade',
    });
  };

  return Comments;
};
