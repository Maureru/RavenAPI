module.exports = (sequelize, DataTypes) => {
  const CommentLikes = sequelize.define(
    'CommentLikes',
    {},
    { timestamps: false }
  );

  CommentLikes.associate = (models) => {
    CommentLikes.belongsTo(models.Comments, {
      foreignKey: 'CommentId',
      onDelete: 'cascade',
    });
  };

  return CommentLikes;
};
