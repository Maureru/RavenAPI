const express = require('express');
const router = express.Router();
const { Users, Followers } = require('../models');
const bcrypt = require('bcryptjs');

const { validateToken } = require('../middlewares/AuthMiddleware');

const { sign } = require('jsonwebtoken');

router.get('/all');

router.get('/', validateToken, async (req, res) => {
  return res.json(req.user);
});

router.post('/', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    profilePicture,
    coverPicture,
    sex,
    work,
    address,
    birthDate,
    bio,
  } = req.body;

  bcrypt.hash(password, 10).then(async (hash) => {
    await Users.create({
      firstName: firstName,
      lastName: lastName,
      password: hash,
      email: email,
      profilePicture: profilePicture,
      coverPicture: coverPicture,
      sex: sex,
      work: work,
      address: address,
      birthDate: birthDate,
      bio: bio,
    });
    const userid = await Users.findOne({ where: { email: email } });
    console.log(userid);
    const accessToken = sign(
      {
        firstName: firstName,
        id: userid.id,
        lastName: lastName,
        email: email,
        profilePicture: profilePicture,
        coverPicture: coverPicture,
        sex: sex,
        work: work,
        address: address,
        birthDate: birthDate,
        bio: bio,
      },
      'ravens'
    );

    return res.json(accessToken);
  });
});

router.post('/email-validate', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await Users.findOne({ where: { email: email } });
  console.log(user);
  if (user) {
    return res.json({ msg: 'Email already exist' });
  } else {
    return res.json({ msg: 'Email available!' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const user = await Users.findOne({ where: { email: email } });

  if (!user) return res.json({ msg: 'User doesnt exist', r: 'no user' });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) return res.json({ msg: 'Wrong password', r: 'wrong pass' });

    const accessToken = sign(
      {
        firstName: user.firstName,
        id: user.id,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPicture: user.coverPicture,
        sex: user.sex,
        work: user.work,
        address: user.address,
        birthDate: user.birthDate,
        bio: user.bio,
      },
      'ravens'
    );
    return res.json(accessToken);
  });
});

router.get('/profile/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const profile = await Users.findOne({
    where: {
      id: id,
    },
    include: [Followers],
  });

  console.log(profile);

  const isFollow = await Followers.findOne({
    where: {
      UserId: id,
      FollowerId: req.user.id,
    },
  });

  const following = await Followers.findAll({
    where: {
      FollowerId: id,
    },
  });

  if (isFollow) {
    res.json({ profile: profile, following: following, followed: true });
  } else {
    res.json({ profile: profile, following: following, followed: false });
  }
});

router.post('/follow', async (req, res) => {
  const { UserId, FollowerId } = req.body;

  try {
    const exist = await Followers.findOne({
      where: {
        FollowerId: FollowerId,
        UserId: UserId,
      },
    });

    if (!exist) {
      await Followers.create({
        FollowerId: FollowerId,
        UserId: UserId,
      });

      res.json({ followed: true, msg: 'Followed' });
    } else {
      await Followers.destroy({
        where: {
          FollowerId: FollowerId,
          UserId: UserId,
        },
      });

      res.json({ followed: false, msg: 'Unfollowed' });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

const Sequelize = require('sequelize');
const { Op } = require('sequelize');

router.get('/ravens', validateToken, async (req, res) => {
  const ravens = await Users.findAll({
    where: {
      id: {
        [Op.ne]: req.user.id,
      },
    },
    order: Sequelize.literal('rand()'),
    limit: 10,
  });

  res.json(ravens);
});

router.post('/profile/update', async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    sex,
    bio,
    work,
    address,
    coverPicture,
    profilePicture,
  } = req.body;

  try {
    await Users.update(
      {
        firstName: firstName,
        lastName: lastName,
        sex: sex,
        bio: bio,
        work: work,
        address: address,
        coverPicture: coverPicture,
        profilePicture: profilePicture,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.json({ msg: 'Profile Updated' });
  } catch (err) {
    res.json({ error: err });
  }
});

router.post('/profile/delete', async (req, res) => {
  const { id } = req.body;

  try {
    await Users.destroy({
      where: {
        id: id,
      },
    });

    res.json({ msg: 'Account Deleted' });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;
