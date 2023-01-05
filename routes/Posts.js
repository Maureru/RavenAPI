const express = require('express');
const router = express.Router();
const { Posts } = require('../models');
const { Users, Comments, Likes } = require('../models');

const { validateToken } = require('../middlewares/AuthMiddleware');

router.post('/', validateToken, async (req, res) => {
  const { postText, postImage, UserId } = req.body;
  console.log(postText, postImage, UserId);
  try {
    await Posts.create({
      postText: postText,
      postImage: postImage,
      UserId: UserId,
    });
    res.json({ msg: 'Posted' });
  } catch (err) {
    res.json({ error: err });
  }
});

const Sequelize = require('sequelize');

router.get('/trend', async (req, res) => {
  const trendPost = await Posts.findAll({
    include: [
      {
        model: Users,
      },
      {
        model: Likes,
      },
    ],
    order: Sequelize.literal('rand()'),
    limit: 2,
  });

  res.json(trendPost);
});

router.get('/', validateToken, async (req, res) => {
  const posts = await Posts.findAll({
    include: [
      {
        model: Users,
      },
      {
        model: Comments,
      },
      {
        model: Likes,
      },
    ],
    order: Sequelize.literal('rand()'),
  });

  const likedPost = await Likes.findAll({
    where: {
      UserId: req.user.id,
    },
  });

  res.json({ posts: posts, likedPost: likedPost });
});

router.get('/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const post = await Posts.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Users,
      },
      {
        model: Comments,
      },
      {
        model: Likes,
      },
    ],
  });

  const isLike = await Likes.findOne({
    where: {
      PostId: id,
      UserId: req.user.id,
    },
  });

  if (!isLike) {
    res.json({ post: post, isLike: false });
  } else {
    res.json({ post: post, isLike: true });
  }
});

router.get('/profile/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const posts = await Posts.findAll({
    where: {
      UserId: id,
    },
    include: [
      {
        model: Users,
      },
      {
        model: Likes,
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const likedPost = await Likes.findAll({
    where: {
      UserId: req.user.id,
    },
  });

  res.json({ posts: posts, likedPost: likedPost });
});

module.exports = router;
