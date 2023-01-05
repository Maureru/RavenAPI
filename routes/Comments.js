const express = require('express');
const router = express.Router();
const { Users, Comments, CommentLikes } = require('../models');
const Sequelize = require('sequelize');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get('/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const comments = await Comments.findAll({
    where: { PostId: id },
    include: [
      {
        model: Users,
      },
      {
        model: CommentLikes,
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const likedComments = await CommentLikes.findAll({
    where: {
      UserId: req.user.id,
    },
  });

  res.json({ comments: comments, likedComments: likedComments });
});

router.post('/', async (req, res) => {
  const { comment, UserId, PostId } = req.body;

  try {
    await Comments.create({
      comment: comment,
      UserId: UserId,
      PostId: PostId,
    });
    res.json({ msg: 'Posted' });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;
