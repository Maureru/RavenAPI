const express = require('express');
const router = express.Router();

const { Likes, CommentLikes } = require('../models');

router.post('/', async (req, res) => {
  const { UserId, PostId } = req.body;

  try {
    const found = await Likes.findOne({
      where: {
        UserId: UserId,
        PostId: PostId,
      },
    });

    if (!found) {
      await Likes.create({
        UserId: UserId,
        PostId: PostId,
      });
      res.json({ liked: true, msg: 'Liked' });
    } else {
      await Likes.destroy({
        where: {
          UserId: UserId,
          PostId: PostId,
        },
      });
      res.json({ liked: false, msg: 'UnLiked' });
    }
  } catch (err) {
    res.json({ error: 'Network Error!' });
  }
});

router.post('/comment', async (req, res) => {
  const { CommentId, UserId } = req.body;

  try {
    const found = await CommentLikes.findOne({
      where: {
        UserId: UserId,
        CommentId: CommentId,
      },
    });

    if (!found) {
      await CommentLikes.create({
        UserId: UserId,
        CommentId: CommentId,
      });
      res.json({ liked: true, msg: 'Comment Liked' });
    } else {
      await CommentLikes.destroy({
        where: {
          UserId: UserId,
          CommentId: CommentId,
        },
      });
      res.json({ liked: false, msg: 'Comment UnLiked' });
    }
  } catch (err) {
    res.json({ error: 'Network Error!' });
  }
});

module.exports = router;
